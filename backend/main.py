# /backend/main.py
from fastapi import FastAPI, Request, Response, HTTPException, Depends, Body
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import httpx
from pydantic import BaseModel

app = FastAPI()

# Configure CORS to allow requests from your frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://10.71.128.218:5173"],  # Add all your frontend URLs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# qBittorrent Web UI base URL
QBITTORRENT_BASE_URL = "http://localhost:8080"

# Model for login data
class LoginData(BaseModel):
    username: str
    password: str

# Async HTTP client
async def get_http_client():
    async with httpx.AsyncClient() as client:
        yield client

@app.post("/api/login")
async def login(login_data: LoginData, response: Response, client: httpx.AsyncClient = Depends(get_http_client)):
    print(">>> /api/login hit with", login_data.username)
    try:
        qbit_response = await client.post(
            f"{QBITTORRENT_BASE_URL}/api/v2/auth/login", 
            data={
                "username": login_data.username,
                "password": login_data.password
            }
        )

        if qbit_response.status_code == 403:
            return JSONResponse(status_code=403, content={"status": "error", "message": "Too many failed login attempts. IP temporarily banned."})

        if qbit_response.status_code == 200:
            print(">>> qBittorrent response:", qbit_response.text)
            if qbit_response.text.strip().lower() == "ok.":
                sid = qbit_response.cookies.get("SID")
                if sid:
                    response.set_cookie(
                        key="qbittorrent_auth",
                        value=sid,
                        httponly=True,
                        secure=False,
                        samesite="lax",
                        path="/"
                    )
                    return {"status": "success", "message": "Login successful"}
                return JSONResponse(status_code=500, content={"status": "error", "message": "Missing session cookie from qBittorrent."})
            else:
                return JSONResponse(status_code=401, content={"status": "error", "message": "Invalid username or password"})

        return JSONResponse(status_code=500, content={"status": "error", "message": f"Unexpected response from qBittorrent ({qbit_response.status_code})"})

    except Exception as e:
        return JSONResponse(status_code=500, content={"status": "error", "message": f"Login error: {str(e)}"})


@app.get("/api/check-auth")
async def check_auth(request: Request, client: httpx.AsyncClient = Depends(get_http_client)):
    """
    Check if the user is authenticated by verifying the cookie against qBittorrent API.
    """
    # Get auth cookie
    auth_cookie = request.cookies.get("qbittorrent_auth")

    if not auth_cookie:
        return {"authenticated": False}
    
    # Test authentication against qBittorrent API
    try:
        qbit_response = await client.get(
            f"{QBITTORRENT_BASE_URL}/api/v2/app/version", 
            cookies={"SID": auth_cookie}
        )
        
        # If response is OK, the user is authenticated
        if qbit_response.status_code == 200:
            return {"authenticated": True}
    except Exception as e:
        pass
    
    # If we get here, authentication failed
    return {"authenticated": False}

@app.post("/api/logout")
async def logout(response: Response, request: Request, client: httpx.AsyncClient = Depends(get_http_client)):
    """
    Logout from qBittorrent by clearing the authentication cookie and calling qBittorrent's logout endpoint.
    """
    # Get auth cookie
    auth_cookie = request.cookies.get("qbittorrent_auth")
    
    # Call qBittorrent logout endpoint if we have a cookie
    if auth_cookie:
        try:
            await client.post(
                f"{QBITTORRENT_BASE_URL}/api/v2/auth/logout",
                cookies={"SID": auth_cookie}
            )
        except Exception as e:
            pass
    
    # Clear the authentication cookie regardless of qBittorrent response
    response.delete_cookie("qbittorrent_auth")
    return {"status": "success", "message": "Logged out successfully"}

@app.get("/api/torrents")
async def get_torrents(request: Request, client: httpx.AsyncClient = Depends(get_http_client)):
    """
    Get list of torrents from qBittorrent.
    """
    try:
        # Get the authentication cookie
        sid_cookie = request.cookies.get("qbittorrent_auth")
        
        if not sid_cookie:
            raise HTTPException(status_code=401, detail="Not authenticated")
        
        # Set up headers with auth cookie
        cookies = {"SID": sid_cookie}
        
        # Make request to qBittorrent API
        response = await client.get(
            f"{QBITTORRENT_BASE_URL}/api/v2/torrents/info",
            cookies=cookies
        )
        
        if response.status_code != 200:
            raise HTTPException(
                status_code=response.status_code, 
                detail="Error fetching torrents from qBittorrent"
            )
        
        # Return torrent data
        return response.json()
    
    except httpx.RequestError as e:
        raise HTTPException(status_code=500, detail=f"Error communicating with qBittorrent: {str(e)}")

