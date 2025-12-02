import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { WandSparkles } from "lucide-react";
import UserMenu from "./UserMenu";

export default function Navbar() {
  const { user } = useAuth();

  return (
    <nav className="w-full bg-black/90 backdrop-blur-sm border-b border-zinc-800/50 text-white relative z-40">
      <div className="max-w-8xl mx-auto px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <h1 className="text-xl font-bebas tracking-wide text-red-500">
              MOVIE MATCH
            </h1>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center gap-1">
            <Link to="/" className="px-4 py-2 text-sm font-medium text-zinc-300 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200 cursor-pointer">
              Home
            </Link>
            <Link to="/library" className="px-4 py-2 text-sm font-medium text-zinc-300 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200 cursor-pointer">
              Library
            </Link>
            <Link
              to="/recommendations"
              className="group relative inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-white bg-gradient-to-r from-red-600 via-red-500 to-red-400 hover:from-red-600 hover:via-red-500 hover:to-red-500 shadow-[0_8px_24px_-8px_rgba(239,68,68,0.6)] ring-1 ring-white/10 transition-all duration-200 hover:scale-[1.03] focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400 cursor-pointer"
              aria-label="Get movie recommendations"
            >
              <span
                aria-hidden
                className="pointer-events-none absolute -inset-1 rounded-full bg-gradient-to-r from-red-500/20 via-red-500/10 to-red-400/20 blur-2xl opacity-60 group-hover:opacity-80 transition"
              />
              <WandSparkles className="w-4 h-4 animate-pulse drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
              <span className="relative z-10">Recommendations</span>
            </Link>
            {user ? (
              <UserMenu />
            ) : (
              <Link to="/login" className="px-4 py-2 text-red-600 text-sm font-medium hover:text-red-500 hover:bg-white/10 rounded-lg transition-all duration-200 cursor-pointer">
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
