// src/pages/Library.tsx
import React, { useEffect, useState } from "react";
import { tmdbPosterUrl } from "../utils/tmdb";
import Navbar from "../components/navbar/Navbar";

const API_URL = import.meta.env.VITE_API_URL;

type LibraryItem = {
  id: number;
  movie_id: number;
  title: string;
  poster_path?: string;
  release_date?: string;
  vote_average?: number;
  created_at: string;
};

export default function Library() {
  const [items, setItems] = useState<LibraryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState<number | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API_URL}/api/library`, { credentials: "include" });
        const data = await res.json();
        if (res.ok) setItems(data);
        else console.error(data?.error || data);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function remove(movie_id: number) {
    console.log(movie_id)
    if (removingId) return;
    setRemovingId(movie_id);
    try {
      const res = await fetch(`${API_URL}/api/library/remove/${movie_id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (res.ok) setItems((prev) => prev.filter((i) => i.movie_id !== movie_id));
    } finally {
      setRemovingId(null);
    }
  }

  if (loading) return (
    <main className="w-full min-h-screen flex items-center justify-center bg-zinc-950 text-zinc-300">
      Loading…
    </main>
  );

  return (
    <main className="w-full min-h-screen flex flex-col items-center bg-zinc-950">
      <Navbar />
      <div className="w-full max-w-7xl mx-auto px-8 py-12">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-white text-3xl font-bold mb-2">Your Library</h1>
          <p className="text-zinc-400 text-sm">Saved movies you’ve added to your collection</p>
        </div>

        {items.length === 0 ? (
          <div className="w-full max-w-7xl mx-auto py-16">
            <div className="text-center">
              <div className="mb-6">
                <div className="text-6xl mb-4">🎞️</div>
                <h3 className="text-zinc-400 text-xl font-semibold mb-2">No saved movies yet</h3>
                <p className="text-zinc-500 text-sm max-w-md mx-auto">
                  Find movies on the homepage and click “Add to Library”.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
            {items.map((i) => {
              const poster = tmdbPosterUrl(i.poster_path, "w500");
              const year = i.release_date?.slice(0, 4);
              const rating = typeof i.vote_average === "number" ? i.vote_average.toFixed(1) : undefined;

              return (
                <div key={i.id} className="flex justify-center">
                  <div
                    className={[
                      "group relative rounded-xl overflow-hidden bg-zinc-850 border border-zinc-700/50",
                      "hover:border-zinc-600/80 shadow-2xl hover:shadow-[0_18px_36px_rgba(0,0,0,0.65)]",
                      "transform hover:scale-[1.03] transition-all duration-300 ease-out",
                      "w-48",
                    ].join(" ")}
                  >
                    {/* Poster */}
                    <div className="relative overflow-hidden">
                      {poster ? (
                        <img
                          src={poster}
                          alt={i.title}
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
                    </div>

                    {/* Bottom overlay: title + remove button */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/70 to-transparent p-3">
                      <h2 className="text-white font-semibold text-sm leading-snug mb-2 line-clamp-2 drop-shadow-sm">
                        {i.title}
                      </h2>
                      <button
                        onClick={() => remove(i.movie_id)}
                        disabled={removingId === i.movie_id}
                        className={[
                          "w-full cursor-pointer text-white text-xs font-medium py-2 px-3 rounded-lg",
                          "bg-gradient-to-r",
                          "from-red-700 to-red-600 hover:from-red-600 hover:to-red-500",
                          "shadow-lg hover:shadow-red-500/25 active:scale-95 transition-all duration-200 ease-out disabled:opacity-70",
                        ].join(" ")}
                        aria-label="Remove from library"
                      >
                        {removingId === i.movie_id ? "Removing…" : "Remove"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
