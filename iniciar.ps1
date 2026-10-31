# Obtener la ruta raíz del proyecto
$raiz = $PSScriptRoot

$backend = Join-Path $raiz "backend"
$frontend = Join-Path $raiz "frontend"
$venv = Join-Path $backend ".venv"
$python = Join-Path $venv "Scripts\python.exe"

# Crear el entorno virtual si no existe
if (-not (Test-Path $python)) {
    Write-Host "Creando entorno virtual de Python..."
    python -m venv $venv

    if ($LASTEXITCODE -ne 0) {
        throw "No se pudo crear el entorno virtual."
    }

    # Instalar dependencias del backend
    & $python -m pip install -r (Join-Path $backend "requirements.txt")

    if ($LASTEXITCODE -ne 0) {
        throw "No se pudieron instalar las dependencias de Python."
    }
}

# Instalar dependencias de React si no existen
if (-not (Test-Path (Join-Path $frontend "node_modules"))) {
    Write-Host "Instalando dependencias de React..."
    Push-Location $frontend
    try {
        npm install
        if ($LASTEXITCODE -ne 0) {
            throw "No se pudieron instalar las dependencias de React."
        }
    }
    finally {
        Pop-Location
    }
}

# Iniciar FastAPI en otra terminal
Write-Host "Iniciando FastAPI..."
Start-Process powershell -ArgumentList @(
    "-NoExit",
    "-Command",
    "Set-Location '$backend'; & '$python' -m uvicorn app.main:app --reload"
)

# Iniciar React en otra terminal
Write-Host "Iniciando React..."
Start-Process powershell -ArgumentList @(
    "-NoExit",
    "-Command",
    "Set-Location '$frontend'; npm run dev"
)

Write-Host "Servidores iniciados."