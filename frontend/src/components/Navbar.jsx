import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom"; 
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [menuAberto, setMenuAberto] = useState(false);

  function handleSair() {
    logout();
    navigate("/");
  }

  // Função inteligente para o "Quero Vender"
  function handleQueroVender() {
    if (user && user.tipo === "cliente") {
      // Se for cliente, desloga primeiro para poder cadastrar como vendedor
      logout();
    }
    navigate("/register-vendedor");
  }

  return (
    <>
      {/* BARRA DE NAVEGAÇÃO PRINCIPAL */}
      <nav className="bg-white border-b border-slate-100 shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            
            {/* LADO ESQUERDO: LOGO */}
            <div className="flex items-center">
              <Link to="/" className="text-xl font-black text-slate-900 tracking-tight">
                ETEC<span className="text-indigo-600">MARKET</span>
              </Link>
            </div>

            {/* LADO DIREITO: ACOES DINÂMICAS POR TIPO DE USUÁRIO */}
            <div className="flex items-center space-x-4">
              
              {/* SE FOR CLIENTE OU DESLOGADO: MOSTRA O CARRINHO */}
              {(!user || user.tipo === "cliente") && (
                <button 
                  onClick={() => navigate("/carrinho")}
                  className="p-2 text-slate-500 hover:text-indigo-600 transition-colors rounded-xl hover:bg-slate-50"
                  title="Ver Carrinho"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.625.625 0 1 1-1.25 0 .625.625 0 0 1 1.25 0Zm3 0a.625.625 0 1 1-1.25 0 .625.625 0 0 1 1.25 0Zm3 0a.625.625 0 1 1-1.25 0 .625.625 0 0 1 1.25 0Z" />
                  </svg>
                </button>
              )}

              {/* SE FOR VENDEDOR: OCULTA O CARRINHO E MOSTRA O BOTÃO DA DASHBOARD NO LUGAR */}
              {user && user.tipo === "vendedor" && (
                <button 
                  onClick={() => navigate("/dashboard-vendedor")} // ✨ Corrigido para a rota certa
                  className="inline-flex items-center text-xs font-bold text-emerald-600 bg-emerald-50 hover:bg-emerald-100 px-3 py-2 rounded-xl transition-colors gap-1"
                  title="Acessar Painel do Vendedor"
                >
                  📊 Dashboard
                </button>
              )}

              {/* BOTÃO QUERO VENDER: Some se já for vendedor logado. Se for cliente, executa a função de deslogar */}
              {(!user || user.tipo !== "vendedor") && (
                <button 
                  onClick={handleQueroVender}
                  className="inline-flex items-center text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-3 py-2 rounded-xl transition-colors"
                >
                  🚀 Quero Vender
                </button>
              )}

              <span className="text-slate-200">|</span>

              {/* CONTROLES DE USUÁRIO COM IDENTIFICAÇÃO DE PAPEL */}
              {user ? (
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1.5 bg-slate-50 border border-slate-200/60 p-1 rounded-xl">
                    <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-black uppercase ${user.tipo === 'vendedor' ? 'bg-emerald-600' : 'bg-indigo-600'}`}>
                      {user.nome ? user.nome.charAt(0) : "U"}
                    </span>
                    <span className="text-[11px] font-bold text-slate-500 pr-2 hidden sm:inline capitalize">
                      {user.tipo}
                    </span>
                  </div>

                  <button
                    onClick={handleSair}
                    title="Sair da conta"
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
                    </svg>
                  </button>
                </div>
              ) : (
                <Link 
                  to="/login" 
                  className="text-xs font-bold text-slate-600 hover:text-indigo-600 px-2 py-1 transition-colors"
                >
                  Entrar / Cadastrar
                </Link>
              )}

              {/* HAMBÚRGUER DO MENU LATERAL */}
              <button
                onClick={() => setMenuAberto(true)}
                className="p-2 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              </button>

            </div>
          </div>
        </div>
      </nav>

      {/* BACKDROP DO MENU */}
      {menuAberto && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs z-50" onClick={() => setMenuAberto(false)} />
      )}

      {/* MENU LATERAL CUSTOMIZADO VIA TIPO DE CONTA */}
      <div className={`fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col justify-between ${menuAberto ? "translate-x-0" : "translate-x-full"}`}>
        
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Navegação Loja</span>
          <button onClick={() => setMenuAberto(false)} className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {/* LINKS GENÉRICOS */}
        <div className="p-5 flex-grow space-y-1">
          <button onClick={() => { setMenuAberto(false); navigate("/"); }} className="w-full text-left px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-indigo-600 rounded-xl flex items-center gap-3">
            <span>🏠</span> Início / Vitrine
          </button>

          {/* Links adicionais para Vendedor dentro do Menu */}
          {user && user.tipo === "vendedor" ? (
            <>
              <button onClick={() => { setMenuAberto(false); navigate("/dashboard-vendedor"); }} className="w-full text-left px-4 py-3 text-sm font-semibold text-emerald-700 bg-emerald-50/50 hover:bg-emerald-50 rounded-xl flex items-center gap-3">
                <span>📊</span> Painel Dashboard Geral
              </button>
              <button onClick={() => setMenuAberto(false)} className="w-full text-left px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 rounded-xl flex items-center gap-3">
                <span>📦</span> Meus Produtos Cadastrados
              </button>
              <button onClick={() => setMenuAberto(false)} className="w-full text-left px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 rounded-xl flex items-center gap-3">
                <span>💰</span> Relatório de Vendas e Saldo
              </button>
            </>
          ) : (
            <>
              <button onClick={() => setMenuAberto(false)} className="w-full text-left px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 rounded-xl flex items-center gap-3">
                <span>🔥</span> Mais Vendidos da Semana
              </button>
              <button onClick={() => setMenuAberto(false)} className="w-full text-left px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 rounded-xl flex items-center gap-3">
                <span>⚡</span> Ofertas Relâmpago
              </button>
            </>
          )}
          
          <button onClick={() => setMenuAberto(false)} className="w-full text-left px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 rounded-xl flex items-center gap-3">
            <span>🛡️</span> Central de Ajuda do TCC
          </button>
        </div>

        {/* GITHUB */}
        <div className="p-5 border-t border-slate-100 bg-slate-50">
          <div className="bg-white rounded-2xl border border-slate-200/60 p-4 shadow-xs">
            <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider mb-1 flex items-center">💬 Converse Conosco</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed mb-3">Dúvidas sobre a estrutura ou quer ver o código fonte? Visite nosso repositório.</p>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center justify-center space-x-2">
              <span>Acessar nosso GitHub</span>
            </a>
          </div>
        </div>

      </div>
    </>
  );
}