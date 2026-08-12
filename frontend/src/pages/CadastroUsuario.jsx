import { useState } from "react";
import { useAuth } from "../context/AuthContext";

function CadastroUsuario() {
  const { getToken } = useAuth();

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [perfil, setPerfil] = useState("usuario_geral");
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setErro("");
    setMensagem("");
    setCarregando(true);

    try {
      const token = await getToken();
      const res = await fetch("http://localhost:5000/usuarios", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ nome, email, senha, perfil }),
      });

      const dados = await res.json();

      if (!res.ok) {
        setErro(dados.erro || "Erro ao cadastrar usuário");
        return;
      }

      setMensagem(`Usuário "${dados.nome}" cadastrado com sucesso!`);
      setNome("");
      setEmail("");
      setSenha("");
      setPerfil("usuario_geral");
    } catch (err) {
      console.error(err);
      setErro("Erro de conexão com o servidor");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div style={{ maxWidth: 360, margin: "80px auto", fontFamily: "sans-serif" }}>
      <h1>Cadastrar Usuário</h1>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 12 }}>
          <label>Nome</label>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
            style={{ width: "100%", padding: 8 }}
          />
        </div>

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

        <div style={{ marginBottom: 12 }}>
          <label>Senha inicial</label>
          <input
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
            minLength={6}
            style={{ width: "100%", padding: 8 }}
          />
        </div>

        <div style={{ marginBottom: 12 }}>
          <label>Perfil</label>
          <select
            value={perfil}
            onChange={(e) => setPerfil(e.target.value)}
            style={{ width: "100%", padding: 8 }}
          >
            <option value="usuario_geral">Usuário Geral</option>
            <option value="professor_coordenador">Professor/Coordenador</option>
            <option value="administrador">Administrador</option>
          </select>
        </div>

        {erro && <p style={{ color: "red" }}>{erro}</p>}
        {mensagem && <p style={{ color: "green" }}>{mensagem}</p>}

        <button type="submit" disabled={carregando} style={{ width: "100%", padding: 10 }}>
          {carregando ? "Cadastrando..." : "Cadastrar"}
        </button>
      </form>
    </div>
  );
}

export default CadastroUsuario;