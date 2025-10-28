
import { useState } from 'react'
import HeroSection from '../components/homepage/HeroSection'
import MovieList from '../components/homepage/MovieList'
import type { Movie } from '../types/movie'
import Navbar from '../components/navbar/Navbar'

export default function HomePage() {
  const [movies, setMovies] = useState<Movie[]>([])

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
