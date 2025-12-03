**Asistente IA Educativo (FastAPI + React)**

**Proyecto académico que integra:**

⦁	Backend: FastAPI (Python)

⦁	Frontend: React + Vite (TypeScript)

⦁	IA: OpenAI GPT-4.1-nano

⦁	Base de datos: SQLite

⦁	Contenido académico: Archivos Markdown (Unidad 1 y 2)

**Requisitos previos**

**Backend (FastAPI – Python)**

⦁	Python 3.10+

⦁	pip

⦁	Pycharm (opcional)


**Frontend (React + Vite)**

⦁	Node.js 18+

⦁	Visual Studio Code


**Ejecutar el BACKEND (FastAPI)**

Ubicarse dentro de la carpeta del backend: cd backend

• **(Opcional) Crear entorno virtual:** python -m venv venv

**Activarlo:**
venv\Scripts\activate

**Instalar dependencias:** pip install -r requirements.txt

**Configurar la clave de OpenAI:**
$env:OPENAI_API_KEY="TU_API_KEY"

**Ejecutar el servidor FastAPI:**
uvicorn main:app --reload

El backend quedará disponible en: http://localhost:8000
Documentación automática: http://localhost:8000/docs

**Ejecutar el FRONTEND (React + Vite)**

Ubicarse dentro de la carpeta del frontend:
cd frontend

**Instalar dependencias:** npm install

**Iniciar la aplicación en modo desarrollo:** npm run dev

El frontend quedará disponible en: http://localhost:5173

**Dependencias principales del Frontend**

⦁	axios

⦁	marked

⦁	React

⦁	react-dom

⦁	react-router-dom

⦁	vite

⦁	tailwindcss

⦁	typescript


**Dependencias principales del Backend**

**(FastAPI + SQLAlchemy + OpenAI)**

⦁	fastapi

⦁	uvicorn

⦁	sqlalchemy

⦁	python-jose

⦁	passlib[bcrypt]

⦁	openai

⦁	python-multipart


**Estructura del Backend**

⦁	main.py → inicia FastAPI, CORS, rutas

⦁	auth/ → login, registro, JWT

⦁	chat/chat_routes.py → comunicación con el modelo IA

⦁	db/models.py → tablas User y ChatHistory

⦁	db/database.py → conexión SQLite

⦁	content/ → archivos Markdown de las unidades


**Notas importantes**

⦁	Este proyecto requiere obligatoriamente una OPENAI_API_KEY.

⦁	El archivo MD con los contenidos debe estar dentro de /content.

⦁	Para producción, cambiar la URL del backend en el frontend.


**Cómo se ejecuta todo junto**

1.	Levantas el backend: uvicorn main:app --reload

2.	Levantas el frontend: npm run dev

3.	En el navegador abres: http://localhost:5173

4.	El chat se comunica con FastAPI automáticamente.
