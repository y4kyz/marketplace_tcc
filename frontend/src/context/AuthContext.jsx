import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext({});

// Função auxiliar para decodificar o Token JWT nativamente
function decodificarToken(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload); // Retorna o objeto do usuário (id, nome, tipo, etc.)
  } catch (error) {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Executa assim que a aplicação abre para manter o usuário logado se der F5
  useEffect(() => {
    const tokenSalvo = localStorage.getItem("@MinhaLoja:token");
    
    if (tokenSalvo) {
      setToken(tokenSalvo);
      const usuarioDecodificado = decodificarToken(tokenSalvo);
      setUser(usuarioDecodificado);
    }
    setLoading(false);
  }, []);

  // Função de Login atualizada para disparar a mudança nas telas imediatamente
  function login(novoToken) {
    localStorage.setItem("@MinhaLoja:token", novoToken);
    
    // Atualiza os estados do React na hora (isso força a Navbar a mudar)
    setToken(novoToken);
    const usuarioDecodificado = decodificarToken(novoToken);
    setUser(usuarioDecodificado);
  }

  // Função de Logout para limpar tudo
  function logout() {
    localStorage.removeItem("@MinhaLoja:token");
    setToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ token, user, login, logout, isLogado: !!token }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}