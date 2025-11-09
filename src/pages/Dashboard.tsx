import { useState, useEffect, useCallback } from 'react';
import type { Movie, TVShow } from '../types/tmdb';
import { getMovies, getTVShows } from '../services/tmdb';
import DetailModal from '../components/DetailModal';
import SearchBar from '../components/SearchBar';
import FilterOptions from '../components/FilterOptions';
import MediaGrid from '../components/MediaGrid';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';

type TabType = 'movie' | 'tv';
type CategoryType = 'popular' | 'recent' | 'upcoming';

const categoryOptions = [
//   { value: 'trending', label: 'Trending' },
  { value: 'popular', label: 'Popular' },
  { value: 'recent', label: 'Recently Released' },
  { value: 'upcoming', label: 'Upcoming' },
];

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<TabType>('movie');
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('popular');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [tvShows, setTVShows] = useState<TVShow[]>([]);
  const [searchResults, setSearchResults] = useState<Movie[] | TVShow[]>([]);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<{ id: number; type: 'movie' | 'tv' } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isHeaderCollapsed, setIsHeaderCollapsed] = useState(false);

  const MIN_POPULARITY = 1;
  const MIN_RESULTS = 12;
  const MAX_PAGE_ADVANCE = 5;

  const resetPagination = () => {
    setCurrentPage(1);
    setHasMore(true);
  };

  const fetchCategoryData = useCallback(async (page: number = 1, append: boolean = false) => {
    if (!hasMore && page > 1) return;
    if (append) {
      setIsLoadingMore(true);
    } else {
      setIsInitialLoading(true);
    }
    
    try {
      const shouldIncludeItem = (item: Movie | TVShow) => (item.popularity ?? 0) >= MIN_POPULARITY;

      const fetchMoviesPage = async (pageToFetch: number) => {
        switch (selectedCategory) {
        //   case 'trending':
        //     return getMovies.trending(undefined, pageToFetch);
          case 'popular':
            return getMovies.popular(pageToFetch);
          case 'recent':
            return getMovies.recentlyReleased(pageToFetch);
          case 'upcoming':
            return getMovies.upcoming(pageToFetch);
          default:
            return getMovies.popular(pageToFetch);
        }
      };

      const fetchTVPage = async (pageToFetch: number) => {
        switch (selectedCategory) {
        //   case 'trending':
        //     return getTVShows.trending(undefined, pageToFetch);
          case 'popular':
            return getTVShows.popular(pageToFetch);
          case 'recent':
            return getTVShows.recentlyReleased(pageToFetch);
          case 'upcoming':
            return getTVShows.upcoming(pageToFetch);
          default:
            return getTVShows.popular(pageToFetch);
        }
      };

      let activePage = page;
      let attempts = 0;

      if (activeTab === 'movie') {
        let data = await fetchMoviesPage(activePage);
        let filteredResults = data.results.filter(shouldIncludeItem) as Movie[];
        let aggregatedResults = [...filteredResults];

        while (
          aggregatedResults.length < MIN_RESULTS &&
          data.page < data.total_pages &&
          attempts < MAX_PAGE_ADVANCE
        ) {
          activePage = data.page + 1;
          attempts += 1;
          data = await fetchMoviesPage(activePage);
          filteredResults = data.results.filter(shouldIncludeItem) as Movie[];
          aggregatedResults = [...aggregatedResults, ...filteredResults];
        }

        setCurrentPage(data.page);
        setMovies(prev => (append ? [...prev, ...aggregatedResults] : aggregatedResults));
        setHasMore(data.page < data.total_pages);
      } else {
        let data = await fetchTVPage(activePage);
        let filteredResults = data.results.filter(shouldIncludeItem) as TVShow[];
        let aggregatedResults = [...filteredResults];

        while (
          aggregatedResults.length < MIN_RESULTS &&
          data.page < data.total_pages &&
          attempts < MAX_PAGE_ADVANCE
        ) {
          activePage = data.page + 1;
          attempts += 1;
          data = await fetchTVPage(activePage);
          filteredResults = data.results.filter(shouldIncludeItem) as TVShow[];
          aggregatedResults = [...aggregatedResults, ...filteredResults];
        }

        setCurrentPage(data.page);
        setTVShows(prev => (append ? [...prev, ...aggregatedResults] : aggregatedResults));
        setHasMore(data.page < data.total_pages);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setHasMore(false);
    } finally {
      if (append) {
        setIsLoadingMore(false);
      } else {
        setIsInitialLoading(false);
      }
    }
  }, [activeTab, selectedCategory, hasMore]);

  useEffect(() => {
    setIsSearching(false);
    setSearchResults([]);
    resetPagination();
    fetchCategoryData(1, false);
  }, [activeTab, selectedCategory, fetchCategoryData]);

  const loadMore = useCallback(() => {
    if (isSearching || isInitialLoading || isLoadingMore || !hasMore) return;
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    fetchCategoryData(nextPage, true);
  }, [isSearching, isInitialLoading, isLoadingMore, hasMore, currentPage, fetchCategoryData]);

  const loadMoreRef = useInfiniteScroll({
    onIntersect: loadMore,
    isLoading: isInitialLoading || isLoadingMore,
    hasMore,
  });

  const handleSearchStart = () => {
    setIsInitialLoading(true);
    setIsSearching(true);
    resetPagination();
  };

  const handleSearchComplete = (results: Movie[] | TVShow[]) => {
    setSearchResults(results);
    setIsInitialLoading(false);
  };

  const handleClearSearch = () => {
    setIsSearching(false);
    setSearchResults([]);
  };

  const displayData = isSearching ? searchResults : (activeTab === 'movie' ? movies : tvShows);

  return (
    <div className="min-h-screen bg-black text-light">
      {/* Header */}
      <header className="bg-dark border-b-4 border-primary sticky top-0 z-40">
        <div className="flex items-center justify-between p-[25px] flex-col sm:flex-row space-y-3 sm:space-y-0">
          <h1 className="text-4xl font-bold text-primary border-b-2 border-primary pb-2 text-center">
            Media Dashboard
          </h1>
          {/* Search Bar */}
          <div className={`min-w-[250px] sm:min-w-[300px] w-full sm:w-1/3 ${isHeaderCollapsed ? 'hidden sm:block' : ''}`}>
            <SearchBar
              mediaType={activeTab}
              onSearchStart={handleSearchStart}
              onSearchComplete={handleSearchComplete}
              placeholder={`Search ${activeTab === 'movie' ? 'movies' : 'TV shows'}...`}
            />
          </div>
        </div>
        <div className="flex justify-center sm:hidden px-4">
          <button
            type="button"
            onClick={() => setIsHeaderCollapsed((prev) => !prev)}
            aria-expanded={!isHeaderCollapsed}
            aria-controls="dashboard-header-content"
            aria-label={isHeaderCollapsed ? 'Expand dashboard controls' : 'Collapse dashboard controls'}
            className="text-light text-center text-2xl border-2 border-gray-600 rounded-lg px-4 py-2 my-4 hover:bg-gray-700 transition-colors flex items-center gap-2"
          >
            <span className="text-base font-semibold">
              {isHeaderCollapsed ? 'Show Filters' : 'Hide Filters'}
            </span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className={`size-6 transition-transform duration-200 ${isHeaderCollapsed ? 'rotate-180' : ''}`}
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 18.75 7.5-7.5 7.5 7.5" />
              <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 7.5-7.5 7.5 7.5" />
            </svg>
          </button>
        </div>

        <div
          id="dashboard-header-content"
          className={`${isHeaderCollapsed ? 'hidden sm:block' : ''} space-y-4 sm:space-y-6 px-4 sm:px-0`}
        >
          {/* Tabs */}
          <div className="flex items-center justify-evenly space-x-0 sm:space-x-1">
            <button
              onClick={() => {
                setActiveTab('movie');
                handleClearSearch();
              }}
              className={`px-6 py-3 w-1/2 transition-colors text-xl ${
                activeTab === 'movie'
                  ? 'bg-primary text-dark font-black'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700 font-semibold'
              }`}
            >
              Movies
            </button>
            <button
              onClick={() => {
                setActiveTab('tv');
                handleClearSearch();
              }}
              className={`px-6 py-3 w-1/2 transition-colors text-xl ${
                activeTab === 'tv'
                  ? 'bg-primary text-dark font-black'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700 font-semibold'
              }`}
            >
              TV
            </button>
          </div>

          {/* Category Filters */}
          {!isSearching && (
            <FilterOptions
              options={categoryOptions}
              selectedValue={selectedCategory}
              onSelect={(value) => setSelectedCategory(value as CategoryType)}
            />
          )}

          {/* Search Results Header */}
          {isSearching && (
            <div className="container mx-auto p-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-primary">Search Results</h2>
              <button
                onClick={handleClearSearch}
                className="px-4 py-2 bg-primary text-white hover:bg-secondary-dark text-secondary-foreground rounded-lg transition-colors"
              >
                Clear Search
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {isInitialLoading && displayData.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-2xl text-gray-400">Loading...</div>
          </div>
        ) : displayData.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-xl text-gray-400">
              {isSearching ? 'No results found' : 'No data available'}
            </div>
            {hasMore && !isSearching && (
              <div ref={loadMoreRef} className="h-1 w-full" />
            )}
          </div>
        ) : (
          <div>
            <MediaGrid 
              data={displayData} 
              mediaType={activeTab} 
              onSelect={(id) => setSelectedMedia({ id, type: activeTab })}
            />
            
            {/* Infinite Scroll Trigger */}
            <div ref={loadMoreRef} className="h-20 flex items-center justify-center">
              {isLoadingMore ? (
                <div className="text-gray-400">Loading more...</div>
              ) : !hasMore && displayData.length > 0 ? (
                <div className="text-gray-400">
                  {isSearching
                    ? 'No more search results'
                    : `This is the end of ${selectedCategory} ${activeTab === 'movie' ? 'movies' : 'TV shows'}`}
                </div>
              ) : null}
            </div>
          </div>
        )}
      </main>

      {/* Detail Modal */}
      {selectedMedia && (
        <DetailModal
          mediaId={selectedMedia.id}
          mediaType={selectedMedia.type}
          onClose={() => setSelectedMedia(null)}
        />
      )}
    </div>
  );
}
