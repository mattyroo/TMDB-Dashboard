import { useEffect, useState } from 'react';
import type { MovieDetails, TVShowDetails } from '../types/tmdb';
import { getMovies, getTVShows, getImageUrl, formatDate, formatRating } from '../services/tmdb';

interface DetailModalProps {
  mediaId: number;
  mediaType: 'movie' | 'tv';
  onClose: () => void;
}

export default function DetailModal({ mediaId, mediaType, onClose }: DetailModalProps) {
  const [details, setDetails] = useState<MovieDetails | TVShowDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        const data = mediaType === 'movie'
          ? await getMovies.details(mediaId)
          : await getTVShows.details(mediaId);
        setDetails(data);
      } catch (error) {
        console.error('Error fetching details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [mediaId, mediaType]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!details) return null;

  const title = mediaType === 'movie' ? (details as MovieDetails).title : (details as TVShowDetails).name;
  const date = mediaType === 'movie' 
    ? (details as MovieDetails).release_date 
    : (details as TVShowDetails).first_air_date;
  const runtime = mediaType === 'movie'
    ? `${(details as MovieDetails).runtime} min`
    : `${(details as TVShowDetails).number_of_seasons} Season${(details as TVShowDetails).number_of_seasons > 1 ? 's' : ''}`;

  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 overflow-y-auto"
      onClick={handleBackdropClick}
    >
      <div className="bg-gray-900 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 w-10 h-10 flex items-center justify-center transition-colors"
        >
          X
        </button>

        {/* Backdrop Image */}
        <div className="relative h-96 overflow-hidden rounded-t-lg">
          <img
            src={getImageUrl(details.backdrop_path, 'original')}
            alt={title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-t from-gray-900 via-gray-900/60 to-transparent" />
        </div>

        {/* Content */}
        <div className="p-8 -mt-32 relative z-10">
          <div className="flex space-x-6">
            {/* Poster */}
            <img
              src={getImageUrl(details.poster_path)}
              alt={title}
              className="w-48 h-fit shadow-2xl shrink-0 hidden sm:block"
            />

            {/* Details */}
            <div className="flex-1">
              <h2 className="text-4xl font-bold text-white mb-2">{title}</h2>
              
              {details.tagline && (
                <p className="text-gray-400 italic mb-4">{details.tagline}</p>
              )}

              <div className="flex items-center space-x-4 mb-4 text-sm">
                <div className="flex items-center gap-1">
                  <span className="text-tertiary text-xl">&#9733;</span>
                  <span className="text-primary-foreground font-semibold text-lg">
                    {formatRating(details.vote_average)}
                  </span>
                </div>
                <span className="text-gray-300">{details.status}</span>
                <span className="text-gray-300">{formatDate(date)}</span>
                <span className="text-gray-300">{runtime}</span>
              </div>

              {/* Genres */}
              <div className="flex flex-wrap space-2 mb-4">
                {details.genres.map((genre) => (
                  <span
                    key={genre.id}
                    className="py-1 mr-3 text-sm border-b text-light"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>

              {/* Overview */}
              <div className="mb-4">
                <h3 className="text-xl font-semibold text-white mb-2">Overview</h3>
                <p className="text-gray-300 leading-relaxed">{details.overview}</p>
              </div>

              {/* Additional Info */}
              <div className="grid grid-cols-2 space-4 text-sm">
                {/* <div>
                  <span className="text-gray-400">Status:</span>
                  <span className="text-white ml-2">{details.status}</span>
                </div> */}
                {mediaType === 'movie' && (
                  <>
                    {/* <div>
                      <span className="text-gray-400">Budget:</span>
                      <span className="text-white ml-2">
                        ${(details as MovieDetails).budget.toLocaleString()}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400">Revenue:</span>
                      <span className="text-white ml-2">
                        ${(details as MovieDetails).revenue.toLocaleString()}
                      </span>
                    </div> */}
                  </>
                )}
                {mediaType === 'tv' && (
                  <>
                    <div>
                      <span className="text-gray-400">Episodes:</span>
                      <span className="text-white ml-2">
                        {(details as TVShowDetails).number_of_episodes}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400">Last Air Date:</span>
                      <span className="text-white ml-2">
                        {formatDate((details as TVShowDetails).last_air_date)}
                      </span>
                    </div>
                  </>
                )}
              </div>

              {/* Production Companies */}
              {/* {details.production_companies.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-white mb-2">Production</h3>
                  <div className="flex flex-wrap space-3">
                    {details.production_companies.slice(0, 4).map((company) => (
                      <span key={company.id} className="text-gray-300 text-sm">
                        {company.name}
                      </span>
                    ))}
                  </div>
                </div>
              )} */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
