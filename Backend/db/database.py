from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

SQLALCHEMY_DATABASE_URL = "sqlite:///./app.db"  # crea app.db en la carpeta backend/

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False}  # necesario para SQLite en modo dev
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Dependencia para inyectar la sesión en endpoints
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
