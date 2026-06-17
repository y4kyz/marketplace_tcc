import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";

export default function NovoProduto() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  // Estados do formulário
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [preco, setPreco] = useState("");
  const [estoque, setEstoque] = useState(10);
  const [categoriaId, setCategoriaId] = useState("1");
  const [imagem, setImagem] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const [loading, setLoading] = useState(false);
  const [cadastroSucesso, setCadastroSucesso] = useState(false);

  // Preview da imagem
  useEffect(() => {
    if (!imagem) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(imagem);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [imagem]);

  function handleLimparFormulario() {
    setNome("");
    setDescricao("");
    setPreco("");
    setEstoque(10);
    setCategoriaId("1");
    setImagem(null);
    setPreviewUrl(null);
    setCadastroSucesso(false);
  }

  const incrementarEstoque = () => setEstoque(prev => prev + 1);
  const decrementarEstoque = () => setEstoque(prev => (prev > 0 ? prev - 1 : 0));

  async function handleCadastrar(e) {
    e.preventDefault();
    setLoading(true);

    // 🔍 Fallback Inteligente de ID: se o Context demorar, tenta ler do localStorage
    const idVendedorReal = user?.id || user?.usuario?.id || localStorage.getItem("@MinhaLoja:userId");

    if (!idVendedorReal) {
      alert("Erro de Autenticação: ID do vendedor não foi localizado no Contexto nem no LocalStorage. Por favor, refaça o login.");
      setLoading(false);
      navigate("/login");
      return;
    }

    const formData = new FormData();
    formData.append("nome", nome.trim());
    formData.append("descricao", descricao.trim());
    formData.append("preco", preco);
    formData.append("estoque", estoque);
    formData.append("categoria_id", categoriaId);
    formData.append("vendedor_id", idVendedorReal); // Garante a gravação com o ID estrito

    if (imagem) {
      formData.append("imagem", imagem);
    }

    try {
      const tokenSistema = localStorage.getItem("@MinhaLoja:token");

      if (!tokenSistema) {
        alert("Sessão expirada ou usuário não autenticado. Faça login novamente.");
        navigate("/login");
        return;
      }

      await api.post("/produtos", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "Authorization": `Bearer ${tokenSistema}`
        },
      });

      setCadastroSucesso(true);
    } catch (err) {
      console.error("Erro retornado pelo servidor:", err.response?.data || err);

      if (err.response?.status === 401 || err.response?.status === 403) {
        alert("Sua sessão expirou ou você não tem permissão. Faça login novamente.");
        navigate("/login");
        return;
      }

      if (err.response?.data?.detalhes) {
        alert(`Erro de Validação:\n- ${err.response.data.detalhes.join('\n- ')}`);
      } else {
        const mensagemErro = err.response?.data?.erro || err.response?.data?.mensagem || "Falha ao cadastrar produto.";
        alert(`Erro ${err.response?.status}: ${mensagemErro}`);
      }
    } finally {
      setLoading(false);
    }
  }

  if (cadastroSucesso) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl border border-slate-100 shadow-xl p-8 max-w-md w-full text-center space-y-6">
          <div className="mx-auto w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-8 h-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900">Produto Publicado!</h1>
            <p className="text-sm text-slate-500 mt-2">O item foi adicionado dinamicamente ao MariaDB.</p>
          </div>
          <div className="flex flex-col gap-3 pt-2">
            <button onClick={handleLimparFormulario} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl shadow-md transition-all text-sm">
              🔄 Cadastrar Outro Produto
            </button>
            <button onClick={() => navigate("/dashboard-vendedor")} className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-3 rounded-xl transition-all text-sm">
              📊 Ir para o Painel Geral
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <main className="max-w-2xl mx-auto px-4 py-12">
        <button onClick={() => navigate(-1)} className="flex items-center text-sm font-medium text-slate-500 hover:text-indigo-600 mb-6 transition-colors">
          ← Voltar para o painel
        </button>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 md:p-8">
          <h1 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">Cadastrar Novo Produto</h1>
          <p className="text-sm text-slate-500 mb-8">Preencha as informações para alimentar o banco de dados dinamicamente.</p>

          <form onSubmit={handleCadastrar} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Nome do Produto</label>
              <input type="text" placeholder="Ex: Monitor Gamer 24' IPS" value={nome} onChange={(e) => setNome(e.target.value)} required className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-indigo-600" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Preço (R$)</label>
                <input type="number" step="0.01" placeholder="0.00" value={preco} onChange={(e) => setPreco(e.target.value)} required className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-indigo-600" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Estoque</label>
                <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50 overflow-hidden h-[46px]">
                  <button type="button" onClick={decrementarEstoque} className="px-3 h-full hover:bg-slate-200 font-bold">-</button>
                  <input type="number" value={estoque} readOnly className="w-full bg-transparent text-center font-bold text-sm outline-none" />
                  <button type="button" onClick={incrementarEstoque} className="px-3 h-full hover:bg-slate-200 font-bold">+</button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Categoria</label>
                <select
                  value={categoriaId}
                  onChange={(e) => setCategoriaId(e.target.value)}
                  className="w-full h-[46px] px-3 rounded-xl border border-slate-200 bg-white text-sm outline-none cursor-pointer font-medium text-slate-700 focus:border-indigo-600"
                >
                  <option value="1">Eletrônicos</option>
                  <option value="2">Eletrodomésticos</option>
                  <option value="3">Moda & Vestuário</option>
                  <option value="4">Esportes & Lazer</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Descrição Detalhada</label>
              <textarea rows="3" placeholder="Insira as especificações técnicas..." value={descricao} onChange={(e) => setDescricao(e.target.value)} required className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-indigo-600 resize-none" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Imagem do Produto</label>
              <div className="w-full border-2 border-dashed border-slate-200 rounded-xl p-4 text-center relative flex flex-col items-center justify-center min-h-[140px]">
                <input type="file" accept="image/*" onChange={(e) => setImagem(e.target.files[0])} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                {previewUrl ? (
                  <div className="space-y-2">
                    <img src={previewUrl} alt="Preview" className="h-24 w-auto object-cover rounded-lg mx-auto" />
                    <span className="text-indigo-600 font-semibold text-xs block truncate max-w-xs">📂 {imagem.name}</span>
                  </div>
                ) : (
                  <div className="text-slate-500 text-sm">
                    <p className="font-medium text-indigo-600">Clique para selecionar a imagem</p>
                  </div>
                )}
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl shadow-md transition-all text-sm disabled:opacity-50 flex items-center justify-center">
              {loading ? "Salvando no Banco..." : "Salvar e Publicar Produto"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}