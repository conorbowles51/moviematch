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
    <main className="w-full min-h-screen flex flex-col items-center bg-zinc-950 relative overflow-hidden">
      <Navbar />
      
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-20 right-20 w-96 h-96 bg-gradient-radial from-red-500/5 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-40 left-20 w-80 h-80 bg-gradient-radial from-red-600/5 to-transparent rounded-full blur-3xl" />
      </div>
      
      <div className="flex-1 flex items-center justify-center relative z-10">
        <div className="text-center bg-gradient-to-br from-zinc-900/80 to-zinc-900/40 border border-zinc-700/50 rounded-2xl p-12 backdrop-blur-sm shadow-2xl ring-1 ring-white/5">
          <div className="mb-6">
            <div className="w-16 h-16 border-4 border-zinc-600 border-t-red-400 rounded-full animate-spin mx-auto mb-4"></div>
            <h3 className="text-xl font-bold bg-gradient-to-r from-white to-zinc-200 bg-clip-text text-transparent mb-2">
              Loading Your Library
            </h3>
            <p className="text-zinc-400 text-sm">Gathering your movie collection...</p>
          </div>
        </div>
      </div>
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
    <main className="w-full min-h-screen flex flex-col items-center bg-zinc-950 relative overflow-hidden">
      <Navbar />
      
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-20 right-20 w-96 h-96 bg-gradient-radial from-red-500/5 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-40 left-20 w-80 h-80 bg-gradient-radial from-red-600/5 to-transparent rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-red-500/3 to-red-600/3 rounded-full blur-3xl animate-spin" style={{animationDuration: '60s'}} />
      </div>

      <div className="w-full max-w-7xl mx-auto px-8 py-12 relative z-10">
        {/* Enhanced Hero Section */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-3 mb-4 px-4 py-2 rounded-full bg-gradient-to-r from-red-500/10 to-red-600/10 border border-red-500/20 backdrop-blur-sm">
            <Film className="w-5 h-5 text-red-400" />
            <span className="text-red-300 text-sm font-medium tracking-wide">PERSONAL COLLECTION</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-white via-red-100 to-white bg-clip-text text-transparent drop-shadow-2xl">
            Your Movie Library
          </h1>
          <p className="text-zinc-300 text-lg max-w-2xl mx-auto leading-relaxed">
            Your curated collection of must-watch movies.
          </p>
        </div>

        {/* Page Header */}
        <div className="mb-8 flex items-end justify-end gap-4">
          
          {/* View toggle */}
          {items.length > 0 && (
            <div className="bg-gradient-to-br from-zinc-900/80 to-zinc-900/40 border border-zinc-700/50 rounded-xl p-2 backdrop-blur-sm shadow-xl ring-1 ring-white/5">
              <div className="inline-flex rounded-lg p-1 bg-zinc-800/50">
                <button
                  onClick={() => setView("carousel")}
                  className={[
                    "px-4 py-2.5 text-sm rounded-lg transition-all duration-200 flex items-center gap-2 font-medium",
                    view === "carousel" 
                      ? "bg-gradient-to-r from-red-600 to-red-500 text-white shadow-lg shadow-red-500/25" 
                      : "text-zinc-300 hover:text-white hover:bg-zinc-700/50",
                  ].join(" ")}
                  aria-pressed={view === "carousel"}
                >
                  <Film className="w-4 h-4" />
                  Carousel
                </button>
                <button
                  onClick={() => setView("grid")}
                  className={[
                    "px-4 py-2.5 text-sm rounded-lg transition-all duration-200 flex items-center gap-2 font-medium",
                    view === "grid" 
                      ? "bg-gradient-to-r from-red-600 to-red-500 text-white shadow-lg shadow-red-500/25" 
                      : "text-zinc-300 hover:text-white hover:bg-zinc-700/50",
                  ].join(" ")}
                  aria-pressed={view === "grid"}
                >
                  <LayoutGrid className="w-4 h-4" />
                  Grid
                </button>
              </div>
            </div>
          )}
        </div>

        {items.length === 0 ? (
          <div className="w-full py-20">
            <div className="text-center bg-gradient-to-br from-zinc-900/80 to-zinc-900/40 border border-zinc-700/50 rounded-2xl p-12 backdrop-blur-sm shadow-2xl ring-1 ring-white/5 max-w-2xl mx-auto">
              <div className="relative mb-8">
                <div className="text-8xl mb-4 animate-bounce">🎞️</div>
                <div className="absolute -top-2 -right-8 w-6 h-6 bg-gradient-to-r from-purple-500 to-red-500 rounded-full animate-pulse" />
              </div>
              <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-zinc-200 to-zinc-400 bg-clip-text text-transparent">
                Your Library Awaits
              </h3>
              <p className="text-zinc-300 text-base max-w-md mx-auto leading-relaxed mb-6">
                Start building your personal movie collection by exploring films on the homepage.
                <span className="text-red-300 font-medium"> Every great collection starts with one movie!</span>
              </p>
              <a
                href="/"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 shadow-lg hover:shadow-red-500/25 transition-all duration-200 hover:scale-105 ring-2 ring-white/10 hover:ring-white/20"
              >
                <Film className="w-5 h-5" />
                Discover Movies
              </a>
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
