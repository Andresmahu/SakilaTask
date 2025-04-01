from fastapi import APIRouter, HTTPException
from Backend.app.core.dbconnection import connect_data_base
from pydantic import BaseModel

router = APIRouter()
db = connect_data_base()
cursor = db.cursor(dictionary=True)



class FilmSearch(BaseModel):
    search_req: str


@router.post("/filmSearch")
def search_film(search_req: FilmSearch):
    try:
        query = """SELECT film_id, title, description, release_year,
                          rental_duration, rental_rate, length,
                          replacement_cost, rating, special_features
                   FROM film
                   WHERE title LIKE %(search1)s OR title LIKE %(search2)s
                   OR title LIKE %(search3)s;"""

        cursor.execute(query, {"search1": search_req.search_req + " %",
                               "search2": "% " + search_req.search_req + " %",
                               "search3": "% " + search_req.search_req})
        films = cursor.fetchall()

        if not films:
            raise HTTPException(
                status_code=404,
                detail="No se encontró ninguna película con esta búsqueda"
            )

        return films
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))