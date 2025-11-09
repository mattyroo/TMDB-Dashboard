# TMDB Dashboard

A modern, responsive dashboard for browsing movies and TV shows using The Movie Database (TMDB) API. Built with React, TypeScript, and Tailwind CSS 4.1.

## Features

- **Dual Tabs**: Separate views for Movies and TV Shows
- **Multiple Categories**: 
  - Trending
  - Popular
  - Recently Released (Now Playing for movies, Airing Today for TV)
  - Upcoming (Upcoming for movies, On The Air for TV)
- **Search Functionality**: Search for movies and TV shows with filtering
- **Interactive UI**: Click on any poster to view detailed information in a modal
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Modern Stack**: React 19, TypeScript, Vite, and Tailwind CSS 4.1

## Setup Instructions

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- A TMDB API Access Token (v4 auth)

### Getting Your TMDB Access Token

1. Go to [TMDB](https://www.themoviedb.org/) and create an account
2. Navigate to Settings → API
3. Request an API Key
4. Copy your **API Read Access Token (v4 auth)** (NOT the API Key)

### Installation

1. Clone or download this repository

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```bash
cp .env.example .env
```

4. Open `.env` and add your TMDB Access Token:
```
VITE_TMDB_ACCESS_TOKEN=your_actual_access_token_here
```

5. Start the development server:
```bash
npm run dev
```

6. Open your browser and navigate to the URL shown in the terminal (usually `http://localhost:5173`)

## Usage

### Browsing Content

- **Switch Tabs**: Click "Movies" or "TV Shows" to switch between content types
- **Select Category**: Choose from Trending, Popular, Recently Released, or Upcoming
- **View Details**: Click any poster to open a detailed view with:
  - Full overview
  - Ratings and vote counts
  - Release dates
  - Runtime/Seasons
  - Genres
  - Production companies
  - Budget/Revenue (for movies)

### Searching

1. Type your search query in the search bar
2. Click "Search" or press Enter
3. View results filtered by the current tab (Movies or TV)
4. Click "Clear Search" to return to category browsing

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── MediaCard.tsx   # Poster card component
│   ├── DetailModal.tsx # Detailed view modal
│   ├── SearchBar.tsx   # Search input component
│   └── FilterOptions.tsx # Category filter buttons
├── pages/
│   └── Dashboard.tsx   # Main dashboard page
├── services/
│   └── tmdb.ts        # TMDB API service layer
├── types/
│   └── tmdb.ts        # TypeScript type definitions
├── App.tsx            # Root component
└── main.tsx           # Application entry point
```

## Technologies Used

- **React 19**: Modern UI library with latest features
- **TypeScript**: Type-safe development
- **Vite**: Fast build tool and dev server
- **Tailwind CSS 4.1**: Utility-first CSS framework
- **TMDB API**: The Movie Database API

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## API Rate Limits

TMDB API has rate limits. For most use cases, the free tier is sufficient. If you encounter rate limit errors, wait a moment before making more requests.

## License

This project is for educational purposes. Movie and TV show data provided by [TMDB](https://www.themoviedb.org/).

## Troubleshooting

### "TMDB API Error" Messages

- Verify your access token is correct in the `.env` file
- Ensure you're using the **Access Token (v4 auth)**, not the API Key
- Check that the `.env` file is in the root directory
- Restart the dev server after changing `.env`

### Images Not Loading

- Check your internet connection
- Verify the TMDB image server is accessible
- Some content may not have poster images available

### TypeScript Errors

- Run `npm install` to ensure all dependencies are installed
- Check that your Node.js version is v18 or higher
