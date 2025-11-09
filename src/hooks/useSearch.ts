import { useState, useRef, useCallback, useEffect } from 'react';
import type { ChangeEvent } from 'react';
import type { Movie, TVShow } from '../types/tmdb';
import { getMovies, getTVShows } from '../services/tmdb';
// local useDebounce implementation to avoid missing-module errors
function useDebounce<T>(value: T, delay = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

type MediaType = 'movie' | 'tv';

interface UseSearchProps {
  mediaType: MediaType;
  onSearchStart: () => void;
  onSearchComplete: (results: Movie[] | TVShow[]) => void;
}

export function useSearch({ mediaType, onSearchStart, onSearchComplete }: UseSearchProps) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Movie[] | TVShow[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const debouncedQuery = useDebounce(query, 300);

  const fetchSuggestions = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setSuggestions([]);
      return;
    }

    try {
      const service = mediaType === 'movie' ? getMovies : getTVShows;
      const response = await service.searchSuggestions(searchQuery);
      setSuggestions(response.results.slice(0, 5));
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      setSuggestions([]);
    }
  }, [mediaType]);

  useEffect(() => {
    fetchSuggestions(debouncedQuery);
  }, [debouncedQuery, fetchSuggestions]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setShowSuggestions(true);
  };

  const handleSearch = async (searchQuery = query) => {
    if (!searchQuery.trim()) return;
    
    onSearchStart();
    setShowSuggestions(false);

    try {
      const service = mediaType === 'movie' ? getMovies : getTVShows;
      const response = await service.search(searchQuery);
      onSearchComplete(response.results);
    } catch (error) {
      console.error('Error searching:', error);
      onSearchComplete([]);
    }
  };

  const handleSuggestionClick = (suggestion: Movie | TVShow) => {
    const title = mediaType === 'movie' 
      ? (suggestion as Movie).title 
      : (suggestion as TVShow).name;
    setQuery(title);
    setShowSuggestions(false);
    handleSearch(title);
  };

  return {
    query,
    suggestions,
    showSuggestions,
    searchRef,
    handleInputChange,
    handleSearch,
    handleSuggestionClick,
  };
}