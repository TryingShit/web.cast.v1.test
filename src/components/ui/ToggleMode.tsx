// src/components/ui/ToggleMode.tsx
const ToggleMode = () => {
  return (
    <div className="p-4 flex justify-center items-center space-x-4 bg-gray-700">
      <button className="px-4 py-2 bg-blue-500 hover:bg-blue-700 text-white font-bold rounded">
        Movies
      </button>
      <button className="px-4 py-2 bg-green-500 hover:bg-green-700 text-white font-bold rounded">
        TV Shows
      </button>
    </div>
  );
};

export default ToggleMode;