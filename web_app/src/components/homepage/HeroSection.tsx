import { useCallback, useState } from "react";
import SearchBar from "../SearchBar";
import type { Movie } from "../../types/movie";

interface HeroSectionProps {
  onSearchResultsChange: (results: Movie[]) => any;
}

export default function HeroSection({ onSearchResultsChange }: HeroSectionProps) {
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
      onSearchResultsChange(data.results || [])
    } catch (err: any) {
      // TODO: handle this better
      console.log(err);
    }
  }, [])

  return (
    <div className="w-full h-100 relative">
      <div className="absolute top-0 left-0 w-full h-full z-0 ">
        <img src="/popcorn.jpeg" className="w-full h-full object-cover"/>
      </div>
      <div className="w-full h-100  flex flex-col justify-between bg-gradient-to-r from-black from-30% to-transparent p-6 relative z-10">
      <div>
        <h1 className="text-white text-8xl font-bebas mt-20">
          Movie Match
        </h1>
        <p className="text-zinc-200 ml-1 text-sm">
          Find the perfect movie to watch together.
        </p>
      </div>

      <div className="w-full flex justify-center">
        <SearchBar 
          onSearch={onSearch}
        />
      </div>
      </div>
    </div>
  )
}
