from fastapi import APIRouter, HTTPException
from Backend.app.core.dbconnection import connect_data_base

router = APIRouter()
db = connect_data_base()
cursor = db.cursor(dictionary=True)


@router.get("/{film_id}")
def view_film(film_id: int):
    try:
        query = """SELECT film_id, title, description, release_year,
                          rental_duration, rental_rate, length,
                          replacement_cost, rating, special_features
                   FROM film WHERE film_id = %s"""
        cursor.execute(query, (film_id,))
        film = cursor.fetchone()

        if not film:
            raise HTTPException(
                status_code=404,
                detail="Película no encontrada"
            )

        return film
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))