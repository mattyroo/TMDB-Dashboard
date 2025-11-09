import { memo } from 'react';
import type { Movie, TVShow } from '../types/tmdb';
import { getImageUrl, formatRating } from '../services/tmdb';
import defaultPoster from '../assets/not-found.png';

interface MediaCardProps {
  media: Movie | TVShow;
  mediaType: 'movie' | 'tv';
  onClick: () => void;
}

const MediaCard = memo(function MediaCard({ media, mediaType, onClick }: MediaCardProps) {
  const title = mediaType === 'movie' ? (media as Movie).title : (media as TVShow).name;
  const date = mediaType === 'movie' ? (media as Movie).release_date : (media as TVShow).first_air_date;
  const year = date ? new Date(date).getFullYear() : 'N/A';

  return (
    <div
      className="group cursor-pointer transition-transform hover:scale-105"
      onClick={onClick}
    >
      <div className="relative overflow-hidden m-3 shadow-lg border-light border-2">
        <img
          src={getImageUrl(media.poster_path, 'w500')}
          alt={title}
          className="w-full h-auto aspect-2/3 object-cover border-gray-900 border-6"
          loading="lazy"
          onError={(event) => {
            event.currentTarget.onerror = null;
            event.currentTarget.src = defaultPoster;
          }}
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3 className="text-white font-semibold text-lg mb-1 truncate-2">
              {title}
            </h3>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-300">{year}</span>
              <div className="flex items-center space-x-1">
                <span className="text-tertiary" aria-hidden="true">&#9733;</span>
                <span className="text-primary-foreground font-semibold">{formatRating(media.vote_average)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default MediaCard;
