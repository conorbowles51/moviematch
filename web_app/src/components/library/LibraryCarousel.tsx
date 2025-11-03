import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import type { Movie } from "../../types/movie";
import LibraryItemCard from "./LibraryItemCard";

interface LibraryCarouselProps {
  movies: Movie[];
  onRemove: (movieId: number) => void;
}

export default function LibraryCarousel({ movies, onRemove }: LibraryCarouselProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [scales, setScales] = useState<number[]>(() => movies.map(() => 1));
  const hasCenteredRef = useRef(false);
  const [sidePad, setSidePad] = useState(0);
  const boundsRef = useRef<{ minLeft: number; maxLeft: number }>({ minLeft: 0, maxLeft: 0 });
  const [centerIndex, setCenterIndex] = useState(0);
  const [detailsCache, setDetailsCache] = useState<Record<number, { overview?: string; genres?: string[]; vote_average?: number; runtime?: number }>>({});
  const API_URL = (import.meta as any).env.VITE_API_URL as string | undefined;

  // Update scale of each card based on distance to center
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let raf = 0;
    const updateScales = () => {
      if (!containerRef.current) return;
      const container = containerRef.current;
      const rect = container.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const cards = Array.from(container.querySelectorAll<HTMLElement>("[data-index]"));
      const distances: number[] = [];
      const next = cards.map((node, idx) => {
        const r = node.getBoundingClientRect();
        const cardCenter = r.left + r.width / 2;
        const dist = Math.abs(centerX - cardCenter);
        distances[idx] = dist;
        const norm = Math.min(dist / (rect.width / 2), 1); // 0 at center, 1 at far edge
        const scale = 0.85 + (1.1 - 0.85) * (1 - Math.pow(norm, 0.9));
        return Math.round(scale * 1000) / 1000;
      });
      setScales(next);
      // Pick the closest card to center
      if (distances.length) {
        let minI = 0;
        let minV = distances[0];
        for (let i = 1; i < distances.length; i++) if (distances[i] < minV) { minV = distances[i]; minI = i; }
        setCenterIndex(minI);
      }
    };

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(updateScales);
    };

    const onResize = () => updateScales();
    el.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    // Initial
    updateScales();
    return () => {
      el.removeEventListener("scroll", onScroll as any);
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(raf);
    };
  }, [movies.length]);

  // Preload details for the centered movie so we can show overview/genres
  useEffect(() => {
    const movie = movies[centerIndex];
    if (!movie || !API_URL) return;
    if (detailsCache[movie.id]) return; // cached
    (async () => {
      try {
        const res = await fetch(`${API_URL}/api/movies/${movie.id}`);
        const data = await res.json();
        if (!res.ok) return;
        setDetailsCache((prev) => ({
          ...prev,
          [movie.id]: {
            overview: data?.overview,
            genres: data?.genres,
            vote_average: data?.vote_average,
            runtime: data?.runtime,
          },
        }));
      } catch {}
    })();
  }, [centerIndex, movies, API_URL, detailsCache]);

  // Measure dynamic side padding so first/last items can be centered without overscrolling
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const measure = () => {
      const first = el.querySelector<HTMLElement>("[data-index='0']");
      const last = el.querySelector<HTMLElement>(`[data-index='${movies.length - 1}']`);
      if (!first) return;
      const cardWidth = first.offsetWidth; // transform doesn't affect layout
      const pad = Math.max(0, (el.clientWidth - cardWidth) / 2);
      setSidePad(pad);

      // Compute scroll bounds where first/last are centered
      const firstCenter = first.offsetLeft + cardWidth / 2;
      const desiredFirst = firstCenter - el.clientWidth / 2;
      let desiredLast = desiredFirst;
      if (last) {
        const lastWidth = last.offsetWidth || cardWidth;
        const lastCenter = last.offsetLeft + lastWidth / 2;
        desiredLast = lastCenter - el.clientWidth / 2;
      }
      const maxScroll = Math.max(0, el.scrollWidth - el.clientWidth);
      const minLeft = Math.max(0, Math.min(desiredFirst, maxScroll));
      const maxLeft = Math.max(minLeft, Math.min(desiredLast, maxScroll));
      boundsRef.current = { minLeft, maxLeft };
    };

    measure();
    const onResize = () => measure();
    window.addEventListener("resize", onResize);
    // Some environments benefit from a raf after mount
    requestAnimationFrame(measure);
    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, [movies.length]);

  // Scroll helpers
  const scrollByItem = (dir: -1 | 1) => {
    const el = containerRef.current;
    if (!el) return;
    const firstCard = el.querySelector<HTMLElement>("[data-index='0']");
    const step = firstCard ? firstCard.offsetWidth + 16 /* gap */ : Math.min(320, el.clientWidth * 0.6);
    const { minLeft, maxLeft } = boundsRef.current;
    const fallbackMax = Math.max(0, el.scrollWidth - el.clientWidth);
    const upper = maxLeft || fallbackMax;
    const target = Math.max(minLeft, Math.min(el.scrollLeft + dir * step, upper));
    el.scrollTo({ left: target, behavior: "smooth" });
  };

  return (
    <div className="relative">
      {/* Edge gradients to hint overflow */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-zinc-950 to-transparent z-10" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-zinc-950 to-transparent z-10" />

      {/* Arrows */}
      <button
        type="button"
        onClick={() => scrollByItem(-1)}
        className="hidden md:flex absolute left-2 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full items-center justify-center text-white/90 bg-black/60 border border-white/10 hover:bg-black/70 transition"
        aria-label="Scroll left"
      >
        ‹
      </button>
      <button
        type="button"
        onClick={() => scrollByItem(1)}
        className="hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full items-center justify-center text-white/90 bg-black/60 border border-white/10 hover:bg-black/70 transition"
        aria-label="Scroll right"
      >
        ›
      </button>

      <div
        ref={containerRef}
        className="relative overflow-x-auto snap-x snap-mandatory px-8 py-4 no-scrollbar"
        style={{ scrollPaddingLeft: sidePad, scrollPaddingRight: sidePad }}
      >
        <div className="flex items-center gap-4">
          {movies.map((movie, i) => (
            <div
              key={movie.id}
              data-index={i}
              className="shrink-0 snap-center transition-transform duration-150 ease-out"
              style={{ transform: `scale(${scales[i] ?? 0.9})` }}
            >
              <LibraryItemCard movie={movie} onRemove={onRemove} className="w-48 md:w-56" />
            </div>
          ))}
        </div>
      </div>

      {/* Details panel for centered movie */}
      {movies[centerIndex] && (
        <div className="mt-6 px-8">
          <div className="mx-auto max-w-3xl rounded-xl border border-white/10 bg-black/40 p-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="text-white text-lg font-semibold">{movies[centerIndex].title}</div>
                <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px]">
                  {movies[centerIndex].release_date?.slice(0,4) && (
                    <span className="px-2 py-0.5 rounded-full bg-black/70 text-white/80 border border-white/10">
                      {movies[centerIndex].release_date!.slice(0,4)}
                    </span>
                  )}
                  {detailsCache[movies[centerIndex].id]?.runtime ? (
                    <span className="px-2 py-0.5 rounded-full bg-black/70 text-white/80 border border-white/10">
                      {Math.floor((detailsCache[movies[centerIndex].id]!.runtime as number)/60)}h {(detailsCache[movies[centerIndex].id]!.runtime as number)%60}m
                    </span>
                  ) : null}
                  {!!detailsCache[movies[centerIndex].id]?.genres?.length && (
                    <span className="px-2 py-0.5 rounded-full bg-black/70 text-white/80 border border-white/10">
                      {detailsCache[movies[centerIndex].id]!.genres!.slice(0,3).join(" • ")}
                    </span>
                  )}
                  {(detailsCache[movies[centerIndex].id]?.vote_average ?? movies[centerIndex].vote_average) && (
                    <span className="px-2 py-0.5 rounded-full bg-black/70 text-white/80 border border-white/10">
                      ★ {((detailsCache[movies[centerIndex].id]?.vote_average ?? movies[centerIndex].vote_average) as number).toFixed(1)}
                    </span>
                  )}
                </div>
                {detailsCache[movies[centerIndex].id]?.overview && (
                  <p className="mt-2 text-sm overflow-ellipsis line-clamp-1 text-zinc-300">
                    {detailsCache[movies[centerIndex].id]!.overview}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2 self-start sm:self-auto">
                <Link
                  to={`/movies/${movies[centerIndex].id}`}
                  className="px-3 py-1.5 rounded-md min-w-32 text-center bg-zinc-800 text-white text-sm border border-white/10 hover:bg-zinc-700 transition"
                >
                  View Details
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
