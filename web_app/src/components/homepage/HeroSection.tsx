import { useCallback, useState } from "react";
import SearchBar from "../SearchBar";
import MovieCard from "../MovieCard";
import type { Movie } from "../../types/movie";

export default function HeroSection() {
  const [results, setResults] = useState<Movie[]>([])
  

  // useCallback so that the function is not called when results changes and react re-renders
  const onSearch = useCallback(async (q: string) => {
    console.log("Searching for: ", q)
    try {
      const res = await fetch(`http://localhost:8000/movies/search?query=${encodeURIComponent(q)}`)
      if (!res.ok) {
        throw new Error(`Backend error: ${res.status}`)
      }
      const data = await res.json()
      setResults(data.results || [])
      console.log(data)
    } catch (err: any) {
      // TODO: handle this better
      console.log(err);
    }
  }, [])

  return (
    <div className="w-full h-100 flex flex-col justify-between bg-zinc-900 p-6">
      <div>
        <h1 className="text-zinc-50 text-8xl font-bebas">
          MovieMatch
        </h1>
        <p className="text-zinc-200 ml-5">
          Find the perfect movie to watch together.
        </p>
      </div>

      <div className="w-full flex justify-center">
        <SearchBar 
          onSearch={onSearch}
        />
      </div>

      <div className="mt-6 grid gap-6 grid-cols-2 sm:grid-cols-3 md:grid-cols-4">
        {results.map((m) => (
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
