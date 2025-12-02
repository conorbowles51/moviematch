
import { useEffect, useState } from 'react'
import HeroSection from '../components/homepage/HeroSection'
import MovieList from '../components/homepage/MovieList'
import type { Movie } from '../types/movie'
import Navbar from '../components/navbar/Navbar'

const API_URL = import.meta.env.VITE_API_URL;

export default function HomePage() {
  const [movies, setMovies] = useState<Movie[]>([])

  const fetchPopularMovies = async () => {
    try {
      const res = await fetch(`${API_URL}/api/movies/popular`, {
        credentials: "include"
      });

      if(!res.ok) {
        console.warn("Failed to fetch popular movies: ", res.status);
        return;
      }

      const data = await res.json();
      setMovies(data.results || [])
    } catch (err) {
      console.log("Error fetching popular movies: ", err)
    }
  }

  useEffect(() => {
    fetchPopularMovies()
  }, [])

  return (
    <main className="w-full min-h-screen flex flex-col items-center bg-zinc-950 relative overflow-hidden">
      <Navbar />
      
      {/* Enhanced background decorative elements with stronger visibility */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
        <div className="absolute top-10 right-10 w-[600px] h-[600px] bg-gradient-radial from-red-500/25 via-red-600/15 to-transparent rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-10 left-10 w-[500px] h-[500px] bg-gradient-radial from-red-600/20 via-red-500/12 to-transparent rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-br from-red-500/15 via-transparent to-red-600/15 rounded-full blur-3xl animate-spin" style={{animationDuration: '40s'}} />
        <div className="absolute top-1/4 right-1/3 w-[400px] h-[400px] bg-gradient-radial from-red-400/18 via-red-500/8 to-transparent rounded-full blur-2xl animate-pulse" style={{animationDelay: '2s'}} />
        <div className="absolute bottom-1/4 left-1/4 w-[350px] h-[350px] bg-gradient-radial from-red-300/15 to-transparent rounded-full blur-2xl animate-pulse" style={{animationDelay: '4s'}} />
      
      </div>
      
      <div className="relative z-10 w-full">
        <HeroSection 
          onSearchResultsChange={(results) => {setMovies(results); console.log("TEST")}}
        />
        {/* Additional background effects visible below hero */}
        <div className="absolute top-[600px] left-0 w-full h-full pointer-events-none">
          <div className="absolute top-20 right-1/4 w-[300px] h-[300px] bg-gradient-radial from-red-500/20 to-transparent rounded-full blur-2xl animate-pulse" style={{animationDelay: '1.5s'}} />
          <div className="absolute top-60 left-1/6 w-[250px] h-[250px] bg-gradient-radial from-red-400/15 to-transparent rounded-full blur-2xl animate-pulse" style={{animationDelay: '3.5s'}} />
        </div>
        <MovieList movies={movies}/>
      </div>     
    </main>
  )
}
