
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
    <main className="w-full min-h-screen flex flex-col items-center bg-zinc-950">
      <Navbar />
      <HeroSection 
        onSearchResultsChange={(results) => {setMovies(results); console.log("TEST")}}
      />
      <MovieList movies={movies}/>     
    </main>
  )
}
