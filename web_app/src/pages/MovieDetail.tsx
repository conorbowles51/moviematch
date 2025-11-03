import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { tmdbBackdropUrl, tmdbPosterUrl } from "../utils/tmdb";
import Navbar from "../components/navbar/Navbar";

const API_URL = import.meta.env.VITE_API_URL;

type MovieDetails = {
  id: number;
  title: string;
  tagline?: string;
  overview?: string;
  poster_url?: string;
  backdrop_url?: string;
  release_date?: string;
  vote_average?: number;
  runtime?: number;
  genres?: string[];
  homepage?: string;
  cast?: { id: number; name: string; character?: string; profile_path?: string }[];
  videos?: { id: string; key?: string; name?: string; site?: string; type?: string }[];
};

export default function MovieDetail() {
  const { movieId } = useParams();
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function run() {
      if (!movieId) return;
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_URL}/api/movies/${movieId}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || "Failed to load movie");
        if (!cancelled) setMovie(data);
      } catch (e: any) {
        if (!cancelled) setError(e?.message || "Failed to load movie");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    run();
    return () => {
      cancelled = true;
    };
  }, [movieId]);

  const year = useMemo(() => movie?.release_date?.slice(0, 4), [movie?.release_date]);
  const rating = useMemo(() => (typeof movie?.vote_average === "number" ? movie!.vote_average.toFixed(1) : undefined), [movie?.vote_average]);
  const backdrop = tmdbBackdropUrl(movie?.backdrop_url, "original");
  const poster = tmdbPosterUrl(movie?.poster_url, "w500");
  const trailer = useMemo(() => movie?.videos?.find(v => v.site === "YouTube" && (v.type === "Trailer" || v.type === "Teaser") && v.key)?.key, [movie?.videos]);

  if (loading) {
    return (
      <main className="w-full min-h-screen flex flex-col items-center justify-between bg-zinc-950 text-zinc-400">
        <Navbar />
        <div className="py-24">Loading…</div>
      </main>
    );
  }
  if (error || !movie) {
    return (
      <main className="w-full min-h-screen flex flex-col items-center bg-zinc-950">
        <Navbar />
        <div className="w-full max-w-5xl mx-auto px-8 py-24">
          <div className="text-center">
            <div className="text-zinc-200 text-xl font-semibold mb-2">Couldn’t load movie</div>
            <div className="text-zinc-500 text-sm">{error || "Please try again later."}</div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="w-full min-h-screen flex flex-col items-center bg-zinc-950">
      <Navbar />

      {/* Hero with Backdrop */}
      <section className="relative w-full overflow-hidden">
        <div className="relative h-[42vh] min-h-[280px] w-full">
          {backdrop ? (
            <img src={backdrop} alt="Backdrop" className="absolute inset-0 w-full h-full object-cover" />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 to-zinc-800" />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/90 via-zinc-950/30 to-zinc-950" />
        </div>

        {/* Content inside the hero container (lifted to overlap banner) */}
        <div className="relative -mt-20 md:-mt-28 lg:-mt-32 z-10">
          <div className="mx-auto max-w-6xl px-8 pb-8 md:pb-12">
            <div className="grid grid-cols-1 md:grid-cols-[auto,1fr] gap-8 items-start">
              {/* Poster */}
              <div className="w-44 sm:w-52 md:w-60 mx-auto md:mx-0">
                <div className="rounded-xl overflow-hidden border border-white/10 shadow-2xl">
                  {poster ? (
                    <img src={poster} alt={movie.title} className="w-full h-[22rem] object-cover" />
                  ) : (
                    <div className="w-full h-[22rem] grid place-items-center bg-zinc-800 text-zinc-400">No image</div>
                  )}
                </div>
              </div>

              {/* Details */}
              <div>
                <h1 className="text-white text-3xl sm:text-4xl font-bold mb-2">{movie.title}</h1>
                <div className="flex flex-wrap items-center gap-2 mb-4 text-xs">
                  {year && <span className="px-2 py-0.5 rounded-full bg-black/70 text-white/90 border border-white/10">{year}</span>}
                  {movie.runtime ? (
                    <span className="px-2 py-0.5 rounded-full bg-black/70 text-white/90 border border-white/10">{Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m</span>
                  ) : null}
                  {!!movie.genres?.length && (
                    <span className="px-2 py-0.5 rounded-full bg-black/70 text-white/90 border border-white/10">{movie.genres.join(" • ")}</span>
                  )}
                  {rating && <span className="px-2 py-0.5 rounded-full bg-black/70 text-white/90 border border-white/10">★ {rating}</span>}
                </div>
                {movie.tagline && (
                  <p className="text-zinc-300 italic mb-3">“{movie.tagline}”</p>
                )}
                {movie.overview && (
                  <p className="text-zinc-300/90 leading-relaxed max-w-3xl">{movie.overview}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trailer */}
      {trailer && (
        <section className="w-full">
          <div className="mx-auto max-w-5xl px-8 mt-6">
            <div className="rounded-xl overflow-hidden border border-white/10 bg-black/40 shadow-xl">
              <iframe
                className="w-full aspect-video"
                src={`https://www.youtube.com/embed/${trailer}`}
                title="Trailer"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          </div>
        </section>
      )}

      {/* Cast */}
      {!!movie.cast?.length && (
        <section className="w-full">
          <div className="mx-auto max-w-6xl px-8 mt-10 mb-16 w-full">
            <h3 className="text-white font-semibold mb-3">Top Billed Cast</h3>
            <div className="overflow-x-auto no-scrollbar">
              <div className="flex gap-4">
                {movie.cast!.map((c) => (
                  <div key={c.id} className="w-28 shrink-0">
                    <div className="rounded-lg overflow-hidden border border-white/10 bg-zinc-900">
                      {c.profile_path ? (
                        <img
                          className="w-full h-36 object-cover"
                          src={tmdbPosterUrl(c.profile_path, "w342")}
                          alt={c.name}
                        />
                      ) : (
                        <div className="w-full h-36 grid place-items-center text-zinc-500">—</div>
                      )}
                    </div>
                    <div className="mt-2 text-xs">
                      <div className="text-white truncate" title={c.name}>{c.name}</div>
                      {c.character && (
                        <div className="text-zinc-400 truncate" title={c.character}>{c.character}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
