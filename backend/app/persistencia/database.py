import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Se carga las variables del archivo .env
load_dotenv()

# Obtenemos la direccion de conexion a PostgreSQL
DATABASE_URL = os.getenv("DATABASE_URL")

# Comprobamos que se haya configurado la conexion
if not DATABASE_URL:
    raise ValueError("No se ha definido DATABASE_URL en el archivo .env")

# crea el motor de conexion a PostgreSQL
engine = create_engine(DATABASE_URL)

# Crea una fábrica de sesiones para trabajar con PostgreSQL
SessionLocal = sessionmaker(bind=engine, autoflush=False, expire_on_commit=False)