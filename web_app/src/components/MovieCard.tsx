import { useState } from "react";
import { tmdbPosterUrl } from "../utils/tmdb";
import type { Movie } from "../types/movie";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

interface MovieCardProps {
  movie: Movie;
  isAuthenticated: boolean;
  /** If you already know it's saved (e.g., preloaded library), seed this. */
  initialSaved?: boolean;
  /** Optional callback when a movie gets saved successfully. */
  onSaved?: (movieId: number) => void;
  /** Optional: tweak card width */
  className?: string;
}

export default function MovieCard({
  movie,
  isAuthenticated,
  initialSaved = false,
  onSaved,
  className = "w-48",
}: MovieCardProps) {
  const navigate = useNavigate();

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(initialSaved);
  const [error, setError] = useState<string | null>(null);

  const poster = tmdbPosterUrl(movie.poster_url, "w500");
  const year = movie.release_date?.slice(0, 4);
  const rating =
    typeof movie.vote_average === "number"
      ? movie.vote_average.toFixed(1)
      : undefined;

  async function saveToLibrary() {
    if (!isAuthenticated || saved || saving) return;
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/api/library/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          movie: {
            id: movie.id,
            title: movie.title,
            poster_path: movie.poster_url,
            release_date: movie.release_date,
            vote_average: movie.vote_average,
          },
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        setSaved(true);
        onSaved?.(movie.id);
      } else if (data?.message === "Already in library") {
        setSaved(true);
        onSaved?.(movie.id);
      } else {
        setError(data?.error || "Could not save. Please try again.");
      }
    } catch (_) {
      setError("Network error. Please try again.");
    } finally {
      setSaving(false);
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
      onClick={() => navigate(`/movies/${movie.id}`)}
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

        {/* Add/Save Button - positioned in top-right */}
        {isAuthenticated && (
          <div className="absolute top-2 right-2">
            <div className="relative group">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  saveToLibrary();
                }}
                disabled={saved || saving}
                className={[
                  "w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium",
                  "backdrop-blur-sm border transition-all duration-200",
                  saved
                    ? "bg-emerald-600/90 border-emerald-500/50 hover:bg-emerald-500/90"
                    : "bg-black/70 border-white/20 hover:bg-black/80 hover:border-white/40",
                  "shadow-lg hover:scale-110 active:scale-95 disabled:opacity-70",
                ].join(" ")}
                aria-label={saved ? "Saved to library" : "Add to library"}
              >
                {saved ? "✓" : saving ? "⋯" : "+"}
              </button>
              {!saved && !saving && (
                <div
                  className="pointer-events-none absolute right-0 top-full mt-1 whitespace-nowrap rounded-md bg-black/80 text-white text-xs px-2 py-1 border border-white/20 opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 shadow-lg"
                  role="tooltip"
                >
                  Add to library
                </div>
              )}
            </div>
          </div>
        )}

        {/* Login prompt for non-authenticated users */}
        {!isAuthenticated && (
          <div className="absolute top-2 right-2">
            <a
              href="/login"
              onClick={(e) => {
                // Prevent the card's onClick navigation
                e.stopPropagation();
              }}
              className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm bg-black/70 border border-white/20 hover:bg-black/80 hover:border-white/40 backdrop-blur-sm transition-all duration-200"
              aria-label="Log in to save"
            >
              +
            </a>
          </div>
        )}
      </div>

      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/70 to-transparent p-3">
        <h2 className="text-white font-semibold text-sm leading-snug mb-2 line-clamp-2 drop-shadow-sm">
          {movie.title}
        </h2>

        {error && (
          <div className="mt-2 text-[11px] text-red-300/90">{error}</div>
        )}
      </div>
    </div>
  );
}
