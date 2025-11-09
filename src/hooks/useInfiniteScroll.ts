import { useEffect, useRef } from 'react';

interface UseInfiniteScrollProps {
  onIntersect: () => void;
  isLoading: boolean;
  hasMore: boolean;
}

export function useInfiniteScroll({ onIntersect, isLoading, hasMore }: UseInfiniteScrollProps) {
  const observerTarget = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const currentObserver = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting && !isLoading && hasMore) {
          onIntersect();
        }
      },
      { threshold: 0.1 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      currentObserver.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        currentObserver.unobserve(currentTarget);
      }
    };
  }, [onIntersect, isLoading, hasMore]);

  return observerTarget;
}