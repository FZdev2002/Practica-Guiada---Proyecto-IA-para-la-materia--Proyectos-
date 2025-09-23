from datetime import datetime, timedelta
from jose import jwt
from passlib.context import CryptContext

# Claves simples para demo (cámbialas en producción)
JWT_SECRET = "cambia_esta_clave_super_secreta"
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
