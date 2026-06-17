import { useState } from "react";
import { useNavigate } from "react-router-dom";


export default function Carrinho() {
  const navigate = useNavigate();
  
  // Simulando itens no carrinho. Depois você pode conectar com seu Context ou State real
  const [itens, setItens] = useState([
    {
      id: 1,
      nome: "Produto Exemplo Teste",
      preco: 100.00,
      quantidade: 1,
      imagem: null
    }
  ]);

  const subtotal = itens.reduce((acc, item) => acc + (item.preco * item.quantidade), 0);
  const frete = subtotal > 0 ? 15.00 : 0;
  const total = subtotal + frete;

  function removerItem(id) {
    setItens(itens.filter(item => item.id !== id));
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-black tracking-tight text-slate-900 mb-8">
          Seu Carrinho
        </h1>

        {itens.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-100 p-8 shadow-sm">
            <p className="text-slate-500 text-lg mb-6">Seu carrinho está vazio.</p>
            <button 
              onClick={() => navigate("/")}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
            >
              Continuar Comprando
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Lista de Itens */}
            <div className="lg:col-span-2 space-y-4">
              {itens.map((item) => (
                <div key={item.id} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between gap-4">
                  <img 
                    src={item.imagem ? `http://localhost:3000/uploads/${item.imagem}` : "https://via.placeholder.com/100"} 
                    alt={item.nome} 
                    className="w-20 h-20 object-cover rounded-xl bg-slate-50 border"
                  />
                  
                  <div className="flex-grow">
                    <h3 className="font-bold text-slate-800 text-base md:text-lg line-clamp-1">{item.nome}</h3>
                    <p className="text-sm text-slate-400 mt-0.5">Qtd: {item.quantidade}</p>
                    <span className="font-extrabold text-slate-900 block mt-1">
                      R$ {Number(item.preco).toFixed(2).replace(".", ",")}
                    </span>
                  </div>

                  <button 
                    onClick={() => removerItem(item.id)}
                    className="p-2 text-slate-400 hover:text-red-500 rounded-xl hover:bg-red-50 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>

            {/* Resumo do Pedido */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm h-fit space-y-6">
              <h2 className="text-xl font-bold text-slate-800 pb-4 border-b">Resumo da Compra</h2>
              
              <div className="space-y-3 text-sm font-medium text-slate-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-slate-900">R$ {subtotal.toFixed(2).replace(".", ",")}</span>
                </div>
                <div className="flex justify-between">
                  <span>Frete</span>
                  <span className="text-slate-900">R$ {frete.toFixed(2).replace(".", ",")}</span>
                </div>
                <div className="flex justify-between text-base font-bold text-slate-900 pt-3 border-t">
                  <span>Total</span>
                  <span className="text-indigo-600 text-xl">R$ {total.toFixed(2).replace(".", ",")}</span>
                </div>
              </div>

              <button 
                onClick={() => alert("Integração de checkout simulada!")}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 px-4 rounded-xl shadow-md transition-colors text-center block text-sm"
              >
                Finalizar Compra
              </button>
            </div>

          </div>
        )}
      </main>
    </div>
  );
}