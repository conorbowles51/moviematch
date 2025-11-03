import React, { useEffect, useMemo, useRef, useState } from "react";
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
      const next = cards.map((node) => {
        const r = node.getBoundingClientRect();
        const cardCenter = r.left + r.width / 2;
        const dist = Math.abs(centerX - cardCenter);
        const norm = Math.min(dist / (rect.width / 2), 1); // 0 at center, 1 at far edge
        const scale = 0.85 + (1.1 - 0.85) * (1 - Math.pow(norm, 0.9));
        return Math.round(scale * 1000) / 1000;
      });
      setScales(next);
    };

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const scroller = containerRef.current;
        if (scroller) {
          const { minLeft, maxLeft } = boundsRef.current;
          if (scroller.scrollLeft < minLeft) scroller.scrollLeft = minLeft;
          else if (scroller.scrollLeft > maxLeft) scroller.scrollLeft = maxLeft;
        }
        updateScales();
      });
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

  // Center on the middle item on first render after measurements
  useEffect(() => {
    const el = containerRef.current;
    if (!el || hasCenteredRef.current || movies.length === 0) return;
    const middle = Math.floor(movies.length / 2);
    requestAnimationFrame(() => {
      const target = el.querySelector<HTMLElement>(`[data-index='${middle}']`);
      if (!target) return;
      const desired = target.offsetLeft + target.offsetWidth / 2 - el.clientWidth / 2;
      const { minLeft, maxLeft } = boundsRef.current;
      const left = Math.max(minLeft, Math.min(desired, maxLeft));
      el.scrollTo({ left, behavior: "auto" });
      hasCenteredRef.current = true;
    });
  }, [movies.length, sidePad]);



  // Scroll helpers
  const scrollByItem = (dir: -1 | 1) => {
    const el = containerRef.current;
    if (!el) return;
    const firstCard = el.querySelector<HTMLElement>("[data-index='0']");
    const step = firstCard ? firstCard.offsetWidth + 16 /* gap */ : Math.min(320, el.clientWidth * 0.6);
    const { minLeft, maxLeft } = boundsRef.current;
    const target = Math.max(minLeft, Math.min(el.scrollLeft + dir * step, maxLeft));
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
      >
        <div className="flex items-center gap-4">
          {/* Dynamic spacers to prevent left/right overscroll (no snap points) */}
          <div className="shrink-0 snap-none" style={{ width: sidePad }} aria-hidden />
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
          <div className="shrink-0 snap-none" style={{ width: sidePad }} aria-hidden />
        </div>
      </div>
    </div>
  );
}
