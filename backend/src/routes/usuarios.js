const express = require("express");
const { connectDB } = require("../config/db");

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

module.exports = router;