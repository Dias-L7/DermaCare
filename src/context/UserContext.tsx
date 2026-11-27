import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import type { ErrorKey } from '../i18n/types';
import { isEmail, normalizePhone } from '../utils/validation';

export type User = {
  name: string;
  email: string;
  phone: string;
  birthDate: string;
  password: string;
};

type UserValue = {
  user: User | null;
  register: (data: User) => ErrorKey | null;
  login: (identifier: string, password: string) => ErrorKey | null;
  hasAccount: (identifier: string) => boolean;
  resetPassword: (identifier: string, password: string) => boolean;
  logout: () => void;
  updateProfile: (data: Omit<User, 'password'>) => void;
  changePassword: (current: string, next: string) => boolean;
  deleteAccount: () => void;
};

const demoUser: User = {
  name: 'Демо Пользователь',
  email: 'demo@dermacare.kz',
  phone: '+7 (701) 234-56-78',
  birthDate: '15/05/2000',
  password: '123456',
};

function matches(user: User, identifier: string) {
  if (isEmail(identifier)) {
    return user.email.toLowerCase() === identifier.trim().toLowerCase();
  }
  return normalizePhone(user.phone) === normalizePhone(identifier);
}

const UserContext = createContext<UserValue | null>(null);

export function UserProvider({ children }: { children: ReactNode }) {
  const [accounts, setAccounts] = useState<User[]>([demoUser]);
  const [user, setUser] = useState<User | null>(null);

  const register = useCallback(
    (data: User) => {
      // Быстрая регистрация: пустые поля заполняются демо-данными, ошибок нет.
      const filled: User = {
        name: data.name || demoUser.name,
        email: data.email || demoUser.email,
        phone: data.phone || demoUser.phone,
        birthDate: data.birthDate || demoUser.birthDate,
        password: data.password || demoUser.password,
      };
      const existing = accounts.find(
        (account) => matches(account, filled.email) || matches(account, filled.phone)
      );
      if (existing) {
        setUser(existing);
        return null;
      }
      setAccounts((prev) => [...prev, filled]);
      setUser(filled);
      return null;
    },
    [accounts]
  );

  const login = useCallback(
    (identifier: string, password: string) => {
      // Быстрый вход: пускаем всегда. Если аккаунт найден — входим в него, иначе в демо-аккаунт.
      const found = identifier.trim()
        ? accounts.find((account) => matches(account, identifier))
        : undefined;
      void password;
      setUser(found ?? demoUser);
      return null;
    },
    [accounts]
  );

  const hasAccount = useCallback(
    (identifier: string) => accounts.some((account) => matches(account, identifier)),
    [accounts]
  );

  const resetPassword = useCallback(
    (identifier: string, password: string) => {
      const found = accounts.some((account) => matches(account, identifier));
      if (!found) return false;
      setAccounts((prev) =>
        prev.map((account) => (matches(account, identifier) ? { ...account, password } : account))
      );
      return true;
    },
    [accounts]
  );

  const logout = useCallback(() => setUser(null), []);

  const updateProfile = useCallback(
    (data: Omit<User, 'password'>) => {
      if (!user) return;
      const updated: User = { ...data, password: user.password };
      setAccounts((prev) => prev.map((account) => (account === user ? updated : account)));
      setUser(updated);
    },
    [user]
  );

  const changePassword = useCallback(
    (current: string, next: string) => {
      if (!user || user.password !== current) return false;
      const updated: User = { ...user, password: next };
      setAccounts((prev) => prev.map((account) => (account === user ? updated : account)));
      setUser(updated);
      return true;
    },
    [user]
  );

  const deleteAccount = useCallback(() => {
    if (!user) return;
    setAccounts((prev) => prev.filter((account) => account !== user));
    setUser(null);
  }, [user]);

  const value = useMemo(
    () => ({
      user,
      register,
      login,
      hasAccount,
      resetPassword,
      logout,
      updateProfile,
      changePassword,
      deleteAccount,
    }),
    [user, register, login, hasAccount, resetPassword, logout, updateProfile, changePassword, deleteAccount]
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const value = useContext(UserContext);
  if (!value) {
    throw new Error('useUser нужно вызывать внутри UserProvider');
  }
  return value;
}
