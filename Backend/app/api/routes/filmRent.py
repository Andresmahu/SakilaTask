print("<<<<< ¡CARGANDO filmRent.py VERSIÓN ACTUALIZADA! >>>>>")
from fastapi import APIRouter, HTTPException
from Backend.app.core.dbconnection import connect_data_base
from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

router = APIRouter()
db = connect_data_base()
cursor = db.cursor(dictionary=True)


class RentalCreate(BaseModel):
    rental_date: datetime
    customer_id: int = Field(..., gt=0, lt=65536)  # SMALLINT UNSIGNED
    return_date: Optional[datetime] = None
    staff_id: int = Field(..., gt=0, lt=256)  # TINYINT UNSIGNED
    film_id: int = Field(..., gt=0, lt=65536)
    store_id: int = Field(..., gt=0, lt=3)
print(f">>>>> Modelo RentalCreate en filmRent.py definido con campos: {RentalCreate.model_fields.keys()}") # <-- AÑADE ESTA LÍNEA

class RentalCreateResponse(BaseModel):
    rental_id: int
    inventory_id: int
    message: str


@router.post("/createRental/", response_model=RentalCreateResponse)
def create_rental(rental: RentalCreate):
    try:
        # 1. Verificar disponibilidad
        availability_query = """
            SELECT i.inventory_id
            FROM inventory i
            LEFT JOIN rental r ON i.inventory_id = r.inventory_id AND r.return_date IS NULL
            WHERE i.film_id = %s AND i.store_id = %s AND r.rental_id IS NULL
            LIMIT 1;
        """
        cursor.execute(availability_query, (rental.film_id, rental.store_id))
        result = cursor.fetchone()

        if not result:
            raise HTTPException(status_code=404, detail="La película no está disponible en esta tienda.")

        available_inventory_id = result["inventory_id"]

        # 2. Crear la renta
        insert_query = """
            INSERT INTO rental (rental_date, inventory_id, customer_id, return_date, staff_id)
            VALUES (%s, %s, %s, %s, %s)
        """
        cursor.execute(insert_query, (
            rental.rental_date,
            available_inventory_id,
            rental.customer_id,
            rental.return_date,
            rental.staff_id
        ))
        db.commit()

        return {"rental_id": cursor.lastrowid,"inventory_id": available_inventory_id, "message": "Renta creada exitosamente"}

    except HTTPException as http_err:
        raise http_err
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
