import { useCallback, useState } from "react";
import SearchBar from "../SearchBar";
import type { Movie } from "../../types/movie";

interface HeroSectionProps {
  onSearchResultsChange: (results: Movie[]) => any;
}

export default function HeroSection({ onSearchResultsChange }: HeroSectionProps) {
  const [_results, setResults] = useState<Movie[]>([])
  

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
      {/* Enhanced Background Image */}
      <div className="absolute top-0 left-0 w-full h-full z-0">
        <img 
          src="/popcorn.jpeg" 
          className="w-full h-full object-cover"
          alt="Cinema background"
        />
        {/* Enhanced overlays with stronger gradients */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-black/20 to-red-900/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-red-900/10 via-transparent to-red-800/15" />
      </div>
      
      {/* Enhanced Main Content with stronger gradients */}
      <div className="w-full min-h-[600px] flex flex-col bg-gradient-to-r from-black/95 from-35% via-black/75 via-65% to-red-950/20 p-8 relative z-10">
        {/* Hero Text Section */}
        <div className="flex-1 flex flex-col justify-center max-w-4xl pt-16 pb-8">
          <div className="space-y-6">
            <h1 className="text-white text-6xl md:text-7xl lg:text-8xl font-bebas leading-none tracking-wide drop-shadow-2xl">
              <span className="block text-red-500 hover:text-red-400 text-4xl md:text-5xl lg:text-6xl font-normal mb-2 tracking-wider transition-colors duration-300">
                WELCOME TO
              </span>
              <span className="bg-gradient-to-r from-white via-zinc-100 to-white bg-clip-text text-transparent">
                Movie Match
              </span>
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
      
      {/* Enhanced decorative elements with stronger effects */}
      <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-black/70 via-black/30 to-transparent z-5 pointer-events-none" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-radial from-red-500/20 via-red-600/10 to-transparent rounded-full blur-3xl z-5 pointer-events-none animate-pulse" />
      <div className="absolute bottom-20 left-10 w-80 h-80 bg-gradient-radial from-red-400/15 to-transparent rounded-full blur-2xl z-5 pointer-events-none" />
      {/* Additional floating elements */}
      <div className="absolute top-1/4 right-1/4 w-6 h-6 bg-red-500/20 rounded-full animate-ping" style={{animationDelay: '1s'}} />
      <div className="absolute bottom-1/3 left-1/5 w-4 h-4 bg-red-400/25 rounded-full animate-pulse" style={{animationDelay: '2s'}} />
    </div>
  )
}
