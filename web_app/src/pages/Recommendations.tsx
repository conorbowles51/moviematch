import React, { useEffect, useState } from "react";
import Navbar from "../components/navbar/Navbar";
import { Search, UserPlus, X, Users, WandSparkles, Film } from "lucide-react";
import type { User } from "../types/user";
// import { useAuth } from "../context/AuthContext";
import { tmdbPosterUrl } from "../utils/tmdb";
import { useNavigate } from "react-router-dom";

type Rec = {
  id: number;
  title: string;
  overview?: string;
  poster_url: string | null;
  release_date?: string;
  vote_average?: number;
  why: string;
};

const API_URL = import.meta.env.VITE_API_URL;

export default function Recommendations() {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<User[]>([]);
  const [results, setResults] = useState<User[]>([]);
  const [searching, setSearching] = useState(false);
  const [recs, setRecs] = useState<Rec[] | null>(null);
  const [loadingRecs, setLoadingRecs] = useState(false);

  // const { user } = useAuth()

  // Debounced user search against the backend
  useEffect(() => {
    const q = query.trim();
    if (!q) {
      setResults([]);
      return;
    }

    const handle = setTimeout(async () => {
      setSearching(true);
      try {
        const res = await fetch(`${API_URL}/api/auth/search?q=${encodeURIComponent(q)}`, {
          credentials: "include",
        });
        if (!res.ok) {
          setResults([]);
          return;
        }
        const data = await res.json();
        setResults(Array.isArray(data.results) ? data.results : []);
      } catch (e) {
        setResults([]);
      } finally {
        setSearching(false);
      }
    }, 300);

    return () => clearTimeout(handle);
  }, [query]);

  const addMember = (u: User) => {
    if (!selected.some((s) => s.id === u.id)) setSelected((s) => [...s, u]);
  };
  const removeMember = (id: number) => setSelected((s) => s.filter((m) => m.id !== id));

  const generate = async () => {
    setLoadingRecs(true);
    setRecs(null);
    try {
      const res = await fetch(`${API_URL}/api/recs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ user_ids: selected.map((u) => u.id) }),
      });
      const data = await res.json().catch(() => ({ results: [] }));
      if (!res.ok) {
        setRecs([]);
      } else {
        setRecs(Array.isArray(data.results) ? data.results : []);
      }
    } catch (_) {
      setRecs([]);
    } finally {
      setLoadingRecs(false);
    }
  };

  return (
    <main className="w-full min-h-screen flex flex-col items-center bg-zinc-950 relative overflow-hidden">
      <Navbar />
      
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-20 right-20 w-96 h-96 bg-gradient-radial from-red-500/5 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-40 left-20 w-80 h-80 bg-gradient-radial from-red-600/5 to-transparent rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-red-500/3 to-red-600/3 rounded-full blur-3xl animate-spin" style={{animationDuration: '60s'}} />
      </div>

      <div className="w-full max-w-7xl mx-auto px-8 py-10 relative z-10">
        {/* Enhanced Hero Section */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-3 mb-4 px-4 py-2 rounded-full bg-gradient-to-r from-red-500/10 to-red-600/10 border border-red-500/20 backdrop-blur-sm">
            <WandSparkles className="w-5 h-5 text-red-400" />
            <span className="text-red-300 text-sm font-medium tracking-wide">AI-POWERED RECOMMENDATIONS</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-white via-red-100 to-white bg-clip-text text-transparent drop-shadow-2xl">
            Movie Night, Perfected
          </h1>
          <p className="text-zinc-300 text-lg max-w-2xl mx-auto leading-relaxed">
            Bring your friends together and let our AI find the perfect movies that everyone will love. 
            <span className="text-red-300"> No more endless scrolling.</span>
          </p>
        </div>

        <div className="grid grid-cols-1  gap-8 items-start">
          {/* Left: Group + Search */}
          <section className="bg-gradient-to-br from-zinc-900/80 to-zinc-900/40 border border-zinc-700/50 rounded-2xl p-8 backdrop-blur-sm shadow-2xl hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] transition-all duration-300 ring-1 ring-white/5">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-xl bg-gradient-to-br from-red-500/20 to-red-600/20 border border-red-500/30">
                <Users className="w-6 h-6 text-red-300" />
              </div>
              <h2 className="text-xl font-bold bg-gradient-to-r from-white to-zinc-200 bg-clip-text text-transparent">Build Your Group</h2>
            </div>

            {/* Selected members */}
            <div className="mb-6">
              {selected.length === 0 ? (
                <div className="text-center py-8 px-4 border-2 border-dashed border-zinc-700/50 rounded-xl bg-zinc-800/20">
                  <div className="text-4xl mb-3">👥</div>
                  <p className="text-zinc-400 text-sm font-medium mb-1">Your group is empty</p>
                  <p className="text-zinc-500 text-xs">Search and add friends below to get started</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-300 text-sm font-medium">Group Members ({selected.length})</span>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {selected.map((m) => (
                      <div
                        key={m.id}
                        className="group inline-flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-zinc-800/60 to-zinc-800/40 border border-zinc-700/50 hover:border-zinc-600/70 text-zinc-200 text-sm transition-all duration-200 hover:scale-105 shadow-lg"
                      >
                        <div className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-red-500/20 to-red-600/20 border border-red-500/30 text-red-300 font-semibold text-xs">
                          {m.display_name.charAt(0)}
                        </div>
                        <span className="max-w-[8rem] truncate font-medium">{m.display_name}</span>
                        <button
                          onClick={() => removeMember(m.id)}
                          className="p-1.5 rounded-lg hover:bg-zinc-700/70 text-zinc-400 hover:text-red-300 transition-colors duration-200 opacity-0 group-hover:opacity-100"
                          aria-label={`Remove ${m.display_name}`}
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Search */}
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400 group-focus-within:text-red-400 transition-colors duration-200" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search users by name or @handle..."
                className="w-full pl-12 pr-4 py-4 rounded-xl bg-black/50 border border-zinc-700/50 text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 backdrop-blur-sm transition-all duration-200 text-sm font-medium shadow-inner"
              />
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-red-500/5 to-purple-500/5 opacity-0 group-focus-within:opacity-100 transition-opacity duration-200 pointer-events-none" />
            </div>

            {/* Results */}
            {query && (
              <div className="mt-4 rounded-xl border border-zinc-700/50 overflow-hidden backdrop-blur-sm shadow-xl">
                {searching ? (
                  <div className="px-4 py-4 text-sm text-zinc-400 bg-zinc-800/40 flex items-center gap-3">
                    <div className="w-4 h-4 border-2 border-zinc-600 border-t-red-400 rounded-full animate-spin"></div>
                    Searching for users...
                  </div>
                ) : results.length === 0 ? (
                  <div className="px-4 py-6 text-center bg-zinc-800/40">
                    <div className="text-2xl mb-2">🔍</div>
                    <div className="text-sm text-zinc-400 font-medium">No users found</div>
                    <div className="text-xs text-zinc-500 mt-1">Try a different search term</div>
                  </div>
                ) : (
                  <div className="divide-y divide-zinc-700/30">
                    {results.map((u) => (
                      <div key={u.id} className="flex items-center justify-between px-4 py-3 bg-zinc-800/40 hover:bg-zinc-800/60 transition-colors duration-200 group">
                        <div className="flex items-center gap-4 min-w-0">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-red-500/20 to-red-600/20 border border-red-500/30 flex items-center justify-center text-red-300 font-semibold text-sm">
                            {u.display_name.charAt(0)}
                          </div>
                          <div className="min-w-0">
                            <div className="text-zinc-200 text-sm font-medium truncate">{u.display_name}</div>
                            <div className="text-zinc-400 text-xs truncate">{u.email}</div>
                          </div>
                        </div>
                        <button
                          onClick={() => addMember(u)}
                          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-white bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 border border-red-500/50 shadow-lg hover:shadow-red-500/25 transition-all duration-200 hover:scale-105 group-hover:scale-105"
                        >
                          <UserPlus className="w-4 h-4" /> Add
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Generate button */}
            <div className="mt-8 pt-6 border-t border-zinc-700/30">
                <button
                onClick={generate}
                className="group relative w-full inline-flex items-center justify-center gap-3 px-6 py-4 rounded-xl text-base font-bold text-white bg-gradient-to-r from-red-600 via-red-500 to-red-600 disabled:opacity-50 hover:from-red-500 hover:via-red-400 hover:to-red-500 shadow-[0_20px_40px_-12px_rgba(239,68,68,0.4)] ring-2 ring-white/10 hover:ring-white/20 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400 hover:scale-[1.02] active:scale-[0.98] overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <WandSparkles className={`w-5 h-5 ${loadingRecs ? 'animate-spin' : 'group-hover:rotate-12'} transition-transform duration-300`} />
                {loadingRecs ? "Generating Magic..." : "Generate Recommendations"}
                {!loadingRecs && <div className="w-2 h-2 rounded-full bg-white/60 animate-pulse" />}
              </button>
            </div>
          </section>

          {/* Right: Recommendations list */}
          <section className="bg-gradient-to-br from-zinc-900/80 to-zinc-900/40 border border-zinc-700/50 rounded-2xl p-8 min-h-[600px] backdrop-blur-sm shadow-2xl hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] transition-all duration-300 ring-1 ring-white/5">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-xl bg-gradient-to-br from-red-500/20 to-red-600/20 border border-red-500/30">
                <Film className="w-6 h-6 text-red-300" />
              </div>
              <h2 className="text-xl font-bold bg-gradient-to-r from-white to-zinc-200 bg-clip-text text-transparent">Your Picks</h2>
            </div>

            {!recs && !loadingRecs && (
              <div className="h-full flex flex-col items-center justify-center text-center py-20">
                <div className="relative mb-6">
                  <div className="text-8xl mb-4 animate-pulse">🎬</div>
                </div>
                <h3 className="text-xl font-bold mb-3 bg-gradient-to-r from-zinc-200 to-zinc-400 bg-clip-text text-transparent">
                  Ready for Movie Magic?
                </h3>
                <p className="text-zinc-400 text-sm max-w-md leading-relaxed">
                  Add some friends to your group and let our AI find the perfect movies that everyone will love. 
                  <span className="text-red-300 font-medium"> The more friends, the better the picks!</span>
                </p>
              </div>
            )}

            {loadingRecs && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-gradient-to-r from-red-500/10 to-red-600/10 border border-red-500/20">
                    <div className="w-5 h-5 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                    <span className="text-red-300 text-sm font-medium">AI is analyzing preferences...</span>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="group flex gap-5 p-5 rounded-xl bg-gradient-to-br from-zinc-800/60 to-zinc-800/40 border border-zinc-700/50 hover:border-zinc-600/70 shadow-lg">
                      <div className="w-28 h-44 bg-gradient-to-br from-zinc-700/70 to-zinc-800/70 rounded-lg animate-pulse shadow-inner" />
                      <div className="flex-1 space-y-4">
                        <div className="h-6 w-2/3 bg-gradient-to-r from-zinc-700/70 to-zinc-800/70 rounded-lg animate-pulse" />
                        <div className="h-4 w-1/3 bg-gradient-to-r from-zinc-700/70 to-zinc-800/70 rounded-lg animate-pulse" />
                        <div className="space-y-2">
                          <div className="h-3 w-full bg-gradient-to-r from-zinc-700/70 to-zinc-800/70 rounded animate-pulse" />
                          <div className="h-3 w-4/5 bg-gradient-to-r from-zinc-700/70 to-zinc-800/70 rounded animate-pulse" />
                          <div className="h-3 w-3/4 bg-gradient-to-r from-zinc-700/70 to-zinc-800/70 rounded animate-pulse" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {recs && !loadingRecs && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {recs.map((r) => (
                  <RecommendationCard key={r.id} movie={r} />
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}

function RecommendationCard({ movie }: { movie: Rec }) {
  const poster = tmdbPosterUrl(movie.poster_url || undefined, "w500");
  const year = movie.release_date ? movie.release_date.slice(0, 4) : undefined;
  const rating = typeof movie.vote_average === "number" ? movie.vote_average.toFixed(1) : undefined;

  const navigate = useNavigate()

  return (
    <div 
      className="group flex gap-5 rounded-2xl bg-gradient-to-br from-zinc-800/80 to-zinc-900/60 border border-zinc-700/50 p-6 hover:border-zinc-600/70 transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.4)] ring-1 ring-white/5 hover:ring-white/10 backdrop-blur-sm"
      onClick={() => {
        navigate(`/movies/${movie.id}`)
      }}  
    >
      <div className="relative overflow-hidden rounded-xl shadow-xl">
        {poster ? (
          <img 
            src={poster} 
            alt={movie.title} 
            className="w-28 h-44 object-cover group-hover:scale-110 transition-transform duration-500" 
            loading="lazy" 
          />
        ) : (
          <div className="w-28 h-44 bg-gradient-to-br from-zinc-700 to-zinc-800 rounded-xl grid place-items-center text-xs text-zinc-400 border border-zinc-600/50">
            <div className="text-center">
              <div className="text-2xl mb-1">🎬</div>
              <div>No image</div>
            </div>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
      </div>
      
      <div className="flex-1 min-w-0 space-y-3">
        <div>
          <h3 className="text-white font-bold truncate text-lg mb-1 group-hover:text-red-100 transition-colors duration-200">
            {movie.title}
          </h3>
          <div className="flex items-center gap-3 text-sm">
            {year && (
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-zinc-700/50 text-zinc-300 border border-zinc-600/30">
                📅 {year}
              </span>
            )}
            {rating && (
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-yellow-500/10 text-yellow-300 border border-yellow-500/30">
                ⭐ {rating}
              </span>
            )}
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-red-500/10 to-red-600/10 border border-red-500/20 rounded-xl px-4 py-3 backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-2">
            <WandSparkles className="w-4 h-4 text-red-400" />
            <div className="text-red-300 font-semibold text-xs tracking-wide uppercase">AI Recommendation</div>
          </div>
          <p className="text-red-100/90 leading-relaxed text-sm font-medium">{movie.why}</p>
        </div>
      </div>
    </div>
  );
}
