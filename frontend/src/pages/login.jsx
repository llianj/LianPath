import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Login.css";

function Login() {
  const [modo, setModo] = useState("login"); // "login" | "recuperar"

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  const { login, recuperarSenha } = useAuth();
  const navigate = useNavigate();

  function trocarModo(novoModo) {
    setModo(novoModo);
    setErro("");
    setMensagem("");
  }

  async function handleLogin(e) {
    e.preventDefault();
    setErro("");
    setCarregando(true);

    try {
      await login(email, senha);
      navigate("/");
    } catch (err) {
      setErro("E-mail ou senha inválidos.");
      console.error(err);
    } finally {
      setCarregando(false);
    }
  }

  async function handleRecuperar(e) {
    e.preventDefault();
    setErro("");
    setMensagem("");
    setCarregando(true);

    try {
      await recuperarSenha(email);
    } catch (err) {
      console.error(err);
      // mesma mensagem em caso de erro, por segurança (evita confirmar quais e-mails existem)
    } finally {
      setMensagem("Se este e-mail estiver cadastrado, um link de redefinição foi enviado.");
      setCarregando(false);
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>LianPath</h1>
        <p>
          {modo === "login"
            ? "Faça login para continuar"
            : "Informe seu e-mail para recuperar a senha"}
        </p>

        {modo === "login" ? (
          <form onSubmit={handleLogin}>
            <div className="login-field">
              <label>E-mail</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="login-field">
              <label>Senha</label>
              <input
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
              />
            </div>

            {erro && <p className="login-erro">{erro}</p>}

            <button type="submit" disabled={carregando} className="login-button">
              {carregando ? "Entrando..." : "Entrar"}
            </button>

            <p className="login-link">
              <button type="button" className="login-link-btn" onClick={() => trocarModo("recuperar")}>
                Esqueci minha senha
              </button>
            </p>
          </form>
        ) : (
          <form onSubmit={handleRecuperar}>
            <div className="login-field">
              <label>E-mail</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {mensagem && <p className="login-mensagem">{mensagem}</p>}
            {erro && <p className="login-erro">{erro}</p>}

            <button type="submit" disabled={carregando} className="login-button">
              {carregando ? "Enviando..." : "Enviar link de redefinição"}
            </button>

            <p className="login-link">
              <button type="button" className="login-link-btn" onClick={() => trocarModo("login")}>
                Voltar para o login
              </button>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}

export default Login;