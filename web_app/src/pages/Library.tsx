// src/pages/Library.tsx
import React, { useEffect, useState } from "react";
import Navbar from "../components/navbar/Navbar";
import MovieCard from "../components/MovieCard";
import { useAuth } from "../context/AuthContext";
import { Trash2, Loader2, PanelsTopLeft, LayoutGrid, Film } from "lucide-react";
import type { Movie } from "../types/movie";
import LibraryItemCard from "../components/library/LibraryItemCard";
import LibraryCarousel from "../components/library/LibraryCarousel";

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
  const [view, setView] = useState<"carousel" | "grid">("carousel");

  const onRemove = (movieId: number) => {
    // Remove the item whose movie_id matches the removed movie
    setItems((prev) => prev.filter((m) => m.movie_id !== movieId));
  };

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

  if (loading) return (
    <main className="w-full min-h-screen flex items-center justify-center bg-zinc-950 text-zinc-300">
      Loading…
    </main>
  );

  // Map items to Movie objects once for rendering
  const movies: Movie[] = items.map((i) => ({
    id: i.movie_id,
    title: i.title,
    poster_url: i.poster_path ?? "",
    release_date: i.release_date,
    vote_average: i.vote_average,
  }));

  return (
    <main className="w-full min-h-screen flex flex-col items-center bg-zinc-950">
      <Navbar />
      <div className="w-full max-w-7xl mx-auto px-8 py-12">
        {/* Page Header */}
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <h1 className="text-white text-3xl font-bold mb-2">Your Library</h1>
            <p className="text-zinc-400 text-sm">Saved movies you’ve added to your collection</p>
          </div>
          {/* View toggle */}
          {items.length > 0 && (
            <div className="inline-flex rounded-lg p-0.5 bg-zinc-800/70 border border-zinc-700/60">
              <button
                onClick={() => setView("carousel")}
                className={[
                  "px-3 py-1.5 text-sm rounded-md transition",
                  view === "carousel" ? "bg-zinc-700 text-white" : "text-zinc-300 hover:text-white",
                ].join(" ")}
                aria-pressed={view === "carousel"}
              >
                <Film />
              </button>
              <button
                onClick={() => setView("grid")}
                className={[
                  "px-3 py-1.5 text-sm rounded-md transition",
                  view === "grid" ? "bg-zinc-700 text-white" : "text-zinc-300 hover:text-white",
                ].join(" ")}
                aria-pressed={view === "grid"}
              >
                <LayoutGrid />
              </button>
            </div>
          )}
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
        ) : view === "carousel" ? (
          <LibraryCarousel movies={movies} onRemove={onRemove} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
            {movies.map((movie, idx) => (
              <div key={items[idx].id} className="flex flex-col items-center">
                <LibraryItemCard movie={movie} onRemove={onRemove} className="w-48" />
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
