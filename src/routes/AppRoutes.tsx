import { useAuthContext } from '../hooks/useAuthContext';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';
import { LoadingSpinner } from '../components/LoadingSpinner';

export function AppRoutes() {
  const { isAuthenticated, isLoading } = useAuthContext();

  if (isLoading) {
    return (
      <div className="min-h-screen w-full bg-slate-900 flex items-center justify-center">
        <LoadingSpinner text="Validando credenciais e sessão JWT..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return <DashboardPage />;
}
