import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/navbar/Navbar";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      if (mode === "login") {
        await login(email, password);
      } else {
        await register(email, password, displayName);
      }
      navigate("/");
    } catch (err: any) {
      setError(err?.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="w-full min-h-screen flex flex-col items-center bg-zinc-950">
      <Navbar />

      <section className="relative w-full flex-1 flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 z-0">
          <img src="/popcorn.jpeg" className="w-full h-full object-cover" alt="Cinema background" />
          <div className="absolute inset-0 bg-black/70" />
        </div>

        {/* Card */}
        <div className="relative z-10 w-full max-w-md mx-4">
          <div className="bg-black/80 backdrop-blur-sm border border-zinc-800 rounded-2xl shadow-2xl p-8">
            <div className="mb-6 text-center">
              <h1 className="text-white text-4xl font-bebas tracking-wide">
                {mode === "login" ? "Welcome Back" : "Create Your Account"}
              </h1>
              <p className="text-zinc-300 text-sm mt-1">
                {mode === "login"
                  ? "Sign in to continue your movie journey"
                  : "Join Movie Match and start building your library"}
              </p>
            </div>

            {error && (
              <div className="mb-4 rounded-md border border-red-800 bg-red-950/40 text-red-300 px-4 py-2 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === "register" && (
                <div>
                  <label className="block text-sm text-zinc-300 mb-1">Display Name</label>
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="e.g. Alex"
                    className="w-full px-4 py-3 rounded-lg bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-500 focus:outline-none focus:border-red-500"
                    autoComplete="name"
                  />
                </div>
              )}
              <div>
                <label className="block text-sm text-zinc-300 mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 rounded-lg bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-500 focus:outline-none focus:border-red-500"
                  autoComplete="email"
                />
              </div>
              <div>
                <label className="block text-sm text-zinc-300 mb-1">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-lg bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-500 focus:outline-none focus:border-red-500"
                  autoComplete={mode === "login" ? "current-password" : "new-password"}
                />
              </div>

              <button
                type="submit"
                disabled={submitting || !email || !password || (mode === "register" && !displayName)}
                className="w-full py-3 rounded-lg bg-red-600 hover:bg-red-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold tracking-wide transition-colors"
              >
                {submitting ? (mode === "login" ? "Signing in..." : "Creating account...") : (mode === "login" ? "Sign In" : "Create Account")}
              </button>
            </form>

            <div className="mt-6 text-center text-sm text-zinc-300">
              {mode === "login" ? (
                <span>
                  Don&apos;t have an account?{" "}
                  <button
                    className="text-red-400 hover:text-red-300 font-semibold"
                    onClick={() => {
                      setMode("register");
                      setError(null);
                    }}
                    type="button"
                  >
                    Create one
                  </button>
                </span>
              ) : (
                <span>
                  Already have an account?{" "}
                  <button
                    className="text-red-400 hover:text-red-300 font-semibold"
                    onClick={() => {
                      setMode("login");
                      setError(null);
                    }}
                    type="button"
                  >
                    Sign in
                  </button>
                </span>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
