from fastapi import APIRouter
from Backend.app.api.routes.login import router as auth_router
from Backend.app.api.routes.film import router as view_film_router
from Backend.app.api.routes.filmSearch import router as search_film_router
from Backend.app.api.routes.filmRent import router as rentals_film_router

router = APIRouter()
router.include_router(auth_router, prefix="/auth", tags=["Login"])
router.include_router(view_film_router, prefix="/films", tags=["Film"])
router.include_router(search_film_router, prefix="/films", tags=["FilmSearch"])
router.include_router(rentals_film_router, prefix="/rentals",
                      tags=["FilmRent"])