"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';

interface MediaItem {
  id: number;
  title?: string;
  name?: string;
  poster_path: string;
  media_type: 'movie' | 'tv';
  overview: string;
}

interface RecommendationsProps {
  onSelectItem: (item: MediaItem) => void; // Callback to handle item selection
}

const Recommendations = ({ onSelectItem }: RecommendationsProps) => {
  const [trendingMovies, setTrendingMovies] = useState<MediaItem[]>([]);
  const [trendingTvShows, setTrendingTvShows] = useState<MediaItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTrendingData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [moviesResponse, tvShowsResponse] = await Promise.all([
          axios.get(
            `https://api.themoviedb.org/3/trending/movie/week?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`
          ),
          axios.get(
            `https://api.themoviedb.org/3/trending/tv/week?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`
          ),
        ]);
        setTrendingMovies(moviesResponse.data.results.slice(0, 10));
        setTrendingTvShows(tvShowsResponse.data.results.slice(0, 10));
      } catch (err) {
        console.error('Error fetching trending data:', err);
        setError('Failed to load trending content.');
      }
      setIsLoading(false);
    };

    fetchTrendingData();
  }, []);

  if (isLoading) {
    return <p className="text-center text-gray-400 py-5">Loading trending content...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500 py-5">{error}</p>;
  }

  if (trendingMovies.length === 0 && trendingTvShows.length === 0) {
    return <p className="text-center text-gray-400 py-5">No trending content available at the moment.</p>;
  }

  const renderMediaGrid = (items: MediaItem[], title: string) => (
    items.length > 0 && (
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-white">{title}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-gray-700 rounded-lg overflow-hidden shadow-lg cursor-pointer transform hover:scale-105 transition-transform duration-200 ease-in-out"
              onClick={() => onSelectItem(item)} // Use the callback on item click
            >
              {item.poster_path ? (
                <img
                  src={`https://image.tmdb.org/t/p/w300${item.poster_path}`}
                  alt={item.title || item.name}
                  className="w-full h-auto object-cover"
                />
              ) : (
                <div className="w-full h-48 bg-gray-600 flex items-center justify-center">
                  <span className="text-gray-400">No Image</span>
                </div>
              )}
              <div className="p-3">
                <h3 className="text-sm font-semibold text-white truncate">
                  {item.title || item.name}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  );

  return (
    <div className="mt-8">
      {renderMediaGrid(trendingMovies, 'Trending Movies This Week')}
      {renderMediaGrid(trendingTvShows, 'Trending TV Series This Week')}
    </div>
  );
};

export default Recommendations;