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
      const res = await fetch(`http://localhost:5000/api/movies/search?q=${encodeURIComponent(q)}`)
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
    <div className="w-full min-h-[600px] relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute top-0 left-0 w-full h-full z-0">
        <img 
          src="/popcorn.jpeg" 
          className="w-full h-full object-cover"
          alt="Cinema background"
        />
        <div className="absolute inset-0 bg-black/20" />
      </div>
      
      {/* Main Content */}
      <div className="w-full min-h-[600px] flex flex-col bg-gradient-to-r from-black/90 from-40% via-black/60 via-70% to-transparent p-8 relative z-10">
        {/* Hero Text Section */}
        <div className="flex-1 flex flex-col justify-center max-w-4xl pt-16 pb-8">
          <div className="space-y-6">
            <h1 className="text-white text-6xl md:text-7xl lg:text-8xl font-bebas leading-none tracking-wide drop-shadow-2xl">
              <span className="block text-red-500 text-4xl md:text-5xl lg:text-6xl font-normal mb-2 tracking-wider">
                WELCOME TO
              </span>
              Movie Match
            </h1>
            <p className="text-zinc-200 text-base md:text-lg max-w-2xl leading-relaxed drop-shadow-lg">
              Discover your next favorite film. Search thousands of movies, 
              build your personal library, and find the perfect movie to watch together.
            </p>
            
          </div>
        </div>

        {/* Search Section */}
        <div className="w-full flex justify-center pb-8">
          <div className="w-full max-w-2xl">
            <div className="text-center mb-4">
              <h2 className="text-white text-lg font-semibold mb-1 drop-shadow-lg">
                Start Your Movie Journey
              </h2>
              <p className="text-zinc-300 text-sm">
                Search for any movie to begin building your collection
              </p>
            </div>
            <SearchBar onSearch={onSearch} />
          </div>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black/50 to-transparent z-5 pointer-events-none" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-radial from-red-500/10 to-transparent rounded-full blur-3xl z-5 pointer-events-none" />
    </div>
  )
}
