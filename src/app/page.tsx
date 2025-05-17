// src/app/page.tsx
"use client";

import { useState } from 'react';
import SearchBar from '@/components/ui/SearchBar';
import ToggleMode from '@/components/ui/ToggleMode';
import Recommendations from '@/components/ui/Recommendations';
import VideoPlayer from '@/components/ui/VideoPlayer';

interface SearchResult {
  id: number;
  title?: string;
  name?: string;
  poster_path: string;
  media_type: 'movie' | 'tv';
  overview?: string; // Added to match the MediaItem interface in Recommendations
}

export default function Home() {
  const [selectedItem, setSelectedItem] = useState<SearchResult | null>(null);

  const handleSearchResultSelect = (result: SearchResult) => {
    setSelectedItem(result);
  };

  return (
    <main className="flex min-h-screen flex-col items-center bg-gray-900 text-white">
      <div className="container mx-auto p-4 space-y-8 w-full max-w-4xl">
        <SearchBar onSearchResultSelect={handleSearchResultSelect} />
        <ToggleMode />
        <VideoPlayer selectedItem={selectedItem} />
        <Recommendations onSelectItem={handleSearchResultSelect} />
      </div>
    </main>
  );
}
