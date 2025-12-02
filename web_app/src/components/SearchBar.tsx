import { Search } from "lucide-react";
import { useEffect, useState } from "react";


interface SearchBarProps {
  onSearch: (query: string) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [debounced, setDebounced] = useState(query)

  // Update debounced value 1s after user stops typing
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebounced(query);
    }, 1000)

    // If user keeps typing, we react will re-render as query updates so timeout will be cleared
    return () => clearTimeout(handler);
  }, [query])

  // Trigger search when debounced value updates
  useEffect(() => {
    if (debounced.length >= 3){
      onSearch(debounced);
    }
  }, [debounced, onSearch])

  return (
    <div className="relative group w-full">
      {/* Subtle glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-red-600/10 rounded-xl blur opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
      <div className="relative w-full flex gap-4 justify-center items-center bg-white/10 backdrop-blur-sm border border-white/20 hover:border-white/30 focus-within:border-red-500/40 rounded-xl p-4 shadow-xl transition-all duration-300">
        <Search className="text-white group-focus-within:text-red-300 flex-shrink-0 transition-colors duration-300" size={20} />
        <input 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="bg-transparent border-none outline-none text-white placeholder-zinc-300 focus:placeholder-zinc-400 w-full text-lg transition-colors duration-200" 
          placeholder="Search for a movie..."
        />
        {/* Subtle typing indicator */}
        {query && (
          <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
        )}
      </div>
    </div>
  )
}
