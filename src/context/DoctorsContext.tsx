import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { fetchDoctors } from '../api/doctors';
import type { Doctor } from '../api/types';

type Status = 'loading' | 'ready' | 'error';

type DoctorsValue = {
  doctors: Doctor[];
  status: Status;
  reload: () => void;
};

const DoctorsContext = createContext<DoctorsValue | null>(null);

export function DoctorsProvider({ children }: { children: ReactNode }) {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [status, setStatus] = useState<Status>('loading');
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;
    fetchDoctors()
      .then((list) => {
        if (cancelled) return;
        setDoctors(list);
        setStatus('ready');
      })
      .catch(() => {
        if (cancelled) return;
        setStatus('error');
      });
    return () => {
      cancelled = true;
    };
  }, [attempt]);

  const value = useMemo(
    () => ({
      doctors,
      status,
      reload: () => {
        setStatus('loading');
        setAttempt((prev) => prev + 1);
      },
    }),
    [doctors, status]
  );

  return <DoctorsContext.Provider value={value}>{children}</DoctorsContext.Provider>;
}

export function useDoctors() {
  const value = useContext(DoctorsContext);
  if (!value) {
    throw new Error('useDoctors нужно вызывать внутри DoctorsProvider');
  }
  return value;
}
