// src/app/page.tsx
import SearchBar from '@/components/ui/SearchBar';
import ToggleMode from '@/components/ui/ToggleMode';
import VideoPlayer from '@/components/ui/VideoPlayer';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center bg-gray-900 text-white">
      <div className="container mx-auto p-4 space-y-8">
        <SearchBar />
        <ToggleMode />
        <VideoPlayer />
      </div>
    </main>
  );
}
