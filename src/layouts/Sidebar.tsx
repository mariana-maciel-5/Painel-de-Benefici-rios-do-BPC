import { ShieldCheck, Users, Shield, Layers, Key, LogOut } from 'lucide-react';
import { useAuthContext } from '../hooks/useAuthContext';
import { getUserInitials } from '../utils/formatters';
import { APP_CONFIG } from '../config/constants';

interface SidebarProps {
  activeTab: 'usuarios' | 'papeis' | 'esquema' | 'jwt';
  setActiveTab: (tab: 'usuarios' | 'papeis' | 'esquema' | 'jwt') => void;
}

export function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const { currentUser, logout } = useAuthContext();

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col">
      <div className="p-6 border-b border-slate-100">
        <div className="flex items-center gap-2.5 text-blue-600 font-bold text-xl">
          <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center text-white text-base shadow-sm shadow-blue-500/30">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="tracking-tight">{APP_CONFIG.TITLE}</span>
            <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold -mt-1">
              {APP_CONFIG.SUBTITLE}
            </p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        <div
          onClick={() => setActiveTab('usuarios')}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm cursor-pointer transition-all ${
            activeTab === 'usuarios'
              ? 'bg-blue-50 text-blue-700 font-semibold'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Users className="w-4 h-4" /> Usuários
        </div>
        <div
          onClick={() => setActiveTab('papeis')}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm cursor-pointer transition-all ${
            activeTab === 'papeis'
              ? 'bg-blue-50 text-blue-700 font-semibold'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Shield className="w-4 h-4" /> Papéis & Permissões
        </div>
        <div
          onClick={() => setActiveTab('esquema')}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm cursor-pointer transition-all ${
            activeTab === 'esquema'
              ? 'bg-blue-50 text-blue-700 font-semibold'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Layers className="w-4 h-4" /> Entidades do Banco
        </div>
        <div
          onClick={() => setActiveTab('jwt')}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm cursor-pointer transition-all ${
            activeTab === 'jwt'
              ? 'bg-blue-50 text-blue-700 font-semibold'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Key className="w-4 h-4 text-amber-500" /> Token JWT Ativo
        </div>
      </nav>

      {/* Card do Usuário Logado */}
      {currentUser && (
        <div className="p-4 bg-slate-50 m-4 rounded-xl border border-slate-200">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                {getUserInitials(currentUser.nome)}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-800 truncate">{currentUser.nome}</p>
                <p className="text-[10px] text-slate-500 truncate">{currentUser.email}</p>
              </div>
            </div>
            <button
              onClick={logout}
              title="Encerrar Sessão JWT"
              className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
          {currentUser.papeis && currentUser.papeis.length > 0 && (
            <div className="mt-1">
              <span className="inline-block bg-blue-100 text-blue-800 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                {currentUser.papeis[0]}
              </span>
            </div>
          )}
        </div>
      )}
    </aside>
  );
}
