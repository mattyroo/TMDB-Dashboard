# Quick Start Guide

## Step 1: Get Your TMDB Access Token

1. Visit https://www.themoviedb.org/ and sign up/login
2. Go to your account Settings → API
3. Click "Request an API Key" and follow the process
4. **Important**: Copy the "API Read Access Token (v4 auth)" - this is a long bearer token, NOT the short API key

## Step 2: Configure Environment

Create a `.env` file in the project root:

```bash
VITE_TMDB_ACCESS_TOKEN=your_token_here
```

Replace `your_token_here` with your actual TMDB access token.

## Step 3: Install and Run

```bash
# Install dependencies (if not already done)
npm install

# Start the development server
npm run dev
```

The app will open at `http://localhost:5173`

## Features Overview

### Movies Tab
- **Trending**: Popular movies this week
- **Popular**: All-time popular movies
- **Recently Released**: Movies currently in theaters
- **Upcoming**: Movies coming soon

### TV Shows Tab
- **Trending**: Popular TV shows this week
- **Popular**: All-time popular TV shows
- **Recently Released**: Shows airing today
- **Upcoming**: Shows on the air

### Search
- Type any movie or TV show name
- Results are filtered by the current tab
- Click "Clear Search" to return to categories

### Details
- Click any poster to see full details
- View ratings, genres, overview, and more
- Press ESC or click outside to close

## Troubleshooting

**Problem**: Blank page or API errors
- **Solution**: Check that your `.env` file has the correct access token
- Restart the dev server after adding/changing `.env`

**Problem**: No images showing
- **Solution**: Some movies/shows don't have posters in TMDB
- A placeholder will show for missing images

**Problem**: Rate limit errors
- **Solution**: Wait a few moments before making more requests
- TMDB has reasonable rate limits for free tier

## Build for Production

```bash
npm run build
```

The production build will be in the `dist/` folder.
