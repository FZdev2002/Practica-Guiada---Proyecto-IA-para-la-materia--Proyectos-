import { useState } from "react";
import { register } from "../services/AuthService";
import { useNavigate, Link } from "react-router-dom";

export default function Register(){
  const nav = useNavigate();
  const [name,setName] = useState("");
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [err,setErr] = useState(""); const [ok,setOk] = useState(false);

  const submit = async (e:React.FormEvent)=>{
    e.preventDefault(); setErr("");
    try{
      await register({ name, email, password });
      setOk(true);
      setTimeout(()=>nav("/login"), 900);
    }catch(e:any){
      setErr(e?.response?.data?.detail || "No se pudo registrar");
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

        <h1 className="auth-title">Crear cuenta</h1>

        <form onSubmit={submit}>
          <div className="form-group">
            <input className="input" placeholder="Nombre"
              value={name} onChange={e=>setName(e.target.value)} required />
          </div>
          <div className="form-group">
            <input className="input" type="email" placeholder="Correo institucional"
              value={email} onChange={e=>setEmail(e.target.value)} required />
          </div>
          <div className="form-group">
            <input className="input" type="password" placeholder="Contraseña"
              value={password} onChange={e=>setPassword(e.target.value)} required />
          </div>

          {err && <div className="error">{err}</div>}
          {ok && <div className="success">Registro exitoso. Redirigiendo…</div>}

          <div className="form-group" style={{marginTop:12}}>
            <button className="btn" type="submit">Crear cuenta</button>
          </div>
        </form>

        <div className="auth-foot">
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
        </div>
      </div>
    </div>
  );
}
