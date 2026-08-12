import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function RecuperarSenha() {
  const [email, setEmail] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  const { recuperarSenha } = useAuth();

  async function handleSubmit(e) {
    e.preventDefault();
    setErro("");
    setMensagem("");
    setCarregando(true);

    try {
      await recuperarSenha(email);
      setMensagem("Se este e-mail estiver cadastrado, um link de redefinição foi enviado.");
    } catch (err) {
      console.error(err);
      setMensagem("Se este e-mail estiver cadastrado, um link de redefinição foi enviado.");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div style={{ maxWidth: 360, margin: "80px auto", fontFamily: "sans-serif" }}>
      <h1>Recuperar Senha</h1>
      <p>Informe seu e-mail cadastrado para receber o link de redefinição.</p>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 12 }}>
          <label>E-mail</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: "100%", padding: 8 }}
          />
        </div>

        {mensagem && <p style={{ color: "green" }}>{mensagem}</p>}
        {erro && <p style={{ color: "red" }}>{erro}</p>}

        <button type="submit" disabled={carregando} style={{ width: "100%", padding: 10 }}>
          {carregando ? "Enviando..." : "Enviar link de redefinição"}
        </button>
      </form>

      <p style={{ marginTop: 16 }}>
        <Link to="/login">Voltar ao login</Link>
      </p>
    </div>
  );
}

export default RecuperarSenha;