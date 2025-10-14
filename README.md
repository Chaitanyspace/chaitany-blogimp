# 🔖 Bookmark Blog - React App

A modern React application for managing bookmarks, built with React, Tailwind CSS, and Vite. This app provides a beautiful UI to search, add, and organize bookmarks with tags.

## Features

- 🔍 **Search Bookmarks**: Search by title, description, or tags with OR logic
- 🏷️ **Tag Management**: Create and manage tags for organizing bookmarks
- 📝 **Add Bookmarks**: Easy-to-use form for adding new bookmarks with multiple tags
- 📄 **Pagination**: Browse bookmarks with smooth pagination
- 🎨 **Modern UI**: Clean, responsive design with Tailwind CSS
- ⚡ **Fast**: Built with Vite for lightning-fast development

## Prerequisites

- Node.js 18+ and npm
- Backend API running (see `api_main.py` in parent directory)

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create environment file:
```bash
cp .env.example .env
```

3. Update `.env` with your API URL (default is `http://localhost:8000`):
```env
VITE_API_BASE=http://localhost:8000
```

## Development

Start the development server:
```bash
npm run dev
```

The app will open at `http://localhost:3000`

## Build for Production

Build the app:
```bash
npm run build
```

Preview production build:
```bash
npm run preview
```

## Project Structure

```
src/
├── components/
│   ├── AddLinkTab.jsx      # Add bookmark form
│   ├── AddTagModal.jsx     # Modal for adding tags
│   ├── AddTagTab.jsx       # Tag creation tab
│   ├── BookmarkCard.jsx    # Bookmark display card
│   ├── Modal.jsx           # Reusable modal component
│   └── SearchTab.jsx       # Search and browse bookmarks
├── api.js                  # API client functions
├── utils.js                # Utility functions
├── App.jsx                 # Main app component
├── main.jsx               # App entry point
└── index.css              # Global styles with Tailwind

```

## API Integration

This app connects to the FastAPI backend (`api_main.py`). Make sure the backend is running before starting the React app.

Backend endpoints used:
- `GET /api/bookmarks` - List bookmarks (with search/filter)
- `POST /api/bookmarks` - Create bookmark
- `GET /api/tags` - List tags
- `POST /api/tags` - Create tag

## Tech Stack

- **React 18** - UI library
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **FastAPI** - Backend API (separate)

## Features Overview

### Search Tab
- Full-text search across titles, descriptions, and tags
- Filter by specific tag
- Pagination with 3 items per page
- Beautiful card-based display

### Add Link Tab
- Form with title, URL, and description fields
- Multi-select tag picker
- URL normalization (auto-adds http:// if missing)
- Quick access to add new tags

### Add Tag Tab
- Bulk tag creation
- Comma-separated input
- Tag preview with remove functionality
- Success/error feedback

## License

MIT








