import { useState, type FormEvent } from 'react';
import { useAuthContext } from '../../../hooks/useAuthContext';

export function useLoginForm() {
  const { login } = useAuthContext();
  const [email, setEmail] = useState<string>('mariana.maciel@recife.pe.gov.br');
  const [senha, setSenha] = useState<string>('123456');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e?: FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await login({ email, senha });
    } catch (err: any) {
      setError(err.message || 'Falha ao autenticar.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (customEmail: string, customSenha: string) => {
    setEmail(customEmail);
    setSenha(customSenha);
    setLoading(true);
    setError(null);

    try {
      await login({ email: customEmail, senha: customSenha });
    } catch (err: any) {
      setError(err.message || 'Falha ao autenticar.');
    } finally {
      setLoading(false);
    }
  };

  return {
    email,
    setEmail,
    senha,
    setSenha,
    loading,
    error,
    handleSubmit,
    handleQuickLogin,
  };
}
