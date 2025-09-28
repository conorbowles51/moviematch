import { useState } from "react";


interface SearchBarProps {
  onSearch: (query: string) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [debounced, setDebounced] = useState(query)

  return (
    <div className="w-full flex gap-4 justify-center">
      <input 
        className="border px-3 py-2 rounded-sm text-zinc-50 w-full max-w-200" 
        placeholder="Search for a movie..."
      />
    </div>
  )
}
