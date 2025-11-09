import { memo } from 'react';
import type { Movie, TVShow } from '../types/tmdb';
import MediaCard from './MediaCard';

interface MediaGridProps {
  data: (Movie | TVShow)[];
  mediaType: 'movie' | 'tv';
  onSelect: (id: number) => void;
}

const MediaGrid = memo(function MediaGrid({ data, mediaType, onSelect }: MediaGridProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 space-6">
      {data.map((item) => (
        <MediaCard
          key={`${mediaType}-${item.id}`}
          media={item}
          mediaType={mediaType}
          onClick={() => onSelect(item.id)}
        />
      ))}
    </div>
  );
});

export default MediaGrid;