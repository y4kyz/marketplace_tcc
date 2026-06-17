import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";

export default function DashboardVendedor() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mapeia o nome do vendedor varrendo todas as chaves possíveis vindas do JWT decodificado
  const nomeExibicao = user?.nome || user?.userName || user?.usuario?.nome || user?.login || localStorage.getItem("@MinhaLoja:userName") || "4kyzvendas";
  const idExibicao = user?.id || user?.sub || user?.usuario?.id || localStorage.getItem("@MinhaLoja:userId") || "5";

  async function carregarProdutosDoVendedor() {
    try {
      setLoading(true);
      const tokenSistema = localStorage.getItem("@MinhaLoja:token");

      const response = await api.get("/produtos", {
        headers: {
          "Authorization": `Bearer ${tokenSistema}`
        }
      });

      const listaProdutos = response.data?.produtos;
      
      if (Array.isArray(listaProdutos)) {
        // Filtra estritamente os produtos pertencentes ao ID do vendedor ativo
        const meusProdutos = listaProdutos.filter(p => {
          return Number(p.vendedor_id) === Number(idExibicao);
        });
        setProdutos(meusProdutos);
      }
    } catch (err) {
      console.error("Erro ao sincronizar produtos com o MariaDB:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (idExibicao || localStorage.getItem("@MinhaLoja:token")) {
      carregarProdutosDoVendedor();
    }
  }, [user]);

  async function handleDeletarProduto(id) {
    const confirmar = window.confirm("Deseja realmente remover este produto permanentemente do catálogo?");
    if (!confirmar) return;

    try {
      const tokenSistema = localStorage.getItem("@MinhaLoja:token");
      await api.delete(`/produtos/${id}`, {
        headers: {
          "Authorization": `Bearer ${tokenSistema}`
        }
      });
      
      alert("Produto removido com sucesso!");
      carregarProdutosDoVendedor();
    } catch (err) {
      console.error("Erro ao deletar produto:", err);
      alert("Erro ao tentar remover o produto.");
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-12">
      
      {/* CABEÇALHO */}
      <div className="bg-white border-b border-slate-100 py-6 px-4 sm:px-6 lg:px-8 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <span className="text-xs font-black text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md uppercase tracking-wider">
              Gerenciamento Corporativo
            </span>
            <h1 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight mt-2">
              👋 Olá, <span className="text-indigo-600 font-mono select-all">{nomeExibicao}</span>!
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Bem-vindo ao seu painel. Gerencie seu estoque e publicações em tempo real.
            </p>
          </div>
          
          <button
            onClick={() => navigate("/novo-produto")}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-5 py-3.5 rounded-xl shadow-md shadow-indigo-100 transition-all flex items-center gap-2 uppercase tracking-wider"
          >
            ➕ Cadastrar Novo Produto
          </button>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        
        {/* INDICADORES */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-xs">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Seus Itens Ativos</span>
            <strong className="block text-2xl font-black text-slate-800 mt-1">{produtos.length}</strong>
          </div>
          
          <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-xs">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Status da Loja</span>
            <strong className="block text-xl font-black text-indigo-600 mt-1.5 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-indigo-500 inline-block animate-pulse"></span>
              Online / Ativa
            </strong>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-xs sm:col-span-2 lg:col-span-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Seu ID de Vendedor</span>
            <strong className="block text-2xl font-black text-slate-700 mt-1 font-mono">#{idExibicao}</strong>
          </div>
        </div>

        {/* TABELA DE PRODUTOS */}
        <div className="bg-white rounded-3xl border border-slate-200/60 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">
              Produtos no seu Catálogo
            </h3>
            <span className="text-xs font-bold bg-slate-100 text-slate-500 px-2.5 py-1 rounded-full">
              {produtos.length} exibidos
            </span>
          </div>
          
          {loading ? (
            <div className="flex flex-col items-center py-12 justify-center gap-2">
              <div className="animate-spin rounded-full h-6 w-6 border-2 border-indigo-600 border-t-transparent"></div>
              <p className="text-xs text-slate-400 font-medium">Lendo dados do MariaDB...</p>
            </div>
          ) : produtos.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-slate-200 rounded-2xl p-6">
              <p className="text-sm text-slate-400">Nenhum produto cadastrado para o seu ID.</p>
              <button 
                onClick={() => navigate("/novo-produto")}
                className="text-xs text-indigo-600 font-bold mt-2 hover:underline"
              >
                Clique aqui para cadastrar seu primeiro item
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 text-xs font-bold uppercase tracking-wider">
                    <th className="pb-3 font-semibold">Produto</th>
                    <th className="pb-3 font-semibold">Cód. ID</th>
                    <th className="pb-3 font-semibold">Estoque</th>
                    <th className="pb-3 font-semibold">Preço Un.</th>
                    <th className="pb-3 font-semibold text-center">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {produtos.map((prod) => (
                    <tr key={prod.id} className="group hover:bg-slate-50/50 transition-colors">
                      <td className="py-3.5 flex items-center space-x-3">
                        <div className="w-10 h-10 bg-slate-50 border border-slate-100 rounded-xl overflow-hidden flex items-center justify-center flex-shrink-0">
                          <img 
                            src={prod.imagem ? `http://localhost:3000/uploads/${prod.imagem}` : "https://via.placeholder.com/40?text=Sem+Foto"} 
                            alt={prod.nome} 
                            className="object-cover h-full w-full"
                            onError={(e) => {
                              // Se quebrar a URL principal por inconsistência de caminhos, aponta para a pasta padrão estática
                              e.target.src = `http://localhost:3000/uploads/produtos/${prod.imagem}`;
                            }}
                          />
                        </div>
                        <div>
                          <span className="text-sm font-bold text-slate-800 group-hover:text-indigo-600 transition-colors line-clamp-1">
                            {prod.nome}
                          </span>
                          <span className="text-[10px] bg-indigo-50 text-indigo-600 font-bold px-2 py-0.5 rounded mt-0.5 inline-block capitalize">
                            {prod.categoria || "Geral"}
                          </span>
                        </div>
                      </td>
                      
                      <td className="py-3.5 text-xs text-slate-400 font-mono">
                        #{prod.id}
                      </td>

                      <td className="py-3.5 text-sm text-slate-600 font-medium">
                        {prod.estoque} un.
                      </td>
                      
                      <td className="py-3.5 text-sm font-black text-slate-900">
                        R$ {Number(prod.preco).toFixed(2).replace(".", ",")}
                      </td>

                      {/* COLUNA DE AÇÕES ROXAS */}
                      <td className="py-3.5 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => navigate(`/produto/${prod.id}`)}
                            title="Visualizar Produto"
                            className="p-2 text-indigo-400 hover:text-indigo-700 hover:bg-indigo-50 rounded-xl transition-all font-bold text-sm"
                          >
                            👁️ Espiar
                          </button>
                          <button
                            onClick={() => handleDeletarProduto(prod.id)}
                            title="Excluir do Banco"
                            className="p-2 text-rose-400 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition-all font-bold text-sm"
                          >
                            🗑️ Excluir
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}