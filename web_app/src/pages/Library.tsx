// src/pages/Library.tsx
import React, { useEffect, useState } from "react";
import Navbar from "../components/navbar/Navbar";
import MovieCard from "../components/MovieCard";
import { useAuth } from "../context/AuthContext";
import { Trash2, Loader2 } from "lucide-react";
import type { Movie } from "../types/movie";

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
  const { user } = useAuth();

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
              const movie: Movie = {
                id: i.movie_id,
                title: i.title,
                poster_url: i.poster_path ?? "",
                release_date: i.release_date,
                vote_average: i.vote_average,
              };

              return (
                <div key={i.id} className="flex flex-col items-center">
                  <MovieCard
                    movie={movie}
                    isAuthenticated={true /* library page should be authed */ && !!user}
                    initialSaved={true}
                    className="w-48"
                    hideSavedStatus
                  />
                  <button
                    onClick={() => remove(i.movie_id)}
                    disabled={removingId === i.movie_id}
                    className={[
                      "mt-3 w-48 inline-flex items-center justify-center gap-2 cursor-pointer",
                      "text-white text-xs font-medium py-2 px-3 rounded-lg",
                      "bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500",
                      "shadow-lg hover:shadow-red-500/25 active:scale-95",
                      "transition-all duration-200 ease-out disabled:opacity-70 disabled:cursor-not-allowed",
                    ].join(" ")}
                    aria-label="Remove from library"
                  >
                    {removingId === i.movie_id ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Removing…</span>
                      </>
                    ) : (
                      <>
                        <Trash2 className="h-4 w-4" />
                        <span>Remove</span>
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
