from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from db.database import Base, engine
from auth.routes import router as auth_router
from chat.chat_routes import router as chat_router

app = FastAPI(title="Auth demo (FastAPI + SQLite)")

# CORS: permite peticiones
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Crea las tablas en app.db al iniciar
Base.metadata.create_all(bind=engine)

# Rutas
app.include_router(auth_router)
app.include_router(auth_router)
app.include_router(chat_router)
# Salud opcional
@app.get("/ping")
def ping():
    return {"status": "ok"}

@app.get("/")
def root():
    return {"message": "Servidor FastAPI funcionando ✅."}

