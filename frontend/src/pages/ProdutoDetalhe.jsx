import { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";

export default function ProdutoDetalhe() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [produto, setProduto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);
  const [quantidade, setQuantidade] = useState(1);

  // ESTADO PARA O ALERTA CUSTOMIZADO (TOAST)
  const [toast, setToast] = useState({ visivel: false, mensagem: "", tipo: "sucesso" });

  // Detecta se o usuário logado é um vendedor
  const papelUsuario = user?.role || user?.tipo || localStorage.getItem("@MinhaLoja:userRole") || "vendedor";
  const isVendedor = papelUsuario === "vendedor";

  useEffect(() => {
    async function carregarProduto() {
      try {
        setLoading(true);
        const response = await api.get(`/produtos/${id}`);
        const dados = response.data.produto || response.data;
        setProduto(dados);
      } catch (err) {
        console.error("Erro ao carregar detalhes do produto:", err);
        setErro("Não foi possível carregar as informações deste produto.");
      } finally {
        setLoading(false);
      }
    }
    carregarProduto();
  }, [id]);

  function handleAcaoBotao() {
    // 🚫 BARRA REQUISITOS DE VENDEDOR
    if (isVendedor) {
      setToast({
        visivel: true,
        mensagem: "Operação Bloqueada: Contas de vendedor não podem realizar compras ou adicionar itens ao carrinho.",
        tipo: "erro"
      });

      setTimeout(() => {
        setToast({ visivel: false, mensagem: "", tipo: "sucesso" });
      }, 4000);
      return;
    }

    // Fluxo normal para Clientes
    setToast({
      visivel: true,
      mensagem: `Sucesso! ${quantidade}x "${produto.nome}" adicionado ao carrinho.`,
      tipo: "sucesso"
    });

    setTimeout(() => {
      setToast({ visivel: false, mensagem: "", tipo: "sucesso" });
      navigate("/");
    }, 3000);
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between relative">
      
      {/* TOAST NOTIFICATION REESTILIZADO */}
      {toast.visivel && (
        <div className={`fixed bottom-5 right-5 z-50 px-5 py-4 rounded-2xl shadow-xl flex items-center space-x-3 border transition-all animate-bounce ${
          toast.tipo === "erro" 
            ? "bg-rose-900 text-rose-100 border-rose-800" 
            : "bg-slate-900 text-white border-slate-800"
        }`}>
          <span className={`rounded-full p-1 text-xs font-black w-5 h-5 flex items-center justify-center ${
            toast.tipo === "erro" ? "bg-rose-500 text-white" : "bg-indigo-500 text-white"
          }`}>
            {toast.tipo === "erro" ? "✕" : "✓"}
          </span>
          <p className="text-xs font-bold tracking-tight max-w-xs">{toast.mensagem}</p>
        </div>
      )}

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-grow w-full">
        
        {/* BOTÃO VOLTAR REESTILIZADO */}
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-indigo-600 mb-8 transition-colors gap-1.5"
        >
          ← Voltar para a navegação
        </button>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-indigo-600 border-t-transparent"></div>
            <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Buscando dados do produto...</p>
          </div>
        ) : erro || !produto ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-200/60 p-8 max-w-md mx-auto shadow-xs">
            <span className="text-3xl block">📦</span>
            <h3 className="text-base font-black text-slate-800 mt-4 uppercase tracking-tight">Produto Indisponível</h3>
            <p className="text-slate-400 text-xs mt-2 font-medium">{erro || "O item selecionado não foi localizado."}</p>
            <button 
              onClick={() => navigate("/")}
              className="mt-6 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-5 py-3 rounded-xl transition-all uppercase tracking-wider"
            >
              Voltar ao Início
            </button>
          </div>
        ) : (
          
          /* CONTEÚDO ENFEITADO */
          <div className="bg-white rounded-3xl border border-slate-200/60 shadow-xs overflow-hidden grid grid-cols-1 md:grid-cols-2 gap-8 p-6 md:p-10">
            
            {/* CORREÇÃO E FALLBACK DA IMAGEM QUEBRADA */}
            <div className="flex items-center justify-center bg-slate-50 border border-slate-100 rounded-2xl p-6 aspect-square overflow-hidden relative group">
              <img
                src={produto.imagem ? `http://localhost:3000/uploads/${produto.imagem}` : "https://via.placeholder.com/500x500?text=Sem+Imagem+Cadastrada"}
                alt={produto.nome}
                className="max-h-full max-w-full object-contain rounded-xl mix-blend-darken transition-transform duration-300 group-hover:scale-105"
                onError={(e) => {
                  // Caso o backend salve o caminho interno concatenado, tenta a rota alternativa
                  e.target.src = `http://localhost:3000/uploads/produtos/${produto.imagem}`;
                }}
              />
              <span className="absolute top-3 left-3 text-[10px] bg-white border border-slate-200/80 font-mono text-slate-400 px-2.5 py-1 rounded-md shadow-2xs">
                Ref: #{produto.id}
              </span>
            </div>

            {/* INFORMAÇÕES DO ITEM */}
            <div className="flex flex-col justify-between py-2 space-y-6">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-3 py-1 rounded-md uppercase tracking-wider">
                    {produto.categoria || "Catálogo Geral"}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-md uppercase">
                    Estoque: {produto.estoque || 0} un
                  </span>
                </div>

                <h1 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight mt-4 mb-1">
                  {produto.nome}
                </h1>
                
                <p className="text-xs text-slate-400 font-medium">
                  Distribuído por: <span className="font-mono text-indigo-500 font-semibold">@4kyzvendas</span>
                </p>

                <hr className="border-slate-100 my-5" />

                <div className="mb-6 bg-slate-50/60 border border-slate-100 p-4 rounded-2xl">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Valor Unitário</span>
                  <strong className="text-3xl font-black text-slate-900 tracking-tight">
                    R$ {Number(produto.preco).toFixed(2).replace(".", ",")}
                  </strong>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-2">Especificações do Vendedor</span>
                  <p className="text-xs text-slate-600 leading-relaxed bg-white border border-slate-200/70 p-4 rounded-xl font-medium shadow-2xs">
                    {produto.descricao || "O lojista corporativo optou por não inserir observações técnicas adicionais para este item."}
                  </p>
                </div>
              </div>

              {/* PAINEL DINÂMICO DE AÇÕES */}
              <div className="pt-6 border-t border-slate-100 space-y-4">
                
                {/* Oculta seletores de quantidade para uma UI mais limpa caso seja vendedor */}
                {!isVendedor && (
                  <div className="flex items-center space-x-3">
                    <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Quantidade:</span>
                    <div className="flex items-center bg-slate-100 rounded-xl p-1 border border-slate-200">
                      <button 
                        onClick={() => setQuantidade(q => Math.max(1, q - 1))}
                        className="w-8 h-8 font-black text-slate-600 hover:bg-white rounded-lg transition-all flex items-center justify-center text-xs"
                      >
                        -
                      </button>
                      <span className="w-10 text-center font-bold text-xs text-slate-800">{quantidade}</span>
                      <button 
                        onClick={() => setQuantidade(q => q + 1)}
                        className="w-8 h-8 font-black text-slate-600 hover:bg-white rounded-lg transition-all flex items-center justify-center text-xs"
                      >
                        +
                      </button>
                    </div>
                  </div>
                )}

                {/* BOTÃO ADAPTATIVO (ROXO PRO CLIENTE / CINZA BLOQUEADO PRO VENDEDOR) */}
                <button
                  onClick={handleAcaoBotao}
                  className={`w-full py-4 font-bold text-xs rounded-2xl transition-all shadow-xs flex items-center justify-center space-x-2 uppercase tracking-wider ${
                    isVendedor 
                      ? "bg-slate-200 text-slate-400 border border-slate-300/40 cursor-not-allowed hover:bg-slate-200/80" 
                      : "bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white shadow-indigo-100"
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.625.625 0 1 1-1.25 0 .625.625 0 0 1 1.25 0Zm3 0a.625.625 0 1 1-1.25 0 .625.625 0 0 1 1.25 0Zm3 0a.625.625 0 1 1-1.25 0 .625.625 0 0 1 1.25 0Z" />
                  </svg>
                  <span>{isVendedor ? "Modo Vendedor (Compra Desativada)" : "Adicionar ao Carrinho"}</span>
                </button>
                
                {isVendedor && (
                  <p className="text-[10px] text-center text-slate-400 font-medium">
                    💡 Para simular fluxos de compra no Marketplace, utilize uma conta de escopo comprador.
                  </p>
                )}
              </div>

            </div>
          </div>
        )}
      </main>

      <footer className="bg-white border-t border-slate-100 py-6 text-center text-[10px] font-bold uppercase tracking-widest text-slate-400 w-full mt-20">
        &copy; 2026 EtecMarket. Painel Integrado de Detalhes.
      </footer>
    </div>
  );
}