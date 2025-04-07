from fastapi import APIRouter, HTTPException
from Backend.app.core.dbconnection import connect_data_base
from pydantic import BaseModel
import logging # Es buena idea añadir logging

# Configura el logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter()


try:
    db = connect_data_base()
    cursor = db.cursor(dictionary=True, buffered=True)
    logger.info("Conexión a base de datos establecida.")
except Exception as e:
    logger.error(f"Error al conectar a la base de datos: {e}")
    db = None
    cursor = None



class FilmSearch(BaseModel):
    search_req: str
    store_id: int # Añade el ID de la tienda

@router.post("/filmSearch")
def search_film(search_data: FilmSearch):
    # Verifica si la conexión a la BD falló al inicio
    if not db or not cursor:
        raise HTTPException(status_code=503, detail="Error de conexión con la base de datos.")

    try:

        query = """
            SELECT DISTINCT
                f.film_id,
                f.title,
                f.description,
                f.release_year,
                f.rental_duration,
                f.rental_rate,
                f.length,
                f.replacement_cost,
                f.rating,
                f.special_features
            FROM film f
            JOIN inventory i ON f.film_id = i.film_id
            WHERE
                i.store_id = %(store_id)s
                AND (
                    f.title LIKE %(search_starts)s
                    OR f.title LIKE %(search_contains)s
                )
            ORDER BY f.title;
        """

        # Prepara los parámetros para la consulta
        params = {
            "store_id": search_data.store_id,
            "search_starts": search_data.search_req + "%",       # Películas que empiezan con el término
            "search_contains": "%" + search_data.search_req + "%" # Películas que contienen el término
        }

        logger.info(f"Ejecutando búsqueda con parámetros: {params}")
        cursor.execute(query, params)
        films = cursor.fetchall()
        logger.info(f"Películas encontradas: {len(films)}")

        # Verifica si se encontraron películas EN ESA TIENDA con ese título
        if not films:
            # Modifica el mensaje de error para ser más específico
            raise HTTPException(
                status_code=404,
                detail=f"No se encontró ninguna película que coincida con '{search_data.search_req}' en la tienda ID {search_data.store_id}."
            )

        # Si se encuentran, retorna la lista
        return films

    except Exception as e:
        # Loguea el error para depuración en el servidor
        logger.error(f"Error durante la búsqueda de películas: {e}", exc_info=True) # exc_info=True añade el traceback
        # Devuelve un error genérico al cliente
        raise HTTPException(status_code=500, detail=f"Ocurrió un error interno al buscar las películas: {e}")

