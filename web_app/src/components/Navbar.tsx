export default function Navbar() {
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
            <a className="px-4 py-2 text-sm font-medium text-white hover:text-red-400 hover:bg-white/10 rounded-lg transition-all duration-200 cursor-pointer">
              Home
            </a>
            <a className="px-4 py-2 text-sm font-medium text-zinc-300 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200 cursor-pointer">
              Library
            </a>
            <a className="px-4 py-2 text-sm font-medium text-zinc-300 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200 cursor-pointer">
              My Account
            </a>
          </div>
        </div>
      </div>
    </nav>
  )
}
