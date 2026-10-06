import { RefreshCw, Users } from 'lucide-react';
import type { UsuarioItem } from '../types/usuario.types';

interface UsuarioListTableProps {
  usuarios: UsuarioItem[];
  loading: boolean;
  onRefresh: () => void;
  onRunSeed?: () => void;
}

export function UsuarioListTable({ usuarios, loading, onRefresh, onRunSeed }: UsuarioListTableProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs text-slate-500">
          Listagem obtida via requisição protegida com cabeçalho{' '}
          <code className="bg-slate-100 px-1 py-0.5 rounded text-blue-700">
            Authorization: Bearer &lt;token&gt;
          </code>.
        </p>
        <button
          onClick={onRefresh}
          disabled={loading}
          className="text-xs text-blue-600 font-semibold hover:underline flex items-center gap-1 cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} /> Atualizar
        </button>
      </div>

      {usuarios.length > 0 ? (
        <div className="rounded-xl border border-slate-200 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 text-[10px] uppercase font-bold text-slate-500 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3">ID</th>
                <th className="px-6 py-3">Nome</th>
                <th className="px-6 py-3">Email Institucional</th>
                <th className="px-6 py-3">Papel Vinculado</th>
                <th className="px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="text-sm text-slate-600 divide-y divide-slate-100">
              {usuarios.map((u) => {
                const isAtivo = Boolean(u.ativo);
                return (
                  <tr key={u.id} className="hover:bg-slate-50/70">
                    <td className="px-6 py-3.5 font-mono text-xs">{u.id}</td>
                    <td className="px-6 py-3.5 font-semibold text-slate-800">{u.nome}</td>
                    <td className="px-6 py-3.5 text-slate-600">{u.email}</td>
                    <td className="px-6 py-3.5">
                      <span className="bg-blue-50 text-blue-700 border border-blue-200/60 px-2.5 py-0.5 rounded-full text-xs font-semibold">
                        {u.papel || 'Sem papel'}
                      </span>
                    </td>
                    <td className="px-6 py-3.5">
                      <span
                        className={`inline-flex items-center gap-1.5 text-xs font-semibold ${
                          isAtivo ? 'text-emerald-700' : 'text-slate-400'
                        }`}
                      >
                        <span
                          className={`w-2 h-2 rounded-full ${
                            isAtivo ? 'bg-emerald-500' : 'bg-slate-300'
                          }`}
                        />
                        {isAtivo ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-300">
          <Users className="w-8 h-8 text-slate-400 mx-auto mb-2" />
          <p className="text-sm font-semibold text-slate-700">Nenhum usuário retornado do banco.</p>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Certifique-se de que o MySQL está em execução e sincronizado com o seed inicial.
          </p>
          {onRunSeed && (
            <button
              onClick={onRunSeed}
              className="mt-4 px-4 py-2 text-xs font-semibold rounded-lg bg-blue-600 text-white shadow-xs hover:bg-blue-500 transition-all cursor-pointer"
            >
              Popular Seed Inicial Agora
            </button>
          )}
        </div>
      )}
    </div>
  );
}
