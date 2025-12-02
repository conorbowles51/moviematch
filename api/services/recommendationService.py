from typing import List, Dict
from models.user import User
from models.library_item import LibraryItem

from services.tmdb import search_movies

def join_user_libraries(user_ids: list[int]) -> Dict[str, List[LibraryItem]]:
    if not user_ids:
        return {}
    
    try:
        users = User.query.filter(User.id.in_(user_ids)).all()
        id_to_name = {u.id: u.display_name for u in users}

        items = LibraryItem.query.filter(LibraryItem.user_id.in_(user_ids)).all()

        group_lib = {
            str(uid): {"name": id_to_name.get(uid), "library": []}
            for uid in user_ids
        }

        for item in items:
            group_lib[str(item.user_id)]["library"].append({
                "name": item.title,
                "date": item.release_date,
                "genre": None # TODO
            })

        return group_lib
    except Exception as e:
        print(f"Exception in join_user_libraries: {e}")
        import traceback
        traceback.print_exc()
        raise