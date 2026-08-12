//servidor
const express = require("express");
const cors = require("cors");
const { connectDB } = require("./config/db");
//paginas
const usuariosRoutes = require("./routes/usuarios");
const reservasRoutes = require("./routes/reservas");

require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());
app.use("/usuarios", usuariosRoutes);
app.use("/reservas", reservasRoutes);

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.json({ status: "LianPath API rodando" });
});

async function start() {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
  });
}

start();