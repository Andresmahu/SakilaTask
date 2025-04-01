import mysql.connector
import os
from dotenv import load_dotenv



load_dotenv()


config = {
    "host": os.getenv("DB_HOST"),
    "user": os.getenv("DB_USER"),
    "password": os.getenv("DB_PASSWORD"),
    "database": os.getenv("DB_NAME"),
    "port": int(os.getenv("DB_PORT"))
}


def connect_data_base():
    try:
        # Conectarse a la RDS
        conn = mysql.connector.connect(**config)
        if conn.is_connected():
            print("✅ Conexión exitosa a la RDS MySQL")
            return conn

    except mysql.connector.Error as e:
        print(f"❌ Error en la conexión: {e}")