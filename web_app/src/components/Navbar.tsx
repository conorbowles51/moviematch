import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();

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
            <Link to="/" className="px-4 py-2 text-sm font-medium text-white hover:text-red-400 hover:bg-white/10 rounded-lg transition-all duration-200 cursor-pointer">
              Home
            </Link>
            <Link to="/library" className="px-4 py-2 text-sm font-medium text-zinc-300 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200 cursor-pointer">
              Library
            </Link>
            <Link to="/groups" className="px-4 py-2 text-sm font-medium text-zinc-300 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200 cursor-pointer">
              Groups
            </Link>
            {user ? (
              <>
                <span className="ml-8">{user.display_name}</span>
                <button onClick={logout} className="px-4 py-2 text-sm font-medium text-zinc-300 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200 cursor-pointer">
                  Logout
                </button>
              </>
            ) : (
              <Link to="/login" className="px-4 py-2 text-red-600 text-sm font-mediu hover:text-red-500 font-bold hover:bg-white/10 rounded-lg transition-all duration-200 cursor-pointer">
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
