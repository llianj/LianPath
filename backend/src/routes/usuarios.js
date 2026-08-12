const express = require("express");
const { connectDB } = require("../config/db");
const { auth } = require("../config/firebaseAdmin");
const { verificarAutenticacao, verificarPerfil } = require("../middlewares/auth");

const router = express.Router();

// Busca o perfil de um usuário pelo e-mail
router.get("/email/:email", async (req, res) => {
  try {
    const db = await connectDB();
    const usuario = await db
      .collection("usuarios")
      .findOne({ email: req.params.email });

    if (!usuario) {
      return res.status(404).json({ erro: "Usuário não encontrado" });
    }

    res.json(usuario);
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: "Erro ao buscar usuário" });
  }
});

// Cria um novo usuário (Firebase Auth + MongoDB) - só Administrador
router.post(
  "/",
  verificarAutenticacao,
  verificarPerfil("administrador"),
  async (req, res) => {
    const { nome, email, senha, perfil } = req.body;

    if (!nome || !email || !senha || !perfil) {
      return res.status(400).json({ erro: "Todos os campos são obrigatórios" });
    }

    const perfisValidos = ["usuario_geral", "professor_coordenador", "administrador"];
    if (!perfisValidos.includes(perfil)) {
      return res.status(400).json({ erro: "Perfil inválido" });
    }

    try {
      const db = await connectDB();

      const existente = await db.collection("usuarios").findOne({ email });
      if (existente) {
        return res.status(409).json({ erro: "Já existe um usuário com este e-mail" });
      }

      // Cria no Firebase Authentication
      const firebaseUser = await auth.createUser({
        email,
        password: senha,
        displayName: nome,
      });

      // Cria no MongoDB
      const novoUsuario = {
        nome,
        email,
        perfil,
        ativo: true,
        criadoEm: new Date(),
      };
      const resultado = await db.collection("usuarios").insertOne(novoUsuario);

      res.status(201).json({ _id: resultado.insertedId, ...novoUsuario });
    } catch (erro) {
      console.error("Erro ao criar usuário:", erro);

      if (erro.code === "auth/email-already-exists") {
        return res.status(409).json({ erro: "Este e-mail já está cadastrado no Firebase" });
      }

      res.status(500).json({ erro: "Erro ao criar usuário" });
    }
  }
);

module.exports = router;