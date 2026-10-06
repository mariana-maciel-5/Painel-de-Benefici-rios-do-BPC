interface QuickLoginCardsProps {
  onQuickLogin: (email: string, senha: string) => void;
  disabled?: boolean;
}

export function QuickLoginCards({ onQuickLogin, disabled }: QuickLoginCardsProps) {
  return (
    <div className="mt-6 pt-5 border-t border-slate-700/60">
      <p className="text-xs font-semibold text-slate-400 mb-2.5 uppercase tracking-wider">
        Acesso Rápido de Demonstração (Seed):
      </p>
      <div className="space-y-2">
        <button
          type="button"
          disabled={disabled}
          onClick={() => onQuickLogin('mariana.maciel@recife.pe.gov.br', '123456')}
          className="w-full p-2.5 rounded-xl bg-slate-900/60 hover:bg-slate-900 border border-slate-700/60 text-left flex items-center justify-between group transition-all cursor-pointer disabled:opacity-50"
        >
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white">Mariana Maciel</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-900/60 text-blue-300 font-semibold border border-blue-700/50">
                Admin Geral
              </span>
            </div>
            <p className="text-[11px] text-slate-400">mariana.maciel@recife.pe.gov.br</p>
          </div>
          <span className="text-xs text-blue-400 opacity-80 group-hover:opacity-100 font-medium">Entrar →</span>
        </button>

        <button
          type="button"
          disabled={disabled}
          onClick={() => onQuickLogin('carlos.bezerra@recife.pe.gov.br', '123456')}
          className="w-full p-2.5 rounded-xl bg-slate-900/60 hover:bg-slate-900 border border-slate-700/60 text-left flex items-center justify-between group transition-all cursor-pointer disabled:opacity-50"
        >
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white">Carlos Eduardo Bezerra</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-900/60 text-emerald-300 font-semibold border border-emerald-700/50">
                Assistente Social
              </span>
            </div>
            <p className="text-[11px] text-slate-400">carlos.bezerra@recife.pe.gov.br</p>
          </div>
          <span className="text-xs text-blue-400 opacity-80 group-hover:opacity-100 font-medium">Entrar →</span>
        </button>
      </div>
    </div>
  );
}
