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
    inventory_id: int = Field(..., gt=0, lt=16777216)  # MEDIUMINT UNSIGNED
    customer_id: int = Field(..., gt=0, lt=65536)  # SMALLINT UNSIGNED
    return_date: Optional[datetime] = None
    staff_id: int = Field(..., gt=0, lt=256)  # TINYINT UNSIGNED



class RentalCreateResponse(BaseModel):
    rental_id: int
    message: str


@router.post("/createRental/", response_model=RentalCreateResponse)
def create_rental(rental: RentalCreate):
    try:
        query = """INSERT INTO rental (rental_date, inventory_id, customer_id,
                                       return_date, staff_id)
                   VALUES (%s, %s, %s, %s, %s)"""
        cursor.execute(query, (
            rental.rental_date,
            rental.inventory_id,
            rental.customer_id,
            rental.return_date,
            rental.staff_id
        ))
        db.commit()

        return {"rental_id": cursor.lastrowid,
                "message": "Renta creada exitosamente"}

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))