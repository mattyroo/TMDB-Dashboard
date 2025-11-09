import type { Movie, TVShow } from '../types/tmdb';
import { useSearch } from '../hooks/useSearch';

interface SearchBarProps {
  mediaType: 'movie' | 'tv';
  onSearchStart: () => void;
  onSearchComplete: (results: Movie[] | TVShow[]) => void;
  placeholder?: string;
}

export default function SearchBar({
  mediaType,
  onSearchStart,
  onSearchComplete,
  placeholder = 'Search...',
}: SearchBarProps) {
  const {
    query,
    suggestions,
    showSuggestions,
    searchRef,
    handleInputChange,
    handleSearch,
    handleSuggestionClick,
  } = useSearch({
    mediaType,
    onSearchStart,
    onSearchComplete,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch();
  };

  return (
    <div ref={searchRef} className="w-full max-w-2xl relative">
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={handleInputChange}
            placeholder={placeholder}
            className="w-full px-4 py-3 pr-12 rounded-lg bg-gray-800 text-white placeholder-gray-400 border border-gray-700 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 bg-primary text-white hover:bg-light hover:text-dark text-primary-foreground rounded-md transition-colors hover:font-bold"
          >
            Search
          </button>
        </div>
      </form>

      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-50 mt-1 w-full rounded-lg bg-gray-800 border border-gray-700 shadow-lg overflow-hidden">
          {suggestions.map((suggestion) => {
            const title = mediaType === 'movie'
              ? (suggestion as Movie).title
              : (suggestion as TVShow).name;
            
            return (
              <button
                key={suggestion.id}
                onClick={() => handleSuggestionClick(suggestion)}
                className="w-full px-4 py-3 text-left hover:bg-gray-700 text-white transition-colors flex items-center space-x-3"
              >
                <img
                  src={`https://image.tmdb.org/t/p/w92${suggestion.poster_path}`}
                  alt={title}
                  className="w-8 h-12 object-cover rounded"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://via.placeholder.com/92x138/1f2937/9ca3af?text=No+Image';
                  }}
                />
                <div>
                  <div className="font-medium">{title}</div>
                  <div className="text-sm text-gray-400">
                    {mediaType === 'movie'
                      ? (suggestion as Movie).release_date?.split('-')[0]
                      : (suggestion as TVShow).first_air_date?.split('-')[0]}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
