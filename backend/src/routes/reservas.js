const express = require("express");
const { ObjectId } = require("mongodb");
const { connectDB } = require("../config/db");
const { verificarAutenticacao, verificarPerfil } = require("../middlewares/auth");

const router = express.Router();

// Lista todas as reservas (qualquer usuário autenticado pode ver)
router.get("/", verificarAutenticacao, async (req, res) => {
  try {
    const db = await connectDB();
    const reservas = await db.collection("reservas").find().toArray();
    res.json(reservas);
  } catch (erro) {
    res.status(500).json({ erro: "Erro ao buscar reservas" });
  }
});

// so admin
router.patch(
  "/:id/aprovar",
  verificarAutenticacao,
  verificarPerfil("administrador"),
  async (req, res) => {
    try {
      const db = await connectDB();
      await db
        .collection("reservas")
        .updateOne(
          { _id: new ObjectId(req.params.id) },
          { $set: { status: "aprovada" } }
        );
      res.json({ mensagem: "Reserva aprovada com sucesso" });
    } catch (erro) {
      res.status(500).json({ erro: "Erro ao aprovar reserva" });
    }
  }
);

module.exports = router;