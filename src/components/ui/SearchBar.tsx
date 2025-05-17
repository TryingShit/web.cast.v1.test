"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';

interface SearchResult {
  id: number;
  title?: string;
  name?: string;
  poster_path: string;
  media_type: 'movie' | 'tv';
}

interface SearchBarProps {
  onSearchResultSelect: (result: SearchResult) => void;
}

const SearchBar = ({ onSearchResultSelect }: SearchBarProps) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [debouncedQuery, setDebouncedQuery] = useState(query);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, 500); // Debounce time: 500ms

    return () => {
      clearTimeout(handler);
    };
  }, [query]);

  useEffect(() => {
    if (debouncedQuery) {
      const fetchResults = async () => {
        try {
          const response = await axios.get(
            `https://api.themoviedb.org/3/search/multi?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&query=${debouncedQuery}`
          );
          setResults(response.data.results.filter((result: any) => result.media_type === 'movie' || result.media_type === 'tv'));
        } catch (error) {
          console.error('Error fetching search results:', error);
          setResults([]);
        }
      };
      fetchResults();
    } else {
      setResults([]);
    }
  }, [debouncedQuery]);

  const handleSelectResult = (result: SearchResult) => {
    onSearchResultSelect(result);
    setQuery(''); // Clear search bar after selection
    setResults([]); // Clear results after selection
  };

  return (
    <div className="relative p-4 bg-gray-700 text-white">
      <input
        type="text"
        placeholder="Search for movies or TV shows..."
        className="w-full p-2 rounded bg-gray-600 placeholder-gray-400 text-white"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      {results.length > 0 && (
        <ul className="absolute z-10 w-full mt-1 bg-gray-600 rounded shadow-lg max-h-60 overflow-y-auto">
          {results.map((result) => (
            <li
              key={result.id}
              className="p-2 hover:bg-gray-500 cursor-pointer flex items-center"
              onClick={() => handleSelectResult(result)}
            >
              {result.poster_path && (
                <img
                  src={`https://image.tmdb.org/t/p/w92${result.poster_path}`}
                  alt={result.title || result.name}
                  className="w-10 h-15 mr-2 object-cover rounded"
                />
              )}
              <span>{result.title || result.name} ({result.media_type === 'movie' ? 'Movie' : 'TV Show'})</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;