from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from openai import OpenAI
import os
from sqlalchemy.orm import Session
from db.models import ChatHistory
from db.database import get_db
from auth.security import get_current_user
import glob

router = APIRouter(prefix="/chat", tags=["chat"])

class ChatRequest(BaseModel):
    message: str

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# Carga TODAS las unidades automáticamente
UNIDADES = ""
for file in sorted(glob.glob("content/*.md")):
    with open(file, "r", encoding="utf-8") as f:
        UNIDADES += f"\n\n=== CONTENIDO DE {file} ===\n\n"
        UNIDADES += f.read()

TUTOR_PROMPT = """
Eres un tutor experto en Gestión de Proyectos estilo PMBOK.

### Estilo:
- Hablas de forma cálida, simple y motivadora.
- No usas párrafos largos; prefieres listas, ejemplos y explicaciones claras.

### Reglas IMPORTANTES:
- SOLO puedes responder usando el contenido disponible en las unidades cargadas.
- Si el usuario pregunta algo que NO aparece en ese contenido, responde:
  "Ese tema no aparece en los contenidos disponibles. Puedo ayudarte con lo que sí está dentro de las unidades."
"""

@router.post("/")
def chat(req: ChatRequest, db: Session = Depends(get_db), current_user=Depends(get_current_user)):

    # Últimos 6 mensajes del usuario (chat completo, ya no depende de unidad)
    historial = (
        db.query(ChatHistory)
        .filter(ChatHistory.user_id == current_user.id)
        .order_by(ChatHistory.id.desc())
        .limit(6)
        .all()
    )
    historial = list(reversed(historial))

    # Mensajes enviados al modelo
    messages = [
        {"role": "system", "content": TUTOR_PROMPT},
        {"role": "system", "content": f"Contenido disponible:\n{UNIDADES}"},
    ]

    for h in historial:
        messages.append({"role": h.role, "content": h.content})

    messages.append({"role": "user", "content": req.message})

    try:
        response = client.chat.completions.create(
            model="gpt-4.1-nano",
            messages=messages
        )

        answer = response.choices[0].message.content.strip()

        # Guardar BD
        db.add(ChatHistory(user_id=current_user.id, role="user", content=req.message))
        db.add(ChatHistory(user_id=current_user.id, role="assistant", content=answer))
        db.commit()

        return {"answer": answer}

    except Exception as e:
        print("Error:", e)
        raise HTTPException(status_code=500, detail="Ocurrió un error al generar la respuesta.")
