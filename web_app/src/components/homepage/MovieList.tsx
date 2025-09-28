
import type { Movie } from '../../types/movie';
import MovieCard from '../MovieCard';

interface MovieListProps {
  movies: Movie[];
}

export default function MovieList({ movies }: MovieListProps) {
  return (
    <div className='w-full max-w-[1600px] px-20'>
      <div
        className="mt-6 grid gap-6"
        style={{
          gridTemplateColumns: "repeat(auto-fit, minmax(12rem, 1fr))",
        }}
      >
        {movies.map((m) => (
          <MovieCard
            key={m.id}
            title={m.title}
            poster_path={m.poster_path}
            onAdd={() => console.log(`Add ${m.title} (${m.id}) to library`)}
          />
        ))}
      </div>
    </div>
  )
}
