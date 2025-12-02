
import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import type { Movie } from '../../types/movie';
import MovieCard from '../MovieCard';

const API_URL = import.meta.env.VITE_API_URL;

interface MovieListProps {
  movies: Movie[];
}

interface LibraryItem {
  movie_id: number;
}

export default function MovieList({ movies }: MovieListProps) {
  const { user } = useAuth();

  const [savedIds, setSavedIds] = useState<number[]>([])

  const fetchSavedIds = async () => {
    try {
      // Fetch the user's library (requires the user to be logged in)
      const res = await fetch(`${API_URL}/api/library`, {
        credentials: "include", // include cookies if using session auth
      });

      if (!res.ok) {
        console.warn("Failed to fetch library:", res.status);
        return;
      }

      const data = await res.json();

      setSavedIds(data.map((item: LibraryItem) => item.movie_id));
    } catch (err) {
      console.error("Error fetching library:", err);
    }
  }

  useEffect(() => {
    fetchSavedIds()
  }, []);

  if (movies.length === 0) {
    return (
      <div className="w-full max-w-7xl mx-auto px-8 py-16">
        <div className="text-center">
          <div className="mb-6 group">
            <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">🎬</div>
            <h3 className="text-zinc-400 text-xl font-semibold mb-2">No movies found</h3>
            <p className="text-zinc-500 text-sm max-w-md mx-auto">
              Try searching for a movie above to discover your next favorite film
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-8 py-12">
      {/* Enhanced Results Header */}
      <div className="mb-8 group">
        <h2 className="text-white text-2xl font-bold mb-2 flex items-center gap-3">
          Search Results
          <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </h2>
        <p className="text-zinc-400 text-sm">
          Found <span className="text-red-300 font-medium">{movies.length}</span> movie{movies.length === 1 ? '' : 's'}
        </p>
      </div>

      {/* Movie Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
        {movies.map((movie) => (
          <div key={movie.id} className="flex justify-center">
            <MovieCard
              isAuthenticated={!!user}
              movie={movie}
              initialSaved={savedIds.includes(movie.id)}
            />
          </div>
        ))}
      </div>

      {/* Load More Section (if needed) */}
      {movies.length > 0 && (
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 text-zinc-400 text-sm">
            <span>Showing {movies.length} results</span>
          </div>
        </div>
      )}
    </div>
  );
}
