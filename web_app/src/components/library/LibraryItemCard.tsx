import { tmdbPosterUrl } from "../../utils/tmdb";
import type { Movie } from "../../types/movie";
import { useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

interface LibraryItemCardProps {
  movie: Movie;
  /** Optional: tweak card width */
  className?: string;
  onRemove: (movieId: number) => void;
}

export default function LibraryItemCard({
  movie,
  onRemove,
  className = "w-48",
}: LibraryItemCardProps) {
  const [isRemoving, setIsRemoving] = useState(false);

  const poster = tmdbPosterUrl(movie.poster_url, "w500");
  const year = movie.release_date?.slice(0, 4);
  const rating =
    typeof movie.vote_average === "number"
      ? movie.vote_average.toFixed(1)
      : undefined

  async function remove() {
    if (isRemoving) return;
    setIsRemoving(true);
    try {
      const res = await fetch(`${API_URL}/api/library/remove/${movie.id}`, {
          method: "DELETE",
          credentials: "include",
      });

      if (res.ok) {
        onRemove(movie.id);
      }
    } finally {
      setIsRemoving(false);
    }
  }

  return (
    <div
      className={[
        "group relative rounded-2xl overflow-hidden bg-gradient-to-br from-zinc-800/80 to-zinc-900/60 border border-zinc-700/50",
        "hover:border-zinc-600/80 shadow-2xl hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)]",
        "transform hover:scale-[1.05] transition-all duration-300 ease-out focus-within:ring-2 focus-within:ring-red-400/40 ring-1 ring-white/5 hover:ring-white/10 backdrop-blur-sm",
        className,
      ].join(" ")}
    >
      {/* Poster */}
      <div className="relative overflow-hidden">
        {poster ? (
          <img
            src={poster}
            alt={movie.title}
            className="w-full h-72 object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-72 grid place-items-center bg-gradient-to-br from-zinc-700 to-zinc-800 text-zinc-400 border border-zinc-600/50">
            <div className="text-center">
              <div className="text-3xl mb-2">🎬</div>
              <div className="text-xs">No image</div>
            </div>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute inset-0 rounded-2xl ring-1 ring-white/10 group-hover:ring-white/20 transition-all duration-300 pointer-events-none" />

        {/* Movie title overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/70 to-transparent p-3 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <h3 className="text-white font-semibold text-sm leading-tight line-clamp-2 drop-shadow-lg">
            {movie.title}
          </h3>
        </div>

        {/* Enhanced top-left chips */}
        <div className="absolute top-3 left-3 flex gap-2">
          {year && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold rounded-full bg-gradient-to-r from-zinc-800/90 to-zinc-700/90 text-white backdrop-blur border border-zinc-600/50">
              📅 {year}
            </span>
          )}
          {rating && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold rounded-full bg-gradient-to-r from-yellow-500/80 to-orange-500/80 text-white backdrop-blur border border-yellow-400/50">
              ⭐ {rating}
            </span>
          )}
        </div>
      {/* Enhanced remove button - bottom-right */}
      <div className="absolute bottom-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-all duration-300">
        <button
          onClick={remove}
          disabled={isRemoving}
          className={[
            "w-10 h-10 rounded-full flex items-center justify-center text-white",
            "backdrop-blur-sm border transition-all duration-200",
            "bg-gradient-to-r from-red-600/80 to-red-500/80 border-red-400/50 hover:from-red-500 hover:to-red-400",
            "shadow-lg hover:shadow-red-500/25 hover:scale-110 active:scale-95 disabled:opacity-70 ring-2 ring-white/10 hover:ring-white/20",
          ].join(" ")}
          aria-label="Remove from library"
          title="Remove from library"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-4 h-4"
            aria-hidden="true"
          >
            <path d="M3 6h18" />
            <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
            <path d="M10 11v6" />
            <path d="M14 11v6" />
          </svg>
        </button>
      </div>
    </div>
  </div>
  );
}
