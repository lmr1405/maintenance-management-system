# Imagen base de Python
FROM python:3.12-slim

# Directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiar las dependencias del backend
COPY requirements.txt .

# Instalar las dependencias de Python
RUN pip install --no-cache-dir -r requirements.txt

# Copiar el código del backend al contenedor
COPY app/ ./app/
COPY alembic/ ./alembic/
COPY alembic.ini .
# Copiar los scripts de demostración
COPY scripts/ ./scripts/

# Puerto utilizado por FastAPI
EXPOSE 8000

# Iniciar el servidor FastAPI
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]