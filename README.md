# qBUI
<img width="1918" height="881" alt="image" src="https://github.com/user-attachments/assets/8cd25f1b-58b8-4302-81c3-1ffba22997a0" />

This project is a work-in-progress replacement for the default qBittorrent Web UI, featuring a Vue 3 frontend designed with shadcn components. The goal is to address some of my complaints with other existing solutions, namely that the UI feels dated, or feels more mobile-focused than desktop-focused. I am not a fan of an excessive amount of largely unnecessary information being displayed at all times either, which I have tried to minimize. 

## Features

* **Modern UI**: Built with Vue 3, Pinia, Tailwind, and shadcn components.

## Dependencies

* [Vue 3](https://vuejs.org/)
* [Vite](https://vite.dev/)
* [npm](https://www.npmjs.com/)

## Getting Started

### Prerequisites

* **Node.js** (>= 18)
* Running instance of qBittorrent with the Web UI enabled (default at http://localhost:8080)
* **npm**

## Frontend Setup

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
