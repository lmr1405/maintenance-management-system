import os
from dotenv import load_dotenv
from sqlalchemy import create_engine

# Se carga las variables del archivo .env
load_dotenv()

# Obtenemos la direccion de conexion a PostgreSQL
DATABASE_URL = os.getenv("DATABASE_URL")

# Comprobamos que se haya configurado la conexion
if not DATABASE_URL:
    raise ValueError("No se ha definido DATABASE_URL en el archivo .env")

# crea el motor de conexion a PostgreSQL
engine = create_engine(DATABASE_URL)

