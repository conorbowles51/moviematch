
import { useAuth } from '../../context/AuthContext';
import type { Movie } from '../../types/movie';
import MovieCard from '../MovieCard';

interface MovieListProps {
  movies: Movie[];
}

export default function MovieList({ movies }: MovieListProps) {
  const { user } = useAuth();

  if (movies.length === 0) {
    return (
      <div className="w-full max-w-7xl mx-auto px-8 py-16">
        <div className="text-center">
          <div className="mb-6">
            <div className="text-6xl mb-4">🎬</div>
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
      {/* Results Header */}
      <div className="mb-8">
        <h2 className="text-white text-2xl font-bold mb-2">
          Search Results
        </h2>
        <p className="text-zinc-400 text-sm">
          Found {movies.length} movie{movies.length === 1 ? '' : 's'}
        </p>
      </div>

      {/* Movie Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
        {movies.map((movie) => (
          <div key={movie.id} className="flex justify-center">
            <MovieCard
              isAuthenticated={!!user}
              movie={movie}
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
