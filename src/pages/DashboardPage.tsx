import { useState } from 'react';
import { Users, Shield, Layers, Key } from 'lucide-react';
import { MainLayout } from '../layouts/MainLayout';
import { StatCard } from '../components/StatCard';
import { DatabaseStatusCard } from '../features/database/components/DatabaseStatusCard';
import { SchemaEntitiesTable } from '../features/database/components/SchemaEntitiesTable';
import { UsuarioListTable } from '../features/usuarios/components/UsuarioListTable';
import { PapelListTable } from '../features/papeis/components/PapelListTable';
import { useUsuarios } from '../features/usuarios/hooks/useUsuarios';
import { usePapeis } from '../features/papeis/hooks/usePapeis';
import { useDatabaseStatus } from '../features/database/hooks/useDatabaseStatus';
import { useAuthContext } from '../hooks/useAuthContext';

export function DashboardPage() {
  const [activeTab, setActiveTab] = useState<'usuarios' | 'papeis' | 'esquema' | 'jwt'>('usuarios');
  const [tokenCopied, setTokenCopied] = useState<boolean>(false);

  const { token, currentUser } = useAuthContext();
  const { usuarios, loading: usuariosLoading, refetch: refetchUsuarios } = useUsuarios();
  const { papeis, loading: papeisLoading, refetch: refetchPapeis } = usePapeis();
  const {
    healthMessage,
    dbStatus,
    syncing,
    seeding,
    syncDatabase,
    seedDatabase,
  } = useDatabaseStatus();

  const handleSeed = async () => {
    await seedDatabase();
    await refetchUsuarios();
    await refetchPapeis();
  };

  const copyToken = () => {
    if (token) {
      navigator.clipboard.writeText(token);
      setTokenCopied(true);
      setTimeout(() => setTokenCopied(false), 2000);
    }
  };

  return (
    <MainLayout activeTab={activeTab} setActiveTab={setActiveTab}>
      {/* Cards de Métricas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Usuários no Banco"
          value={usuarios.length || '6'}
          subtitle="● Monitoramento de Acessos"
          subtitleColor="text-emerald-600"
          icon={<Users className="w-4 h-4 text-blue-500" />}
        />
        <StatCard
          title="Papéis Cadastrados"
          value={papeis.length || '5'}
          subtitle="Perfis de Controle RBAC"
          icon={<Shield className="w-4 h-4 text-indigo-500" />}
        />
        <StatCard
          title="Permissões de Sistema"
          value="8"
          subtitle="Políticas de Segurança"
          subtitleColor="text-blue-600"
          icon={<Layers className="w-4 h-4 text-emerald-500" />}
        />
        <StatCard
          title="Validade da Sessão"
          value="24h"
          subtitle="Expiração Automática JWT"
          subtitleColor="text-amber-600"
          icon={<Key className="w-4 h-4 text-amber-500" />}
        />
      </div>

      {/* Painel de Controle do Banco e Sincronização */}
      <DatabaseStatusCard
        healthMessage={healthMessage}
        dbStatus={dbStatus}
        syncing={syncing}
        seeding={seeding}
        onSync={syncDatabase}
        onSeed={handleSeed}
      />

      {/* Abas e Listagem Principal */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col min-h-0">
        <div className="p-4 border-b border-slate-200 flex items-center gap-3 overflow-x-auto">
          <button
            onClick={() => setActiveTab('usuarios')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'usuarios'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Users className="w-3.5 h-3.5" /> Usuários Autenticáveis ({usuarios.length})
          </button>
          <button
            onClick={() => setActiveTab('papeis')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'papeis'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Shield className="w-3.5 h-3.5" /> Papéis & Permissões ({papeis.length})
          </button>
          <button
            onClick={() => setActiveTab('esquema')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'esquema'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Layers className="w-3.5 h-3.5" /> Estrutura do Schema Drizzle
          </button>
          <button
            onClick={() => setActiveTab('jwt')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'jwt'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Key className="w-3.5 h-3.5 text-amber-300" /> Detalhes do Token JWT
          </button>
        </div>

        <div className="p-6">
          {activeTab === 'usuarios' && (
            <UsuarioListTable
              usuarios={usuarios}
              loading={usuariosLoading}
              onRefresh={refetchUsuarios}
              onRunSeed={handleSeed}
            />
          )}

          {activeTab === 'papeis' && (
            <PapelListTable
              papeis={papeis}
              loading={papeisLoading}
              onRefresh={refetchPapeis}
            />
          )}

          {activeTab === 'esquema' && <SchemaEntitiesTable />}

          {activeTab === 'jwt' && (
            <div className="space-y-6">
              <div className="bg-slate-900 text-white rounded-xl p-5 border border-slate-800">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Key className="w-4 h-4 text-amber-400" />
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                      JSON Web Token Atual (Codificado)
                    </span>
                  </div>
                  <button
                    onClick={copyToken}
                    className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-blue-400 transition-colors cursor-pointer"
                  >
                    {tokenCopied ? 'Copiado!' : 'Copiar Token'}
                  </button>
                </div>
                <p className="font-mono text-xs text-slate-400 break-all bg-slate-950 p-3 rounded-lg border border-slate-800/80">
                  {token}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Payload Decodificado (Claims):
                  </h4>
                  <pre className="font-mono text-xs bg-white p-3 rounded-lg border border-slate-200 text-slate-800 overflow-x-auto">
                    {JSON.stringify(currentUser, null, 2)}
                  </pre>
                </div>

                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-2">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Arquitetura e Segurança JWT:
                  </h4>
                  <ul className="text-xs text-slate-600 space-y-2 list-disc list-inside">
                    <li>
                      <strong>Modularização por Features:</strong> Serviços e hooks separados nas pastas de features específicas.
                    </li>
                    <li>
                      <strong>Cabeçalho HTTP:</strong> Todas as chamadas para rotas protegidas injetam <code>Authorization: Bearer &lt;token&gt;</code> pelo <code>apiClient</code> em <code>lib/</code>.
                    </li>
                    <li>
                      <strong>Assinatura Criptográfica:</strong> Token assinado no servidor com chave secreta <code>JWT_SECRET</code>.
                    </li>
                    <li>
                      <strong>Proteção 401:</strong> Respostas 401 limpam o estado global e redirecionam automaticamente para a página de login.
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
