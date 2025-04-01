from fastapi import APIRouter, HTTPException
from Backend.app.core.dbconnection import connect_data_base
from pydantic import BaseModel

router = APIRouter()
db = connect_data_base()
cursor = db.cursor(dictionary=True)


class LoginReq(BaseModel):
    email: str
    customer_id: int

@router.post("/login")
def login(user: LoginReq):
    try:
        query = """SELECT * FROM customer WHERE email = %s
                   AND customer_id = %s"""
        cursor.execute(query, (user.email, user.customer_id))
        result = cursor.fetchone()

        if result:
            return result
        else:
            raise HTTPException(
                status_code=401,
                detail="Credenciales incorrectas"
            )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))