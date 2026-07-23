import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import { initDatabase, subscribeDb } from '@/db/database';
import * as repo from '@/db/repositories';
import type { Product, Syrup, SyrupSummary } from '@/types/vtc';

type DbState = {
  ready: boolean;
  error: string | null;
  products: Product[];
  syrups: Syrup[];
  syrupSummaries: SyrupSummary[];
  refresh: () => void;
};

const DataContext = createContext<DbState | null>(null);

export function useVtcData(): DbState {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [syrups, setSyrups] = useState<Syrup[]>([]);
  const [syrupSummaries, setSyrupSummaries] = useState<SyrupSummary[]>([]);
  const [tick, setTick] = useState(0);

  const refresh = () => setTick((t) => t + 1);

  useEffect(() => {
    let cancelled = false;

    initDatabase()
      .then(() => {
        if (!cancelled) {
          setReady(true);
          setError(null);
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : 'Error al iniciar la base de datos',
          );
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => subscribeDb(refresh), []);

  useEffect(() => {
    if (!ready) return;
    try {
      setProducts(repo.listProducts());
      setSyrups(repo.listSyrups());
      setSyrupSummaries(repo.listSyrupSummaries());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al leer datos');
    }
  }, [ready, tick]);

  return { ready, error, products, syrups, syrupSummaries, refresh };
}

export function DbGate({ children }: { children: ReactNode }) {
  const data = useVtcData();

  if (data.error) {
    return (
      <div className="error-screen">
        <div>
          <h1>No se pudo iniciar VTC</h1>
          <p>{data.error}</p>
        </div>
      </div>
    );
  }

  if (!data.ready) {
    return (
      <div className="loading-screen">
        <div>
          <h1>VTC Caral</h1>
          <p>Cargando base de datos local…</p>
        </div>
      </div>
    );
  }

  return <DataContext.Provider value={data}>{children}</DataContext.Provider>;
}

export function useData(): DbState {
  const ctx = useContext(DataContext);
  if (!ctx) {
    throw new Error('useData debe usarse dentro de DbGate');
  }
  return ctx;
}
