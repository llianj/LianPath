import { createContext, useContext, useEffect, useState } from "react";
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "../config/firebase";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [perfil, setPerfil] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        try {
          const res = await fetch(
            `http://localhost:5000/usuarios/email/${currentUser.email}`
          );
          if (res.ok) {
            const dados = await res.json();
            setPerfil(dados.perfil);
          } else {
            setPerfil(null);
          }
        } catch (erro) {
          console.error("Erro ao buscar perfil:", erro);
          setPerfil(null);
        }
      } else {
        setPerfil(null);
      }

      setLoading(false);
    });
    return unsubscribe;
  }, []);

  async function login(email, senha) {
    return signInWithEmailAndPassword(auth, email, senha);
  }

  async function logout() {
    return signOut(auth);
  }

  async function getToken() {
  if (!auth.currentUser) return null;
  return auth.currentUser.getIdToken();
}

  return (
    <AuthContext.Provider value={{ user, perfil, login, logout, loading, getToken }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}