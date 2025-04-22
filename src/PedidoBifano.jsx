
import React, { useState } from 'react';

const produtos = [
  {
    categoria: 'Menus',
    itens: ['Bifana & Batata (€6,50)', 'Bifana & Sopa (€6,95)', 'Duplo 2 Bifanas (€7,95)', 'Bifana no Prato (€7,95)', 'Titoque Especial (€8,35)', 'Ti Catarina (€8,35)']
  },
  {
    categoria: 'Complementos',
    itens: ['Salada Estreada (€2,00)', 'Ovo Estrelado (€1,00)', 'Arroz Thai (€1,00)', 'Alface (€1,00)', 'Tomate (€1,00)', 'Cebola (€1,00)', 'Queijo (€1,00)', 'Diversos (€1,00)', 'Sopa (€1,00)']
  },
  {
    categoria: 'Bebidas',
    itens: ['Água 0,5L (€1,25)', 'Água com Gás (€1,50)', 'Limonada da Casa (€1,50)', 'Banda do Pomar (€1,20)', 'Compal (€1,30)', 'Cerveja Mini (€1,20)', 'Cerveja Média (€2,00)', 'Vinho da Casa (Copo) (€1,50)', 'Sangria Copo (€1,80)', 'Sangria Jarra (€5,00)', 'Coca-Cola / Zero (€1,50)', 'Ice Tea (€1,50)', 'Cervejas Diversas (€1,50)', 'Água Tónica (€1,50)', 'Café (€1,00)']
  }
];

export default function PedidoBifano() {
  const [quantidades, setQuantidades] = useState({});
  const [entrega, setEntrega] = useState('');
  const [endereco, setEndereco] = useState('');
  const [observacoes, setObservacoes] = useState('');

  const handleQuantidade = (item, delta) => {
    setQuantidades((prev) => ({
      ...prev,
      [item]: Math.max((prev[item] || 0) + delta, 0)
    }));
  };

  const calcularTotal = () => {
    let total = 0;
    for (const [item, q] of Object.entries(quantidades)) {
      const match = item.match(/\(€([0-9,.]+)\)/);
      if (match) {
        total += parseFloat(match[2].replace(',', '.')) * q;
      }
    }
    return total.toFixed(2);
  };

  const montarMensagem = () => {
    const resumo = Object.entries(quantidades)
      .filter(([_, q]) => q > 0)
      .map(([item, q]) => `${item} — ${q}x`)
      .join('%0A');

    const enderecoTexto = entrega === 'delivery' ? `%0A📍 Endereço: ${endereco}` : '';
    const obsTexto = observacoes ? `%0A📝 Observações: ${observacoes}` : '';

    const url = \`https://wa.me/553172583941?text=Pedido:%0A${resumo}%0A🚚 Entrega: ${entrega}${enderecoTexto}${obsTexto}%0A💰 Total: €${calcularTotal()}\`;
    window.open(url, '_blank');
  };

  return (
    <div className="p-4 space-y-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold">🍽️ Fazer Encomenda - Tasquinhas Bifano</h1>

      {produtos.map((categoria) => (
        <div key={categoria.categoria}>
          <h2 className="text-xl font-semibold mb-2">{categoria.categoria}</h2>
          <div className="grid gap-4">
            {categoria.itens.map((item) => (
              <div key={item} className="flex justify-between items-center border p-3 rounded">
                <span>{item}</span>
                <div className="flex items-center gap-2">
                  <button className="px-2 py-1 bg-gray-200 rounded" onClick={() => handleQuantidade(item, -1)}>-</button>
                  <span>{quantidades[item] || 0}</span>
                  <button className="px-2 py-1 bg-green-200 rounded" onClick={() => handleQuantidade(item, 1)}>+</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      <div>
        <h2 className="text-lg font-semibold">🚚 Forma de Entrega</h2>
        <select value={entrega} onChange={(e) => setEntrega(e.target.value)} className="w-full border p-2 rounded">
          <option value="">Escolhe uma opção</option>
          <option value="balcao">Retirada no Balcão</option>
          <option value="delivery">Entrega em domicílio</option>
        </select>
        {entrega === 'delivery' && (
          <input
            type="text"
            placeholder="Endereço completo"
            value={endereco}
            onChange={(e) => setEndereco(e.target.value)}
            className="w-full border mt-2 p-2 rounded"
          />
        )}
      </div>

      <div>
        <h2 className="text-lg font-semibold">📝 Observações</h2>
        <textarea
          placeholder="Ex: sem cebola, bem passada..."
          value={observacoes}
          onChange={(e) => setObservacoes(e.target.value)}
          className="w-full border p-2 rounded"
        />
      </div>

      <div>
        <h2 className="text-lg font-semibold">💰 Total: €{calcularTotal()}</h2>
      </div>

      <button
        onClick={montarMensagem}
        className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
      >
        Enviar Pedido via WhatsApp
      </button>
    </div>
  );
}
