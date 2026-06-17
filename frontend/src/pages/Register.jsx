import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function Register() {
  const navigate = useNavigate();

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" }); // Mensagens na tela

async function handleRegister(e) {
    e.preventDefault();
    setLoading(true);

    try {
      // Enviando exatamente o que está na sua tabela do banco de dados
      await api.post("/auth/register", {
        nome,
        email,
        senha,
        tipo: "cliente" // Enviando o tipo padrão exigido pela sua tabela
      });

      alert("Cadastro realizado com sucesso! Faça seu login.");
      navigate("/login");
    } catch (err) {
      console.error("Erro completo da requisição:", err);
      
      // Se o erro tiver uma resposta do back-end, exibe o motivo real na tela
      if (err.response && err.response.data) {
        alert(`Erro do servidor: ${err.response.data.message || err.response.data.error || "Dados inválidos"}`);
      } else {
        alert("Não foi possível conectar ao servidor. O Back-end está rodando ou o CORS está ativo?");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-tr from-slate-100 via-indigo-50 to-slate-100 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl border border-slate-100 p-8 md:p-10">
        
        <div className="text-center mb-6">
          <span className="text-2xl font-black tracking-tight text-indigo-600 block mb-2 cursor-pointer" onClick={() => navigate("/")}>
            MINHA<span className="text-slate-900">LOJA</span>
          </span>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Crie sua conta</h1>
        </div>

        {/* Feedback Visual Lindão sem pop-up feio */}
        {status.message && (
          <div className={`mb-5 p-3.5 rounded-xl text-sm font-semibold text-center ${
            status.type === "success" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"
          }`}>
            {status.message}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Nome Completo</label>
            <input
              type="text"
              placeholder="Seu nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-800 bg-slate-50/50 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">E-mail</label>
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
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Senha</label>
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
            {loading ? <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : "Criar Conta"}
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-slate-100 text-center">
          <p className="text-sm text-slate-600">
            Já tem conta? <span onClick={() => navigate("/login")} className="text-indigo-600 font-semibold cursor-pointer">Fazer Login</span>
          </p>
        </div>
      </div>
    </div>
  );
}