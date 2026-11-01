# Imagen base de Node.js
FROM node:22-alpine

# Directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiar los archivos de dependencias
COPY package*.json ./

# Instalar las dependencias del frontend
RUN npm ci

# Copiar el código del frontend
COPY . .

# Puerto utilizado por Vite
EXPOSE 5173

# Iniciar Vite permitiendo conexiones externas
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]