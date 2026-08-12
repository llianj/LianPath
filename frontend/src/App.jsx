import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Login from "./pages/Login";

function Home() {
  const { user, perfil, logout, getToken } = useAuth();

  async function testarReservas() {
    const token = await getToken();
    const res = await fetch("http://localhost:5000/reservas", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const dados = await res.json();
    console.log("Reservas:", dados);
  }

  return (
    <div style={{ maxWidth: 360, margin: "80px auto", fontFamily: "sans-serif" }}>
      <h1>Bem-vindo(a)!</h1>
      <p>Logado como: {user?.email}</p>
      <p>Perfil: {perfil}</p>
      <button onClick={logout}>Sair</button>
      <button onClick={testarReservas}>Testar Reservas</button>
    </div>
  );
}

function PainelAdmin() {
  return <h1>Painel do Administrador</h1>;
}

function PrivateRoute({ children, perfisPermitidos }) {
  const { user, perfil } = useAuth();

  if (!user) return <Navigate to="/login" />;

  if (perfisPermitidos && !perfisPermitidos.includes(perfil)) {
    return <Navigate to="/" />;
  }

  return children;
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <PrivateRoute perfisPermitidos={["administrador"]}>
                <PainelAdmin />
              </PrivateRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;