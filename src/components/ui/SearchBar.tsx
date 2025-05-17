// src/components/ui/SearchBar.tsx
const SearchBar = () => {
  return (
    <div className="p-4 bg-gray-700 text-white">
      <input type="text" placeholder="Search for movies or TV shows..." className="w-full p-2 rounded bg-gray-600 placeholder-gray-400" />
    </div>
  );
};

export default SearchBar;