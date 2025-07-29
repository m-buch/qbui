# qBUI

This project is a work-in-progress replacement for the default qBittorrent Web UI, featuring a Vue 3 frontend and a FastAPI backend. The UI is designed with shadcn components for a clean look.

## Features

* **Modern UI**: Built with Vue 3, Pinia, Tailwind, and shadcn components.
* **FastAPI Backend**: Provides a lightweight API layer.
* **Real-Time Updates**: The frontend polls progress from the backend for download progress, search results, etc.

## Tech Stack

* **Frontend**: [Vue 3](https://vuejs.org/), [Vite](https://vite.dev/), [shadcn/ui](https://ui.shadcn.com/), [npm](https://www.npmjs.com/)
* **Backend**: [FastAPI](https://fastapi.tiangolo.com/), [Uvicorn](https://www.uvicorn.org/), [UV](https://docs.astral.sh/uv/)

## Getting Started

### Prerequisites

* **Node.js** (>= 18)
* **Python** (>= 3.11)
* **npm** for frontend
* **UV** for backend

## Frontend Setup

The frontend is built with Vue 3, Vite, and shadcn components.

### Installation

```sh
cd frontend
npm install
```

### Development Server

```sh
npm run dev
```

This will start the Vite development server with hot reloading.

### Build for Production

```sh
npm run build
```

## Backend Setup

The backend is a FastAPI app served via Uvicorn.

### Install Dependencies

```sh
uv sync
```

### Run Development Server

```sh
python main.py
```

## Project Structure

```
qbui/
├── frontend/
│   ├── src/
│   └── ...
├── backend/
│   └── main.py
└── README.md
```

## Future Enhancements

* Dockerfile for easy deployment.
* Implementation of additional default web UI features: settings panel, categories, tags, and trackers.
* Styles cleanup.
