"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import Image from 'next/image';

interface SearchResult {
  id: number;
  title?: string;
  name?: string;
  poster_path: string;
  media_type: 'movie' | 'tv';
  overview?: string; // Added for initial display before full details fetch
}

interface MediaDetails extends SearchResult {
  overview: string;
  // Add other details you might want to display, e.g., release_date, vote_average, etc.
}

interface VideoPlayerProps {
  selectedItem: SearchResult | null;
}

const VideoPlayer = ({ selectedItem }: VideoPlayerProps) => {
  const [details, setDetails] = useState<MediaDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (selectedItem) {
      const fetchDetails = async () => {
        setIsLoading(true);
        setError(null);
        try {
          const response = await axios.get(
            `https://api.themoviedb.org/3/${selectedItem.media_type}/${selectedItem.id}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&append_to_response=videos`
          );
          setDetails(response.data as MediaDetails);
        } catch (err) {
          console.error('Error fetching media details:', err);
          setError('Failed to load media details.');
          setDetails(null); // Clear details on error
        }
        setIsLoading(false);
      };
      fetchDetails();
    } else {
      setDetails(null); // Clear details if no item is selected
    }
  }, [selectedItem]);

  const videoSrc = selectedItem ? `https://vidsrc.xyz/embed/${selectedItem.media_type}/${selectedItem.id}` : '';
  return (
    <div className="bg-gray-800 text-white p-4 rounded-lg shadow-xl">
      {isLoading && <p className="text-center py-10">Loading details...</p>}
      {error && <p className="text-center py-10 text-red-500">{error}</p>}
      {!isLoading && !error && selectedItem && details ? (
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="lg:w-2/3">
            <div className="aspect-video bg-black rounded-md overflow-hidden mb-4">
              <iframe
                src={videoSrc}
                title={details.title || details.name}
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
                sandbox="allow-scripts allow-same-origin allow-presentation allow-popups allow-forms"
                className="w-full h-full"
              ></iframe>
            </div>
          </div>
          <div className="lg:w-1/3">
            {details.poster_path && (
              <Image
                src={`https://image.tmdb.org/t/p/w300${details.poster_path}`}
                alt={details.title || details.name || 'Video player poster'}
                width={300} // Assuming w300 means 300px width
                height={450} // Assuming a common aspect ratio like 2:3 for posters (300 * 1.5)
                className="w-full max-w-xs mx-auto lg:mx-0 mb-4 object-cover rounded shadow-lg"
                priority // Prioritize loading as this is a key image for the selected item
              />
            )}
            <h2 className="text-3xl font-bold mb-2">{details.title || details.name}</h2>
            <p className="text-md text-gray-400 mb-1">Type: {details.media_type === 'movie' ? 'Movie' : 'TV Show'}</p>
            {/* Add more details like release date, rating etc. if available in 'details' */}
            {details.overview && (
              <div className="mt-4">
                <h3 className="text-xl font-semibold mb-1">Overview</h3>
                <p className="text-sm text-gray-300 leading-relaxed max-h-60 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
                  {details.overview}
                </p>
              </div>
            )}
          </div>
        </div>
      ) : (
        !isLoading && !error && (
          <div className="aspect-video bg-black flex flex-col items-center justify-center text-white p-4 rounded-md">
            <p>Video Player Area - Select a movie or TV show to display details</p>
          </div>
        )
      )}
    </div>
  );
};

export default VideoPlayer;