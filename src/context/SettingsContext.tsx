import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

export type NotificationKey =
  | 'general'
  | 'sound'
  | 'soundCall'
  | 'vibrate'
  | 'offers'
  | 'payments'
  | 'promo'
  | 'cashback';

type Notifications = Record<NotificationKey, boolean>;

const initial: Notifications = {
  general: true,
  sound: true,
  soundCall: true,
  vibrate: false,
  offers: false,
  payments: true,
  promo: false,
  cashback: true,
};

type SettingsValue = {
  notifications: Notifications;
  toggleNotification: (key: NotificationKey) => void;
};

const SettingsContext = createContext<SettingsValue | null>(null);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notifications>(initial);

  const value = useMemo(
    () => ({
      notifications,
      toggleNotification: (key: NotificationKey) =>
        setNotifications((prev) => ({ ...prev, [key]: !prev[key] })),
    }),
    [notifications]
  );

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
  const value = useContext(SettingsContext);
  if (!value) {
    throw new Error('useSettings нужно вызывать внутри SettingsProvider');
  }
  return value;
}
