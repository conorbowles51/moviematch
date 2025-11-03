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
        "group relative rounded-xl overflow-hidden bg-zinc-850 border border-zinc-700/50",
        "hover:border-zinc-600/80 shadow-2xl hover:shadow-[0_18px_36px_rgba(0,0,0,0.65)]",
        "transform hover:scale-[1.03] transition-all duration-300 ease-out focus-within:ring-2 focus-within:ring-zinc-400/40",
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
          <div className="w-full h-72 grid place-items-center bg-zinc-800 text-zinc-400">
            No image
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute inset-0 rounded-xl ring-1 ring-white/10 group-hover:ring-white/20 transition-all duration-300 pointer-events-none" />

        {/* Top-left chips */}
        <div className="absolute top-2 left-2 flex gap-2">
          {year && (
            <span className="px-2 py-0.5 text-[11px] font-medium rounded-full bg-black/70 text-white/90 backdrop-blur">
              {year}
            </span>
          )}
          {rating && (
            <span className="px-2 py-0.5 text-[11px] font-medium rounded-full bg-black/70 text-white/90 backdrop-blur">
              ★ {rating}
            </span>
          )}
      </div>
      {/* Remove button - bottom-right */}
      <div className="absolute bottom-2 right-2 z-10">
        <button
          onClick={remove}
          disabled={isRemoving}
          className={[
            "w-8 h-8 rounded-full flex items-center justify-center text-white",
            "backdrop-blur-sm border transition-all duration-200",
            "bg-black/70 border-white/20 hover:bg-black/80 hover:border-white/40",
            "shadow-lg hover:scale-110 active:scale-95 disabled:opacity-70",
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
