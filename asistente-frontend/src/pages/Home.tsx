import { useState } from "react";
import { logout } from "../services/AuthService";
import api from "../services/api";

type Msg = { id: string; role: "user" | "assistant"; content: string };

export default function Home() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [text, setText] = useState("");

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    const userMsg: Msg = { id: crypto.randomUUID(), role: "user", content: text };
    setMessages((p) => [...p, userMsg]);
    setText("");

    try {
      const res = await api.post("/chat", { message: userMsg.content, unidad: 1 });
      const botMsg: Msg = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: res.data.answer,
      };
      setMessages((p) => [...p, botMsg]);
    } catch {
      const botMsg: Msg = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: "Hubo un problema al obtener la respuesta.",
      };
      setMessages((p) => [...p, botMsg]);
    }
  };

  return (
    <div className="dashboard">
      {/* Header */}
      <header className="app-header">
        <div className="brand-mini">
          <div className="brand-dot-sm" />
          <div className="brand-text-sm">
            <div className="u">UNIVERSIDAD</div>
            <div className="n">NUR</div>
          </div>
        </div>

        <h1 style={{ color: "var(--nur-blue)", fontSize: 18, fontWeight: 800 }}>
          Asistente IA – Gestión de Proyectos (PMBOK)
        </h1>

        <div className="user-chip">
          <div className="user-avatar">F</div>
          <button
            className="btn-ghost"
            onClick={() => {
              logout();
              location.href = "/login";
            }}
          >
            Salir
          </button>
        </div>
      </header>

      {/* Grid principal */}
      <div className="main-grid">
        {/* Columna izquierda: Chat */}
        <section>
          <div className="card2">
            <div className="card-head">
              <div className="card-title">Chat de la materia</div>
              <div style={{ display: "flex", gap: 8 }}>
                <button className="btn-ghost" onClick={() => setMessages([])}>
                  Limpiar
                </button>
              </div>
            </div>

            <div className="card-body">
              <div className="chat-box">
                <div className="chat-messages">
                  {messages.map((m) => (
                    <div key={m.id} style={{ textAlign: m.role === "user" ? "right" : "left" }}>
                      <span className={`bubble ${m.role === "user" ? "user" : "bot"}`}>
                        {m.content}
                      </span>
                    </div>
                  ))}
                </div>

                <form onSubmit={send} className="chat-input">
                  <input
                    placeholder="Escribe tu pregunta… (ej. ¿Qué es un proyecto?)"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                  />
                  <button className="btn-primary" type="submit">
                    Enviar
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* Columna derecha: solo Recursos */}
        <aside className="space-y-4">
          <div className="card2">
            <div className="card-head">
              <div className="card-title">Recursos</div>
            </div>
            <div className="card-body">
              <p style={{ marginTop: 0, color: "#475569" }}>
                Alcance activado: <strong>Unidad 1–2</strong>
              </p>
              <ul style={{ margin: 0, paddingLeft: 18 }}>
                <li>Guía PMBOK – Unidad 1 (fundamentos)</li>
                <li>Áreas de conocimiento – Unidad 2</li>
              </ul>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
