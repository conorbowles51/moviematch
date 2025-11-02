// src/utils/tmdb.ts
export const tmdbPosterUrl = (path?: string, size: "w185"|"w342"|"w500" = "w342") =>
  path ? `https://image.tmdb.org/t/p/${size}${path}` : undefined;
