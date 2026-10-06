import { useState, useEffect, useCallback } from 'react';
import type { DatabaseStatus } from '../types/database.types';
import { databaseService } from '../services/databaseService';

export function useDatabaseStatus() {
  const [healthMessage, setHealthMessage] = useState<string>('Carregando...');
  const [dbStatus, setDbStatus] = useState<DatabaseStatus | null>(null);
  const [syncing, setSyncing] = useState<boolean>(false);
  const [seeding, setSeeding] = useState<boolean>(false);

  const fetchHealth = useCallback(async () => {
    try {
      const res = await databaseService.getHealth();
      setHealthMessage(res.message);
      if (res.banco_de_dados) {
        setDbStatus(res.banco_de_dados);
      }
    } catch {
      setHealthMessage('Erro ao verificar saúde do backend.');
    }
  }, []);

  useEffect(() => {
    fetchHealth();
  }, [fetchHealth]);

  const syncDatabase = async () => {
    setSyncing(true);
    try {
      const res = await databaseService.initDatabase();
      setDbStatus(res);
      await fetchHealth();
      return res;
    } catch (err: any) {
      const errorStatus = { success: false, message: err.message || 'Falha na sincronização.' };
      setDbStatus(errorStatus);
      return errorStatus;
    } finally {
      setSyncing(false);
    }
  };

  const seedDatabase = async () => {
    setSeeding(true);
    try {
      const res = await databaseService.runSeed();
      setDbStatus(res);
      await fetchHealth();
      return res;
    } catch (err: any) {
      const errorStatus = { success: false, message: err.message || 'Falha no seed.' };
      setDbStatus(errorStatus);
      return errorStatus;
    } finally {
      setSeeding(false);
    }
  };

  return {
    healthMessage,
    dbStatus,
    syncing,
    seeding,
    fetchHealth,
    syncDatabase,
    seedDatabase,
  };
}
