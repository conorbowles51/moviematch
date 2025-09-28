
const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/w500";

interface MovieCardProps {
  poster_path: string;
  title: string;
  onAdd: () => void;
}

export default function MovieCard({ poster_path, title, onAdd }: MovieCardProps) {
  return (
    <div className="relative w-48 rounded-lg overflow-hidden shadow-lg bg-zinc-800 hover:scale-110 transition-all">
      {/* Poster Image */}
      <img
        src={`${TMDB_IMAGE_BASE}${poster_path}`}
        alt={title}
        className="w-full h-72 object-cover"
      />

      {/* Overlay with title + button */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
        <h2 className="text-white font-semibold text-sm truncate">{title}</h2>
        <button
          onClick={onAdd}
          className="mt-2 w-full bg-red-600 text-white text-xs py-1 rounded hover:bg-red-500 transition cursor-pointer"
        >
          + Add to Library
        </button>
      </div>
    </div>
  )
}
