import { useEffect, useState } from "react";
import { logout, getProfile } from "../services/AuthService";
import api from "../services/api";
import { marked } from "marked";

type Msg = { id: string; role: "user" | "assistant"; content: string };
type User = { id: number; name: string; email: string };

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getProfile()
      .then(setUser)
      .catch(() => {
        logout();
        location.href = "/login";
      });
  }, []);

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || loading) return; // evita enviar doble mientras carga

    const userMsg: Msg = { id: crypto.randomUUID(), role: "user", content: text };
    setMessages((p) => [...p, userMsg]);
    setText("");
    setLoading(true); //activa el indicador

    try {
      const res = await api.post("/chat", { message: userMsg.content});
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
    } finally {
      setLoading(false); //desactiva el indicador
    }
  };

  const initial = (user?.name?.[0] ?? "?").toUpperCase();

  return (
    <div className="dashboard">
      <header className="app-header">
        <div className="brand-mini">
          <img
            src="/src/assets/nur-logo.png"
            alt="Logo NUR"
            style={{ height: "80px", objectFit: "contain" }}
          />
        </div>

        <h1 style={{ color: "var(--nur-blue)", fontSize: 18, fontWeight: 800 }}>
          Asistente IA – Gestión de Proyectos (PMBOK)
        </h1>

        <div className="user-chip">
          <div className="user-avatar">{initial}</div>
          <span style={{ fontSize: 14, fontWeight: 600 }}>
            {user ? user.name : "Cargando..."}
          </span>
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

      <div className="main-grid">
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
                  {messages.map((m) => {
                    const isTutorQuestion = m.role === "assistant" && m.content.trim().endsWith("?");
                    return (
                      <div key={m.id} style={{ textAlign: m.role === "user" ? "right" : "left" }}>
                        <span
                          className={`bubble ${m.role === "user" ? "user" : isTutorQuestion ? "tutor-q" : "bot"}`}
                          dangerouslySetInnerHTML={{ __html: marked.parse(m.content) }}
                        />
                      </div>
                    );
                  })}

                  {loading && (
                    <div style={{ textAlign: "left", color: "#64748b", fontStyle: "italic" }}>
                      El asistente está pensando<span className="loading-dots" />
                    </div>
                  )}
                </div>

                <form onSubmit={send} className="chat-input">
                  <input
                    placeholder="Escribe tu pregunta… (ej. ¿Qué es un proyecto?)"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    disabled={loading} // evita escribir mientras carga
                  />
                  <button className="btn-primary" type="submit" disabled={loading}>
                    {loading ? "Esperando..." : "Enviar"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>

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
                <li>Introducción a la Gestión de Poryectos – Unidad 1</li>
                <li>Fase de Inicio – Unidad 2</li>
              </ul>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
