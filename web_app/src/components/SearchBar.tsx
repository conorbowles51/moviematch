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
    <div className="w-full flex gap-4 justify-center">
      <input 
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="border px-3 py-2 rounded-sm text-zinc-50 w-full max-w-200" 
        placeholder="Search for a movie..."
      />
    </div>
  )
}