@app.get("/api/v2/{path:path}")
async def proxy_api(path: str, request: Request, client: httpx.AsyncClient = Depends(get_http_client)):
    """
    Proxy all API requests to qBittorrent Web UI.
    This handles all GET requests to /api/v2/*.
    """
    # Get auth cookie
    auth_cookie = request.cookies.get("qbittorrent_auth")
    if not auth_cookie:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    # Forward the request to qBittorrent
    cookies = {"SID": auth_cookie}
    params = dict(request.query_params)
    
    try:
        qbit_response = await client.get(
            f"{QBITTORRENT_BASE_URL}/api/v2/{path}", 
            params=params,
            cookies=cookies
        )
        return Response(
            content=qbit_response.content,
            status_code=qbit_response.status_code,
            headers=dict(qbit_response.headers)
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error connecting to qBittorrent: {str(e)}")

@app.post("/api/v2/{path:path}")
async def proxy_api_post(path: str, request: Request, client: httpx.AsyncClient = Depends(get_http_client)):
    """
    Proxy all API POST requests to qBittorrent Web UI.
    This handles all POST requests to /api/v2/*.
    """
    # Get auth cookie
    auth_cookie = request.cookies.get("qbittorrent_auth")
    if not auth_cookie:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    # Forward the request to qBittorrent
    cookies = {"SID": auth_cookie}
    
    try:
        # Get request body
        body = await request.body()
        form_data = None
        
        # Handle different content types
        content_type = request.headers.get("content-type", "")
        if "application/x-www-form-urlencoded" in content_type:
            form_data = await request.form()
            qbit_response = await client.post(
                f"{QBITTORRENT_BASE_URL}/api/v2/{path}", 
                data=dict(form_data),
                cookies=cookies
            )
        elif "multipart/form-data" in content_type:
            form_data = await request.form()
            qbit_response = await client.post(
                f"{QBITTORRENT_BASE_URL}/api/v2/{path}", 
                files=dict(form_data),
                cookies=cookies
            )
        else:
            # JSON or other content types
            qbit_response = await client.post(
                f"{QBITTORRENT_BASE_URL}/api/v2/{path}", 
                content=body,
                headers={"Content-Type": content_type},
                cookies=cookies
            )
        
        return Response(
            content=qbit_response.content,
            status_code=qbit_response.status_code,
            headers=dict(qbit_response.headers)
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error connecting to qBittorrent: {str(e)}")

@app.get("/api/system/info")
async def get_system_info(request: Request, client: httpx.AsyncClient = Depends(get_http_client)):
    """
    Get system information including free disk space and transfer speeds.
    """
    try:
        # Get the authentication cookie
        sid_cookie = request.cookies.get("qbittorrent_auth")
        
        if not sid_cookie:
            raise HTTPException(status_code=401, detail="Not authenticated")
        
        # Set up headers with auth cookie
        cookies = {"SID": sid_cookie}
        
        # Make request to qBittorrent API
        response = await client.get(
            f"{QBITTORRENT_BASE_URL}/api/v2/transfer/info",
            cookies=cookies
        )
        
        if response.status_code != 200:
            raise HTTPException(status_code=response.status_code, detail="Failed to fetch transfer info")
        
        transfer_data = response.json()
        
        # Combine the data
        return {
            "free_space_on_disk": 1000000,
            "dl_info_speed": transfer_data.get("dl_info_speed", 0),
            "up_info_speed": transfer_data.get("up_info_speed", 0)
        }
    
    except Exception as e:
        # Log the full error for debugging
        import traceback
        traceback_str = traceback.format_exc()
        print(f"Error in system info: {str(e)}\n{traceback_str}")
        raise HTTPException(status_code=500, detail=f"Error fetching system info: {str(e)}")

# Model for search parameters
class SearchParams(BaseModel):
    query: str

@app.post("/api/torrents/add")
async def add_torrent(request: Request, client: httpx.AsyncClient = Depends(get_http_client)):
    """
    Add a torrent to qBittorrent by URL (magnet or direct torrent URL)
    """
    try:
        # Get form data instead of JSON
        form = await request.form()
        url = form.get("url")

        if not url:
            raise HTTPException(status_code=400, detail="URL is required")

        auth_cookie = request.cookies.get("qbittorrent_auth")

        if not auth_cookie:
            raise HTTPException(status_code=401, detail="Authentication required")

        # Forward to qBittorrent API
        qbit_response = await client.post(
            f"{QBITTORRENT_BASE_URL}/api/v2/torrents/add",
            cookies={"SID": auth_cookie},
            data={"urls": url}
        )

        print(f"qBittorrent response: {qbit_response.status_code} - {qbit_response.text}")

        if qbit_response.status_code != 200:
            return {"success": False, "message": f"Failed to add torrent: {qbit_response.text}"}

        return {"success": True, "message": "Torrent added successfully"}

    except Exception as e:
        print(f"Error adding torrent: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error adding torrent: {str(e)}")


@app.post("/api/torrents/pause")
async def pause_torrent(request: Request, client: httpx.AsyncClient = Depends(get_http_client)):
    """
    Pause a torrent in qBittorrent
    """
    try:
        # Parse form data
        form_data = await request.form()
        hashes = form_data.get("hashes")
        
        if not hashes:
            raise HTTPException(status_code=400, detail="Torrent hash is required")
        
        # Get the auth cookie
        auth_cookie = request.cookies.get("qbittorrent_auth")
        
        if not auth_cookie:
            raise HTTPException(status_code=401, detail="Authentication required")
        
        # Forward the request to qBittorrent
        qbit_response = await client.post(
            f"{QBITTORRENT_BASE_URL}/api/v2/torrents/pause",
            cookies={"SID": auth_cookie},
            data={"hashes": hashes}
        )
        
        if qbit_response.status_code != 200:
            return {"success": False, "message": f"Failed to pause torrent: {qbit_response.text}"}
        
        return {"success": True, "message": "Torrent paused successfully"}
        
    except Exception as e:
        print(f"Error pausing torrent: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error pausing torrent: {str(e)}")

@app.post("/api/torrents/resume")
async def resume_torrent(request: Request, client: httpx.AsyncClient = Depends(get_http_client)):
    """
    Resume a torrent in qBittorrent
    """
    try:
        # Parse form data
        form_data = await request.form()
        hashes = form_data.get("hashes")
        
        if not hashes:
            raise HTTPException(status_code=400, detail="Torrent hash is required")
        
        # Get the auth cookie
        auth_cookie = request.cookies.get("qbittorrent_auth")
        
        if not auth_cookie:
            raise HTTPException(status_code=401, detail="Authentication required")
        
        # Forward the request to qBittorrent
        qbit_response = await client.post(
            f"{QBITTORRENT_BASE_URL}/api/v2/torrents/resume",
            cookies={"SID": auth_cookie},
            data={"hashes": hashes}
        )
        
        if qbit_response.status_code != 200:
            return {"success": False, "message": f"Failed to resume torrent: {qbit_response.text}"}
        
        return {"success": True, "message": "Torrent resumed successfully"}
        
    except Exception as e:
        print(f"Error resuming torrent: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error resuming torrent: {str(e)}")

@app.post("/api/torrents/delete")
async def delete_torrent(request: Request, client: httpx.AsyncClient = Depends(get_http_client)):
    """
    Delete a torrent in qBittorrent
    """
    try:
        # Parse form data
        form_data = await request.form()
        hashes = form_data.get("hashes")
        delete_files = form_data.get("deleteFiles", "false").lower() == "true"
        
        if not hashes:
            raise HTTPException(status_code=400, detail="Torrent hash is required")
        
        # Get the auth cookie
        auth_cookie = request.cookies.get("qbittorrent_auth")
        
        if not auth_cookie:
            raise HTTPException(status_code=401, detail="Authentication required")
        
        # Forward the request to qBittorrent
        qbit_response = await client.post(
            f"{QBITTORRENT_BASE_URL}/api/v2/torrents/delete",
            cookies={"SID": auth_cookie},
            data={"hashes": hashes, "deleteFiles": str(delete_files).lower()}
        )
        
        if qbit_response.status_code != 200:
            return {"success": False, "message": f"Failed to delete torrent: {qbit_response.text}"}
        
        return {"success": True, "message": "Torrent deleted successfully"}
        
    except Exception as e:
        print(f"Error deleting torrent: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error deleting torrent: {str(e)}")

# Search API endpoints
@app.post("/api/search/start")
async def start_search(
    request: Request, 
    data: dict = Body(...),
    client: httpx.AsyncClient = Depends(get_http_client)
):
    """
    Start a search using qBittorrent's search API
    """
    # Extract parameters from request body
    pattern = data.get("pattern")
    plugins = data.get("plugins", "all")
    category = data.get("category", "all")
    
    if not pattern:
        raise HTTPException(status_code=400, detail="Pattern is required")
    
    auth_cookie = request.cookies.get("qbittorrent_auth")
    if not auth_cookie:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    try:
        response = await client.post(
            f"{QBITTORRENT_BASE_URL}/api/v2/search/start",
            data={
                "pattern": pattern,
                "plugins": plugins,
                "category": category
            },
            cookies={"SID": auth_cookie}
        )
        
        if response.status_code == 409:
            raise HTTPException(status_code=409, detail="Too many active searches")
        
        response.raise_for_status()
        return response.json()
    except httpx.HTTPStatusError as e:
        raise HTTPException(status_code=e.response.status_code, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error starting search: {str(e)}")

@app.post("/api/search/stop")
async def stop_search(
    request: Request,
    data: dict = Body(...),
    client: httpx.AsyncClient = Depends(get_http_client)
):
    """
    Stop a search job
    """
    # Extract id from request body
    id = data.get("id")
    if id is None:
        raise HTTPException(status_code=400, detail="Missing required parameter: id")
    
    auth_cookie = request.cookies.get("qbittorrent_auth")
    if not auth_cookie:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    try:
        response = await client.post(
            f"{QBITTORRENT_BASE_URL}/api/v2/search/stop",
            data={"id": id},
            cookies={"SID": auth_cookie}
        )
        
        if response.status_code == 404:
            raise HTTPException(status_code=404, detail="Search job not found")
        
        response.raise_for_status()
        return {"status": "success"}
    except httpx.HTTPStatusError as e:
        raise HTTPException(status_code=e.response.status_code, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error stopping search: {str(e)}")

@app.get("/api/search/status")
async def get_search_status(
    request: Request,
    id: int = None,
    client: httpx.AsyncClient = Depends(get_http_client)
):
    """
    Get status of search job(s)
    """
    auth_cookie = request.cookies.get("qbittorrent_auth")
    if not auth_cookie:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    try:
        params = {}
        if id is not None:
            params["id"] = id
            
        response = await client.get(
            f"{QBITTORRENT_BASE_URL}/api/v2/search/status",
            params=params,
            cookies={"SID": auth_cookie}
        )
        
        if response.status_code == 404:
            raise HTTPException(status_code=404, detail="Search job not found")
        
        response.raise_for_status()
        return response.json()
    except httpx.HTTPStatusError as e:
        raise HTTPException(status_code=e.response.status_code, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting search status: {str(e)}")

@app.get("/api/search/results")
async def get_search_results(
    request: Request,
    id: int,
    limit: int = 0,
    offset: int = 0,
    client: httpx.AsyncClient = Depends(get_http_client)
):
    """
    Get results of a search job
    """
    auth_cookie = request.cookies.get("qbittorrent_auth")
    if not auth_cookie:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    try:
        params = {
            "id": id
        }
        if limit > 0:
            params["limit"] = limit
        if offset != 0:
            params["offset"] = offset
            
        response = await client.get(
            f"{QBITTORRENT_BASE_URL}/api/v2/search/results",
            params=params,
            cookies={"SID": auth_cookie}
        )
        
        if response.status_code == 404:
            raise HTTPException(status_code=404, detail="Search job not found")
        if response.status_code == 409:
            raise HTTPException(status_code=409, detail="Invalid offset")
        
        response.raise_for_status()
        return response.json()
    except httpx.HTTPStatusError as e:
        raise HTTPException(status_code=e.response.status_code, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting search results: {str(e)}")

@app.post("/api/search/delete")
async def delete_search(
    request: Request,
    data: dict = Body(...),
    client: httpx.AsyncClient = Depends(get_http_client)
):
    """
    Delete a search job
    """
    # Extract id from request body
    id = data.get("id")
    if id is None:
        raise HTTPException(status_code=400, detail="Missing required parameter: id")
    
    auth_cookie = request.cookies.get("qbittorrent_auth")
    if not auth_cookie:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    try:
        response = await client.post(
            f"{QBITTORRENT_BASE_URL}/api/v2/search/delete",
            data={"id": id},
            cookies={"SID": auth_cookie}
        )
        
        if response.status_code == 404:
            raise HTTPException(status_code=404, detail="Search job not found")
        
        response.raise_for_status()
        return {"status": "success"}
    except httpx.HTTPStatusError as e:
        raise HTTPException(status_code=e.response.status_code, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting search: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)