import { useState } from "react";
import { login } from "../services/AuthService";
import { useNavigate, Link } from "react-router-dom";

export default function Login(){
  const nav = useNavigate();
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [err,setErr] = useState("");

  const submit = async (e:React.FormEvent)=>{
    e.preventDefault(); setErr("");
    try{
      await login({ email, password });
      nav("/");
    }catch(e:any){
      setErr(e?.response?.data?.detail || "Error al iniciar sesión");
    }
  };

  return (
    <div className="auth-shell">
      <div className="card">
        <div className="brand">
          <div className="brand__dot" />
          <div className="brand__text">
            <div className="brand__uni">UNIVERSIDAD</div>
            <div className="brand__nur">NUR</div>
          </div>
        </div>

        <h1 className="auth-title">Iniciar sesión</h1>

        <form onSubmit={submit}>
          <div className="form-group">
            <input
              className="input"
              type="email"
              placeholder="Correo institucional"
              value={email}
              onChange={e=>setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <input
              className="input"
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={e=>setPassword(e.target.value)}
              required
            />
          </div>

          {err && <div className="error">{err}</div>}

          <div className="form-group" style={{marginTop:12}}>
            <button className="btn" type="submit">Entrar</button>
          </div>
        </form>

        <div className="auth-foot">
          ¿No tienes cuenta? <Link to="/register">Regístrate</Link>
        </div>
      </div>
    </div>
  );
}
