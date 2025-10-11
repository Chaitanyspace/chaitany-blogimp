# Setup Guide - React Bookmark App

## Quick Start

### 1. Install Dependencies

```bash
cd react-bookmark-app
npm install
```

### 2. Configure API URL

Create a `.env` file:
```bash
# Windows
copy .env.example .env

# Linux/Mac
cp .env.example .env
```

The default API URL is `http://localhost:8000`. Update if needed.

### 3. Start Backend API

Make sure your FastAPI backend is running:
```bash
# From the parent directory
cd ..
python api_main.py
```

The API should be running on `http://localhost:8000`

### 4. Start React App

```bash
npm run dev
```

Or use the batch file:
```bash
start.bat
```

The app will open at `http://localhost:3000`

## Environment Variables

- `VITE_API_BASE` - Backend API URL (default: `http://localhost:8000`)

## Troubleshooting

### CORS Errors
Make sure the backend API has CORS enabled for `http://localhost:3000`. The `api_main.py` already includes this configuration.

### API Connection Failed
1. Verify the backend is running on port 8000
2. Check the `.env` file has the correct API URL
3. Ensure MySQL database is running and accessible

### Build Errors
1. Delete `node_modules` and reinstall:
   ```bash
   rm -rf node_modules
   npm install
   ```

2. Clear Vite cache:
   ```bash
   rm -rf node_modules/.vite
   npm run dev
   ```

## Production Build

1. Build the app:
   ```bash
   npm run build
   ```

2. The optimized files will be in the `dist` folder

3. Preview the production build:
   ```bash
   npm run preview
   ```

4. Deploy the `dist` folder to your hosting service (Netlify, Vercel, etc.)

## Tech Stack

- **React 18.3.1** - JavaScript library for building user interfaces
- **Vite 5.4** - Next-generation frontend tooling
- **Tailwind CSS 3.4** - Utility-first CSS framework
- **Axios 1.6** - Promise-based HTTP client

## Scripts

- `npm run dev` - Start development server (port 3000)
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally





