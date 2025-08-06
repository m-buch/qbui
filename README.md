# qBUI

This project is a work-in-progress replacement for the default qBittorrent Web UI, featuring a Vue 3 frontend that talks directly to the qBittorrent Web API through a Vite dev server proxy. The UI is designed with shadcn components for a clean look.

## Features

* **Modern UI**: Built with Vue 3, Pinia, Tailwind, and shadcn components.
* **Direct qBittorrent API access** via a Vite proxy.

## Tech Stack

* **Frontend**: [Vue 3](https://vuejs.org/), [Vite](https://vite.dev/), [shadcn/ui](https://ui.shadcn.com/), [npm](https://www.npmjs.com/)

## Getting Started

### Prerequisites

* **Node.js** (>= 18)
* Running instance of qBittorrent with the Web UI enabled (default at http://localhost:8080)
* **npm**

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

## Project Structure

```
qbui/
├── frontend/
│   ├── src/
│   └── ...
└── README.md
```

## Future Enhancements

* Dockerfile for easy deployment.
* Implementation of additional default web UI features: settings panel, categories, tags, and trackers.
* Styles cleanup.
