import type {
  Movie,
  TVShow,
  MovieDetails,
  TVShowDetails,
  TMDBResponse,
  TimeWindow,
} from '../types/tmdb';
import defaultPoster from '../assets/not-found.png';

const BASE_URL = 'https://api.themoviedb.org/3';
const ACCESS_TOKEN = import.meta.env.VITE_TMDB_ACCESS_TOKEN;

const headers = {
  Authorization: `Bearer ${ACCESS_TOKEN}`,
  'Content-Type': 'application/json',
};

async function fetchFromTMDB<T>(endpoint: string): Promise<T> {
  const response = await fetch(`${BASE_URL}${endpoint}`, { headers });
  if (!response.ok) {
    throw new Error(`TMDB API Error: ${response.statusText}`);
  }
  return response.json();
}

const formatYYYYMMDD = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

// Movies
export const getMovies = {
  trending: (_timeWindow: TimeWindow = 'week', page: number = 1) => {
    void _timeWindow;
    return fetchFromTMDB<TMDBResponse<Movie>>(`/discover/movie?` +
      `with_original_language=en&` +
      `with_origin_country=US|GB|CA&` +
      `sort_by=popularity.desc&` +
      `page=${page}`);
  },
  
  popular: (page: number = 1) =>
    fetchFromTMDB<TMDBResponse<Movie>>(`/discover/movie?` +
      `with_original_language=en&` +
      `with_origin_country=US|GB|CA&` +
      `sort_by=popularity.desc&` +
      `page=${page}`),
  
  recentlyReleased: (page: number = 1) => {
    const today = new Date();
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(today.getDate() - 60);
    
    return fetchFromTMDB<TMDBResponse<Movie>>(
      `/discover/movie?` +
      `primary_release_date.lte=${formatYYYYMMDD(today)}&` +
      `primary_release_date.gte=${formatYYYYMMDD(thirtyDaysAgo)}&` +
      `sort_by=primary_release_date.desc&` +
      `with_original_language=en&` +
      `with_origin_country=US|GB|CA&` +
      `page=${page}`
    );
  },
  
  upcoming: (page: number = 1) => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const inOneYear = new Date(tomorrow);
    inOneYear.setFullYear(tomorrow.getFullYear() + 3);
    
    return fetchFromTMDB<TMDBResponse<Movie>>(
      `/discover/movie?` +
      `primary_release_date.gte=${formatYYYYMMDD(tomorrow)}&` +
    //   `primary_release_date.lte=${formatYYYYMMDD(inOneYear)}&` +
      `sort_by=primary_release_date.asc&` +
      `with_original_language=en&` +
      `with_origin_country=US|GB|CA&` +
      `page=${page}`
    );
  },
  
  details: (id: number) =>
    fetchFromTMDB<MovieDetails>(`/movie/${id}`),
  
  search: (query: string, page: number = 1) =>
    fetchFromTMDB<TMDBResponse<Movie>>(`/search/movie?query=${encodeURIComponent(query)}&with_original_language=en&language=en&page=${page}`),
  
  searchSuggestions: (query: string) =>
    fetchFromTMDB<TMDBResponse<Movie>>(`/search/movie?query=${encodeURIComponent(query)}&with_original_language=en&language=en&page=1&include_adult=false`),
};

// TV Shows
export const getTVShows = {
  trending: (_timeWindow: TimeWindow = 'week', page: number = 1) => {
    void _timeWindow;
    return fetchFromTMDB<TMDBResponse<TVShow>>(`/discover/tv?` +
      `with_original_language=en&` +
      `origin_country=US|GB|CA&` +
      `sort_by=popularity.desc&` +
      `page=${page}`);
  },
  
  popular: (page: number = 1) =>
    fetchFromTMDB<TMDBResponse<TVShow>>(`/discover/tv?` +
      `with_original_language=en&` +
      `origin_country=US|GB|CA&` +
      `sort_by=popularity.desc&` +
      `page=${page}`),
  
  recentlyReleased: (page: number = 1) => {
    const today = new Date();
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(today.getDate() - 30);
    
    return fetchFromTMDB<TMDBResponse<TVShow>>(
      `/discover/tv?` +
      `first_air_date.lte=${formatYYYYMMDD(today)}&` +
      `first_air_date.gte=${formatYYYYMMDD(thirtyDaysAgo)}&` +
      `sort_by=first_air_date.desc&` +
      `with_original_language=en&` +
      `origin_country=US|GB|CA&` +
      `page=${page}`
    );
  },
  
  upcoming: (page: number = 1) => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const inOneYear = new Date(tomorrow);
    inOneYear.setFullYear(tomorrow.getFullYear() + 1);
    
    return fetchFromTMDB<TMDBResponse<TVShow>>(
      `/discover/tv?` +
      `first_air_date.gte=${formatYYYYMMDD(tomorrow)}&` +
      `first_air_date.lte=${formatYYYYMMDD(inOneYear)}&` +
      `sort_by=first_air_date.asc&` +
      `with_original_language=en&` +
      `origin_country=US|GB|CA&` +
      `page=${page}`
    );
  },
  
  details: (id: number) =>
    fetchFromTMDB<TVShowDetails>(`/tv/${id}`),
  
  search: (query: string, page: number = 1) =>
    fetchFromTMDB<TMDBResponse<TVShow>>(`/search/tv?query=${encodeURIComponent(query)}&with_original_language=en&language=en&page=${page}`),
  
  searchSuggestions: (query: string) =>
    fetchFromTMDB<TMDBResponse<TVShow>>(`/search/tv?query=${encodeURIComponent(query)}&with_original_language=en&language=en&page=1&include_adult=false`),
};

// Utility functions
export const getImageUrl = (path: string | null, size: 'w200' | 'w500' | 'original' = 'w500'): string => {
  if (!path) return defaultPoster;
  return `https://image.tmdb.org/t/p/${size}${path}`;
};

export const formatDate = (dateString: string): string => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
};

export const formatRating = (rating: number): string => {
  return rating.toFixed(1);
};
