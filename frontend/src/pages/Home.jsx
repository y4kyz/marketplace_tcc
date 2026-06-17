import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function Home() {
  const navigate = useNavigate();
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Estados da Busca Inteligente
  const [termoBusca, setTermoBusca] = useState("");
  const [sugestoes, setSugestoes] = useState([]);

  // Estado do Carrossel de Novidades
  const [indexCarrossel, setIndexCarrossel] = useState(0);

  useEffect(() => {
    buscarProdutos();
  }, []);

  // Efeito para rodar o carrossel sozinho a cada 5 segundos
  useEffect(() => {
    if (produtos.length === 0) return;
    const interval = setInterval(() => {
      setIndexCarrossel((prevIndex) => (prevIndex + 1) % Math.min(produtos.length, 3));
    }, 5000);
    return () => clearInterval(interval);
  }, [produtos]);

  async function buscarProdutos() {
    try {
      const response = await api.get("/produtos");
      const dadosBrutos = response.data.produtos || response.data;
      
      // Filtro corrigido e seguro
      const apenasAtivos = Array.isArray(dadosBrutos)
        ? dadosBrutos.filter(p => p.ativo === undefined || p.ativo === null || Number(p.ativo) === 1)
        : [];

      setProdutos(apenasAtivos);
    } catch (err) {
      console.error("Erro ao buscar produtos:", err);
    } finally {
      setLoading(false);
    }
  }

  // Manipula a digitação na busca para gerar o auto-complete
  function handleDigitacaoBusca(e) {
    const valor = e.target.value;
    setTermoBusca(valor);

    if (valor.trim() === "") {
      setSugestoes([]);
      return;
    }

    // Filtra sugestões baseadas no nome do produto cadastrado
    const filtrados = produtos.filter((p) =>
      p.nome.toLowerCase().includes(valor.toLowerCase())
    );
    setSugestoes(filtrados);
  }

  // Pega os 3 produtos mais novos para o Carrossel de Novidades
  const novidadesDaSemana = produtos.slice(-3).reverse();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between">
      
      <div>
        {/* BANNER PRINCIPAL COM BUSCA INTELIGENTE */}
        <div className="relative bg-gradient-to-r from-indigo-700 to-violet-800 text-white py-16 px-6 text-center shadow-inner">
          <div className="max-w-3xl mx-auto z-10 relative">
            <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
              EtecMarket
            </h1>
            <p className="text-indigo-100 text-lg md:text-xl font-light max-w-xl mx-auto mb-8">
              Solução prática e integrada para a gestão e comércio de produtos desenvolvidos em ambiente acadêmico.
            </p>

            {/* Input da Barra de Busca Inteligente */}
            <div className="max-w-xl mx-auto relative">
              <div className="flex items-center bg-white rounded-2xl shadow-lg px-4 py-1 border border-slate-200">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 text-slate-400 mr-2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.604 10.604Z" />
                </svg>
                <input
                  type="text"
                  placeholder="Buscar produtos cadastrados na loja..."
                  value={termoBusca}
                  onChange={handleDigitacaoBusca}
                  className="w-full py-3 bg-transparent text-slate-800 font-medium placeholder-slate-400 focus:outline-none text-sm"
                />
              </div>

              {/* Caixa Suspensa do Auto-complete */}
              {sugestoes.length > 0 && (
                <div className="absolute left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-slate-100 overflow-hidden z-50 text-left max-h-60 overflow-y-auto">
                  <div className="p-2 text-xs font-semibold text-slate-400 bg-slate-50 border-b border-slate-100">
                    Recomendações de busca:
                  </div>
                  {sugestoes.map((produto) => (
                    <div
                      key={produto.id}
                      onClick={() => {
                        setTermoBusca("");
                        setSugestoes([]);
                        navigate(`/produto/${produto.id}`);
                      }}
                      className="px-4 py-3 hover:bg-indigo-50/60 cursor-pointer flex items-center justify-between transition-colors border-b border-slate-50 last:border-0"
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-slate-700 font-medium text-sm">{produto.nome}</span>
                      </div>
                      <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md">
                        R$ {Number(produto.preco).toFixed(2).replace(".", ",")}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* REGUA DE BENEFÍCIOS */}
        <div className="bg-white border-b border-slate-200 py-6 px-4">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4 px-4 justify-center">
              <span className="p-3 rounded-xl bg-indigo-50 text-indigo-600">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" />
                </svg>
              </span>
              <div>
                <h4 className="font-bold text-slate-800 text-sm">Parcelamento Facilitado</h4>
                <p className="text-xs text-slate-400 mt-0.5">Simulação de pagamento em até 12x no cartão</p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4 px-4 justify-center border-y md:border-y-0 md:border-x border-slate-100 py-4 md:py-0">
              <span className="p-3 rounded-xl bg-indigo-50 text-indigo-600">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.129-1.125V11.25c0-.446-.26-.846-.662-1.026l-3.992-1.799a1.126 1.126 0 0 0-1.128.018l-1.417.852m6.143 3.23a1.125 1.125 0 0 0-1.125-1.125H5.375m14.25 0M16.5 18.75h-2.25m0 0V11.25c0-.621-.504-1.125-1.125-1.125h-3.375a1.125 1.125 0 0 0-1.125 1.125v7.5m3.25 0H10.5" />
                </svg>
              </span>
              <div>
                <h4 className="font-bold text-slate-800 text-sm">Entrega Expressa</h4>
                <p className="text-xs text-slate-400 mt-0.5">Logística integrada e monitoramento de pedidos</p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4 px-4 justify-center">
              <span className="p-3 rounded-xl bg-indigo-50 text-indigo-600">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.751A11.956 11.956 0 0 1 12 2.584Z" />
                </svg>
              </span>
              <div>
                <h4 className="font-bold text-slate-800 text-sm">Ambiente Seguro</h4>
                <p className="text-xs text-slate-400 mt-0.5">Criptografia e integridade de dados garantidas</p>
              </div>
            </div>
          </div>
        </div>

        {/* CARROSSEL DE NOVIDADES */}
        {!loading && novidadesDaSemana.length > 0 && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
            <h2 className="text-xl font-black text-slate-800 tracking-tight mb-4 flex items-center">
              <span className="h-2 w-2 rounded-full bg-emerald-500 mr-2 animate-pulse"></span>
              Novidades da Semana
            </h2>
            <div 
              onClick={() => navigate(`/produto/${novidadesDaSemana[indexCarrossel]?.id}`)}
              className="relative rounded-2xl h-64 md:h-80 overflow-hidden bg-slate-900 text-white cursor-pointer group shadow-md"
            >
              {novidadesDaSemana[indexCarrossel]?.imagem ? (
                <img
                  src={`http://localhost:3000/uploads/${novidadesDaSemana[indexCarrossel]?.imagem}`}
                  alt="Banner Novidade"
                  className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:scale-101 transition-transform duration-700"
                  onError={(e) => {
                    // Tenta o caminho secundário caso o backend salve na subpasta /produtos/
                    e.target.onerror = null; 
                    e.target.src = `http://localhost:3000/uploads/produtos/${novidadesDaSemana[indexCarrossel]?.imagem}`;
                  }}
                />
              ) : (
                <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-indigo-900 to-slate-800 opacity-40 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-indigo-400">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1  1-.75 0 .375.375 0 0  1 .75 0Z" />
                  </svg>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent flex flex-col justify-end p-6 md:p-10">
                <span className="bg-indigo-600 text-white text-xs font-bold uppercase tracking-widest px-2.5 py-1 rounded-md w-max mb-2">
                  Lançamento
                </span>
                <h3 className="text-2xl md:text-3xl font-black mb-2 tracking-tight">
                  {novidadesDaSemana[indexCarrossel]?.nome}
                </h3>
                <p className="text-sm text-slate-200 max-w-xl font-light line-clamp-2">
                  {novidadesDaSemana[indexCarrossel]?.descricao || "Confira os detalhes deste novo produto disponível na loja!"}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* CONTAINER DA VITRINE */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-between mb-8 border-b border-slate-200 pb-5">
            <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
              Produtos em Destaque
            </h2>
            <span className="text-sm font-medium text-slate-500 bg-slate-200/60 px-3 py-1 rounded-full">
              {produtos.length} {produtos.length === 1 ? 'item disponível' : 'itens disponíveis'}
            </span>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
              <p className="text-slate-500 font-medium">Buscando produtos...</p>
            </div>
          ) : produtos.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300 p-8">
              <p className="text-slate-500 text-lg">Nenhum produto cadastrado no momento.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {produtos.map((produto) => {
                const precoFormatado = Number(produto.preco).toFixed(2).replace(".", ",");
                
                return (
                  <div
                    key={produto.id}
                    onClick={() => navigate(`/produto/${produto.id}`)}
                    className="group bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col h-full"
                  >
                    <div className="relative overflow-hidden aspect-video bg-slate-100 flex items-center justify-center">
                      {produto.imagem ? (
                        <img
                          src={`http://localhost:3000/uploads/${produto.imagem}`}
                          alt={produto.nome}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = `http://localhost:3000/uploads/produtos/${produto.imagem}`;
                          }}
                        />
                      ) : (
                        <div className="w-full h-full bg-slate-200 flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.2} stroke="currentColor" className="w-10 h-10 text-slate-400">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1  1-.75 0 .375.375 0 0  1 .75 0Z" />
                          </svg>
                        </div>
                      )}
                    </div>

                    <div className="p-5 flex flex-col flex-grow">
                      <h3 className="text-lg font-bold text-slate-800 group-hover:text-indigo-600 transition-colors line-clamp-1 mb-2">
                        {produto.nome}
                      </h3>
                      <p className="text-sm text-slate-500 line-clamp-2 mb-4 flex-grow">
                        {produto.descricao || "Sem descrição disponível."}
                      </p>
                      <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-auto">
                        <div className="flex flex-col">
                          <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Preço</span>
                          <strong className="text-xl font-extrabold text-slate-900">
                            R$ {precoFormatado}
                          </strong>
                        </div>
                        <span className="bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white p-2 rounded-xl transition-colors duration-300">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                          </svg>
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>

      {/* FOOTER */}
      <footer className="bg-white border-t border-slate-200 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <span className="text-lg font-black text-slate-900 tracking-tight">
              ETEC<span className="text-indigo-600">MARKET</span>
            </span>
            <p className="text-xs text-slate-400 mt-2 max-w-xs leading-relaxed">
              O marketplace ideal para o seu projeto de conclusão de curso. Desenvolvido com uma stack robusta envolvendo React, Tailwind CSS e banco de dados MariaDB.
            </p>
          </div>
          <div>
            <h5 className="font-bold text-slate-800 text-sm mb-3">Formas de Pagamento</h5>
            <div className="flex gap-2 opacity-60">
              <span className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2 py-1 rounded">VISA</span>
              <span className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2 py-1 rounded">MASTERCARD</span>
              <span className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2 py-1 rounded">PIX</span>
              <span className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2 py-1 rounded">BOLETO</span>
            </div>
          </div>
          <div>
            <h5 className="font-bold text-slate-800 text-sm mb-2">Suporte do Sistema</h5>
            <p className="text-xs text-slate-400">Dúvidas com a integração da API ou banco de dados? Entre em contato com a nossa equipe técnica.</p>
            <p className="text-xs font-semibold text-indigo-600 mt-1">suporte@etecmarket.com</p>
          </div>
        </div>
        <div className="bg-slate-50 border-t border-slate-100 py-4 text-center text-xs text-slate-400">
          &copy; 2026 EtecMarket. Todos os direitos reservados. Projeto Acadêmico.
        </div>
      </footer>

    </div>
  );
}