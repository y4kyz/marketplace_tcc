import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function RegisterVendedor() {
  const navigate = useNavigate();

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRegister(e) {
    e.preventDefault();
    setLoading(true);

    try {
      // Aqui forçamos a criação com o tipo "vendedor" exigido pelo seu MariaDB
      await api.post("/auth/register", {
        nome,
        email,
        senha,
        tipo: "vendedor" 
      });

      alert("Cadastro de Vendedor realizado com sucesso! Faça seu login.");
      navigate("/login"); // Redireciona para o login comum ou para um login de vendedor
    } catch (err) {
      console.error(err);
      alert("Erro ao realizar cadastro de vendedor. Verifique os dados.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-tr from-slate-100 via-amber-50 to-slate-100 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl border border-slate-100 p-8 md:p-10">
        
        <div className="text-center mb-8">
          <span className="text-2xl font-black tracking-tight text-amber-600 block mb-2 cursor-pointer" onClick={() => navigate("/")}>
            PORTAL<span className="text-slate-900">VENDEDOR</span>
          </span>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
            Crie sua conta de Vendedor
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Cadastre sua loja e comece a anunciar seus produtos hoje mesmo.
          </p>
        </div>

        <form onSubmit={handleRegister} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Nome Completo / Nome da Loja</label>
            <input
              type="text"
              placeholder="Ex: João das Camisetas"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-800 bg-slate-50/50 focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all outline-none text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">E-mail Comercial</label>
            <input
              type="email"
              placeholder="vendas@sualoja.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-800 bg-slate-50/50 focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all outline-none text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Senha de Acesso</label>
            <input
              type="password"
              placeholder="••••••••"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-800 bg-slate-50/50 focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all outline-none text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-3.5 px-4 rounded-xl shadow-md hover:shadow-lg transition-all text-sm disabled:opacity-50 flex items-center justify-center"
          >
            {loading ? (
              <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              "Cadastrar como Vendedor"
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-100 text-center">
          <p className="text-sm text-slate-600">
            Voltar para a{" "}
            <span onClick={() => navigate("/")} className="text-indigo-600 font-semibold cursor-pointer">
              Página Inicial
            </span>
          </p>
        </div>

      </div>
    </div>
  );
}