
import { useState } from 'react'
import HeroSection from './HeroSection'
import MovieList from './MovieList'
import type { Movie } from '../../types/movie'
import Navbar from '../Navbar'

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
