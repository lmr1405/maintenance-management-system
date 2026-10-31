#!/bin/bash

set -e

# Obtener la ruta raíz del proyecto
RAIZ="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

BACKEND="$RAIZ/backend"
FRONTEND="$RAIZ/frontend"
VENV="$BACKEND/.venv"
PYTHON="$VENV/bin/python"

# Crear el entorno virtual si no existe
if [ ! -f "$PYTHON" ]; then
    echo "Creando entorno virtual de Python..."
    python3 -m venv "$VENV"

    # Instalar dependencias solo al crear el entorno
    "$PYTHON" -m pip install -r "$BACKEND/requirements.txt"
fi

# Instalar dependencias de React si no existen
if [ ! -d "$FRONTEND/node_modules" ]; then
    echo "Instalando dependencias de React..."
    cd "$FRONTEND"
    npm install
fi

# Iniciar FastAPI
echo "Iniciando FastAPI..."
cd "$BACKEND"
"$PYTHON" -m uvicorn app.main:app --reload &
PID_BACKEND=$!

# Iniciar React
echo "Iniciando React..."
cd "$FRONTEND"
npm run dev &
PID_FRONTEND=$!

# Detener ambos servidores al cerrar el script
trap 'kill "$PID_BACKEND" "$PID_FRONTEND" 2>/dev/null || true' EXIT

# Mantener ambos procesos en ejecución
wait