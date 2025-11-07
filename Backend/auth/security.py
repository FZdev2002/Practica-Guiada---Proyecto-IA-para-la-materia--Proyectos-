from datetime import datetime, timedelta
from jose import jwt, JWTError
from passlib.context import CryptContext
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from db.database import get_db
from db.models import User

# Claves simples para demo (cámbialas en producción)
JWT_SECRET = "cl4veFans2580"
JWT_ALG = "HS256"
JWT_MINUTES = 60  # 1 hora

pwd = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    return pwd.hash(password)

def verify_password(plain: str, hashed: str) -> bool:
    return pwd.verify(plain, hashed)

def create_access_token(sub: str) -> str:
    exp = datetime.utcnow() + timedelta(minutes=JWT_MINUTES)
    payload = {"sub": sub, "exp": exp}
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALG)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    if not token:
        raise HTTPException(status_code=401, detail="Token requerido")

    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALG])
        user_id = int(payload.get("sub"))
    except JWTError:
        raise HTTPException(status_code=401, detail="Token inválido o expirado")

    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        raise HTTPException(status_code=401, detail="Usuario no encontrado")

    return user
