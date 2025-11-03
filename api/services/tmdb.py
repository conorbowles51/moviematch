import os 
import requests

def search_movies(query: str, page: int = 1):
    TMDB_BASE_URL = os.getenv("TMDB_BASE_URL")
    TMDB_API_KEY = os.getenv("TMDB_API_KEY")

    if not TMDB_API_KEY:
        raise RuntimeError("TMDB API Key is not set in the environment")
    
    url = f"{TMDB_BASE_URL}/search/movie"
    headers = { "Authorization": f"Bearer {TMDB_API_KEY}" }
    params = { "query": query, "page": page }

    resp = requests.get(url, headers=headers, params=params)
    resp.raise_for_status()
    return resp.json()

def get_popular_movies(page: int = 1):
    TMDB_BASE_URL = os.getenv("TMDB_BASE_URL")
    TMDB_API_KEY = os.getenv("TMDB_API_KEY")

    if not TMDB_API_KEY:
        raise RuntimeError("TMDB API Key is not set in the environment")
    
    url = f"{TMDB_BASE_URL}/movie/popular"
    headers = { "Authorization": f"Bearer {TMDB_API_KEY}" }
    params = { "page": page }

    resp = requests.get(url, headers=headers, params=params)
    resp.raise_for_status()
    return resp.json()

def get_movie_details(movie_id: int):
    TMDB_BASE_URL = os.getenv("TMDB_BASE_URL")
    TMDB_API_KEY = os.getenv("TMDB_API_KEY")

    if not TMDB_API_KEY:
        raise RuntimeError("TMDB API Key is not set in the environment")

    url = f"{TMDB_BASE_URL}/movie/{movie_id}"
    headers = { "Authorization": f"Bearer {TMDB_API_KEY}" }
    params = {
        "append_to_response": "credits,videos,images,release_dates",
        "include_image_language": "en,null"
    }

    resp = requests.get(url, headers=headers, params=params)
    resp.raise_for_status()
    return resp.json()
