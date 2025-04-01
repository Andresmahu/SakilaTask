from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from Backend.app.api.router import router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Orígenes permitidos
    allow_credentials=True,  # Permitir credenciales (cookies, autenticación)
    allow_methods=["*"],  # Permitir todos los métodos HTTP
    allow_headers=["*"],  # Permitir todos los headers
)

app.include_router(router)