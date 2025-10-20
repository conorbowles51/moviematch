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
    <div className="w-full flex gap-4 justify-center items-center bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 shadow-xl">
      <Search className="text-white flex-shrink-0" size={20} />
      <input 
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="bg-transparent border-none outline-none text-white placeholder-zinc-300 w-full text-lg" 
        placeholder="Search for a movie..."
      />
    </div>
  )
}
