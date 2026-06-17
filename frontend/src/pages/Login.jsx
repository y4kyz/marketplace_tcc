import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login, token, user } = useContext(AuthContext); // Injetado 'user' para checagem

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");

  // Bloqueio Real: Se o token existir, joga o usuário para o lugar certo baseado no tipo
  useEffect(() => {
    if (token && user) {
      if (user.tipo === "vendedor") {
        navigate("/dashboard-vendedor");
      } else {
        navigate("/");
      }
    }
  }, [token, user, navigate]);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setErro("");

    try {
      const response = await api.post("/auth/login", { email, senha });
      
      if (response.data && response.data.token) {
        // Alimenta o contexto global com o token recebido
        login(response.data.token); 
        
        // O decodificador do contexto (ou a resposta) atualizará o estado 'user'.
        // Caso o seu back-end já devolva os dados do usuário direto na resposta, 
        // usamos o tipo vindo direto dele para o redirecionamento imediato:
        const tipoUsuario = response.data.user?.tipo;
        
        if (tipoUsuario === "vendedor") {
          navigate("/dashboard-vendedor");
        } else {
          navigate("/");
        }
      } else {
        setErro("Resposta inválida do servidor.");
      }
    } catch (err) {
      console.error(err);
      setErro(err.response?.data?.message || err.response?.data?.error || "E-mail ou senha incorretos.");
    } finally {
      setLoading(false);
    }
  }

  // Se já estiver logado, não renderiza o formulário enquanto o useEffect redireciona
  if (token) return null;

  return (
    <div className="min-h-screen bg-gradient-to-tr from-slate-100 via-indigo-50 to-slate-100 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl border border-slate-100 p-8 md:p-10">
        
        <div className="text-center mb-6">
          <span className="text-2xl font-black tracking-tight text-indigo-600 block mb-2 cursor-pointer" onClick={() => navigate("/")}>
            MINHA<span className="text-slate-900">LOJA</span>
          </span>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Acesse sua conta</h1>
        </div>

        {erro && (
          <div className="mb-5 p-3.5 rounded-xl text-sm font-semibold text-center bg-red-50 text-red-700">
            {erro}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Endereço de E-mail</label>
            <input
              type="email"
              placeholder="seuemail@exemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-800 bg-slate-50/50 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Sua Senha</label>
            <input
              type="password"
              placeholder="••••••••"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-800 bg-slate-50/50 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 px-4 rounded-xl shadow-md transition-all text-sm disabled:opacity-50 flex items-center justify-center"
          >
            {loading ? (
              <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              "Entrar"
            )}
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-slate-100 text-center">
          <p className="text-sm text-slate-600">
            Não tem conta? <span onClick={() => navigate("/register")} className="text-indigo-600 font-semibold cursor-pointer">Cadastre-se</span>
          </p>
        </div>
      </div>
    </div>
  );
}