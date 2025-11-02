import { tmdbPosterUrl } from "../utils/tmdb";

interface MovieCardProps {
  poster_url: string;
  title: string;
  onAdd: () => void;
}

export default function MovieCard({ poster_url, title, onAdd }: MovieCardProps) {
  return (
    <div className="group relative w-48 rounded-xl overflow-hidden bg-zinc-800 border border-zinc-700/50 hover:border-zinc-600/80 shadow-2xl hover:shadow-[0_20px_40px_rgba(0,0,0,0.7)] transform hover:scale-105 transition-all duration-300 ease-out">
      {/* Poster Image */}
      <div className="relative overflow-hidden">
        <img
          src={`${tmdbPosterUrl(poster_url, "w500")}`}
          alt={title}
          className="w-full h-72 object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
        />
        {/* Subtle gradient overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Overlay with title + button */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/70 to-transparent p-4">
        <h2 className="text-white font-bold text-sm leading-tight mb-3 line-clamp-2 drop-shadow-sm">{title}</h2>
        <button
          onClick={onAdd}
          className="w-full cursor-pointer bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white text-xs font-medium py-2 px-3 rounded-lg shadow-lg hover:shadow-red-500/25 transform hover:-translate-y-0.5 transition-all duration-200 ease-out active:scale-95"
        >
          + Add to Library
        </button>
      </div>
      
      {/* Subtle rim light effect */}
      <div className="absolute inset-0 rounded-xl ring-1 ring-white/10 group-hover:ring-white/20 transition-all duration-300 pointer-events-none" />
    </div>
  )
}
