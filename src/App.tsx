/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';

export default function App() {
  const [health, setHealth] = useState<string>('Carregando...');

  useEffect(() => {
    fetch('/api/health')
      .then(res => res.json())
      .then(data => setHealth(data.message))
      .catch(err => setHealth('Erro ao conectar com a API.'));
  }, []);

  return (
    <div className="flex h-screen w-full bg-slate-50 font-sans overflow-hidden text-slate-800">
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col">
        <div className="p-6 border-b border-slate-100">
          <div className="flex items-center gap-2 text-blue-600 font-bold text-xl">
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white text-sm">B</div>
            <span>BPC Recife</span>
          </div>
          <p className="text-[10px] uppercase tracking-wider text-slate-400 mt-1 font-semibold">Gestão de Beneficiários</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          <div className="flex items-center gap-3 px-3 py-2 bg-blue-50 text-blue-700 rounded-md font-medium text-sm">
            <span className="w-4 h-4">📊</span> Dashboard
          </div>
          <div className="flex items-center gap-3 px-3 py-2 text-slate-600 hover:bg-slate-50 rounded-md text-sm cursor-pointer">
            <span className="w-4 h-4">👤</span> Usuários
          </div>
          <div className="flex items-center gap-3 px-3 py-2 text-slate-600 hover:bg-slate-50 rounded-md text-sm cursor-pointer">
            <span className="w-4 h-4">🔐</span> Papéis
          </div>
          <div className="flex items-center gap-3 px-3 py-2 text-slate-600 hover:bg-slate-50 rounded-md text-sm cursor-pointer">
            <span className="w-4 h-4">🛡️</span> Permissões
          </div>
          <div className="mt-8 pt-8 border-t border-slate-100">
            <div className="flex items-center gap-3 px-3 py-2 text-slate-500 text-xs uppercase font-bold tracking-widest">
              Sistema
            </div>
            <div className="flex items-center gap-3 px-3 py-2 text-slate-600 hover:bg-slate-50 rounded-md text-sm cursor-pointer">
              <span className="w-4 h-4">⚙️</span> Configurações
            </div>
          </div>
        </nav>
        <div className="p-4 bg-slate-50 m-4 rounded-xl border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-300 flex items-center justify-center font-bold text-slate-600">AD</div>
            <div>
              <p className="text-xs font-bold">Admin Sistema</p>
              <p className="text-[10px] text-slate-500">Sair do painel</p>
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col h-full">
        <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between">
          <h1 className="text-lg font-semibold text-slate-700">Visão Geral do Sistema</h1>
          <div className="flex items-center gap-4">
            <div className="relative">
              <input type="text" placeholder="Buscar beneficiário..." className="pl-10 pr-4 py-2 bg-slate-100 border-transparent rounded-lg text-sm w-64 focus:bg-white focus:ring-1 focus:ring-blue-500 outline-none transition-all" />
              <span className="absolute left-3 top-2.5 opacity-40">🔍</span>
            </div>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium">Novo Registro</button>
          </div>
        </header>

        <section className="p-8 space-y-6 overflow-hidden flex flex-col flex-1">
          <div className="grid grid-cols-4 gap-6">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Usuários Ativos</p>
              <h3 className="text-3xl font-bold mt-1">1.284</h3>
              <div className="mt-2 flex items-center gap-1 text-emerald-600 text-[10px] font-bold">
                <span>▲ 12%</span> <span className="text-slate-400 font-normal">este mês</span>
              </div>
            </div>
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Papéis Definidos</p>
              <h3 className="text-3xl font-bold mt-1">08</h3>
              <div className="mt-2 flex items-center gap-1 text-slate-400 text-[10px]">
                <span>Configurados via System</span>
              </div>
            </div>
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Permissões</p>
              <h3 className="text-3xl font-bold mt-1">42</h3>
              <div className="mt-2 flex items-center gap-1 text-blue-600 text-[10px] font-bold">
                <span>Acessos monitorados</span>
              </div>
            </div>
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Atividade Recente</p>
              <h3 className="text-3xl font-bold mt-1">215</h3>
              <div className="mt-2 flex items-center gap-1 text-amber-600 text-[10px] font-bold">
                <span>Pendentes de aprovação</span>
              </div>
            </div>
          </div>

          <div className="flex-1 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col min-h-0 overflow-y-auto">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h2 className="font-bold text-slate-700 uppercase text-xs tracking-widest">Status da Configuração do Backend</h2>
            </div>
            <div className="p-6">
              <div className="bg-blue-50 border border-blue-100 text-blue-800 px-4 py-3 rounded-xl mb-6">
                <p className="font-medium text-sm">Status do Backend (Fastify): {health}</p>
              </div>

              <div className="text-sm text-slate-600">
                <p className="mb-4">As seguintes entidades de banco de dados (MySQL) foram configuradas no backend com Drizzle ORM:</p>
                <div className="rounded-xl border border-slate-200 overflow-hidden">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 text-[10px] uppercase font-bold text-slate-500 border-b border-slate-100">
                      <tr>
                        <th className="px-6 py-3">Tabela</th>
                        <th className="px-6 py-3">Esquema de Colunas</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm text-slate-600">
                      <tr className="border-b border-slate-50">
                        <td className="px-6 py-4 font-medium text-slate-800">usuarios</td>
                        <td className="px-6 py-4 font-mono text-xs text-slate-500">id, nome, email, senha, ativo, data_criacao, data_atualizacao</td>
                      </tr>
                      <tr className="border-b border-slate-50">
                        <td className="px-6 py-4 font-medium text-slate-800">papeis</td>
                        <td className="px-6 py-4 font-mono text-xs text-slate-500">id, nome, descricao, data_criacao, data_atualizacao</td>
                      </tr>
                      <tr className="border-b border-slate-50">
                        <td className="px-6 py-4 font-medium text-slate-800">permissoes</td>
                        <td className="px-6 py-4 font-mono text-xs text-slate-500">id, nome, descricao, data_criacao, data_atualizacao</td>
                      </tr>
                      <tr className="border-b border-slate-50">
                        <td className="px-6 py-4 font-medium text-slate-800">usuario_papel</td>
                        <td className="px-6 py-4 font-mono text-xs text-slate-500">usuario_id, papel_id</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 font-medium text-slate-800">papel_permissao</td>
                        <td className="px-6 py-4 font-mono text-xs text-slate-500">papel_id, permissao_id</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
