const { auth } = require("../config/firebaseAdmin");
const { connectDB } = require("../config/db");

async function verificarAutenticacao(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ erro: "Token não fornecido" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = await auth.verifyIdToken(token);

    const db = await connectDB();
    const usuario = await db
      .collection("usuarios")
      .findOne({ email: decoded.email });

    if (!usuario) {
      return res.status(404).json({ erro: "Usuário não encontrado no sistema" });
    }

    req.usuario = usuario;
    next();
  } catch (erro) {
    console.error("Erro ao verificar token:", erro);
    return res.status(401).json({ erro: "Token inválido ou expirado" });
  }
}

function verificarPerfil(...perfisPermitidos) {
  return (req, res, next) => {
    if (!perfisPermitidos.includes(req.usuario.perfil)) {
      return res.status(403).json({ erro: "Acesso negado para este perfil" });
    }
    next();
  };
}

module.exports = { verificarAutenticacao, verificarPerfil };