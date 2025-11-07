from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from openai import OpenAI
import os
from db.models import ChatHistory
from sqlalchemy.orm import Session
from db.database import get_db
from auth.security import get_current_user
from fastapi import Depends
router = APIRouter(prefix="/chat", tags=["chat"])

class ChatRequest(BaseModel):
    message: str
    unidad: int

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# Cargar contenido de unidad 1
with open("content/unidad 1.md", "r", encoding="utf-8") as f:
    UNIDAD_1 = f.read()

TUTOR_PROMPT = """
Eres un Asistente de Proyectos PMBOK con estilo tutor amigable.

Tu objetivo es ayudar al estudiante a comprender los conceptos de manera clara y práctica.

### Estilo:
- Habla como si estuvieras explicando a un compañero.
- Usa un tono **tranquilo, cálido y motivador**.
- No seas académico ni robótico.
- No uses párrafos largos: divide en partes, listas y ejemplos.

### Forma de Responder:
1. Explica primero el concepto de manera sencilla.
2. Ofrece un ejemplo práctico y cotidiano.
3. Formula una pregunta corta para verificar comprensión (sin evaluar aún).
4. Si después el estudiante responde, da retroalimentación amable y constructiva.

### Restricción:
Responde únicamente usando la información disponible en la unidad.
Si el usuario pregunta algo fuera de la unidad, responde:
"Este tema pertenece a unidades posteriores. Podemos revisar los conceptos de la Unidad 1 si lo deseas."
"""

@router.post("/")
def chat(req: ChatRequest, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    # Elegir contenido por unidad
    if req.unidad == 1:
        contexto = UNIDAD_1
    else:
        contexto = "Solo está disponible la Unidad 1 por ahora."

    # Obtener últimos 6 mensajes del historial
    historial = db.query(ChatHistory)\
        .filter(ChatHistory.user_id == current_user.id)\
        .order_by(ChatHistory.id.desc())\
        .limit(6)\
        .all()
    historial = list(reversed(historial))  # para que estén en orden correcto

    messages = [
        {"role": "system", "content": TUTOR_PROMPT},
        {"role": "system", "content": f"Contenido base:\n{contexto}"},
    ]

    # Añadir historial al contexto del chat
    for h in historial:
        messages.append({"role": h.role, "content": h.content})

    # Agregar el mensaje nuevo
    messages.append({"role": "user", "content": req.message})

    try:
        response = client.chat.completions.create(
            model="gpt-4.1-nano",
            messages=messages
        )

        answer = response.choices[0].message.content.strip()

        # Guardar conversación en BD
        db.add(ChatHistory(user_id=current_user.id, role="user", content=req.message, unidad=req.unidad))
        db.add(ChatHistory(user_id=current_user.id, role="assistant", content=answer, unidad=req.unidad))
        db.commit()

        return {"answer": answer}

    except Exception as e:
        print("Error:", e)
        raise HTTPException(status_code=500, detail="Ocurrió un error al generar la respuesta.")