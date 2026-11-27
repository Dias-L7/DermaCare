import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

export type Card = {
    id: string;
    holder: string;
    last4: string;
    expiry: string;
};

/** 'apple' | 'paypal' | 'google' или id карты */
export type PaymentMethod = string;

type PaymentValue = {
    cards: Card[];
    method: PaymentMethod;
    setMethod: (method: PaymentMethod) => void;
    addCard: (card: Omit<Card, 'id'>) => void;
};

const demoCard: Card = { id: 'card1', holder: 'DEMO USER', last4: '4242', expiry: '04/28' };

const PaymentContext = createContext<PaymentValue | null>(null);

export function PaymentProvider({ children }: { children: ReactNode }) {
    const [cards, setCards] = useState<Card[]>([demoCard]);
    const [method, setMethod] = useState<PaymentMethod>(demoCard.id);

    const value = useMemo(
        () => ({
            cards,
            method,
            setMethod,
            addCard: (card: Omit<Card, 'id'>) => {
                const id = `card${Date.now()}`;
                setCards((prev) => [...prev, { ...card, id }]);
                setMethod(id);
            },
        }),
        [cards, method]
    );

    return <PaymentContext.Provider value={value}>{children}</PaymentContext.Provider>;
}

export function usePayment() {
    const value = useContext(PaymentContext);
    if (!value) {
        throw new Error('usePayment нужно вызывать внутри PaymentProvider');
    }
    return value;
}

/** Название способа оплаты для показа на экране */
export function methodLabel(method: PaymentMethod, cards: Card[], names: { apple: string; paypal: string; google: string }) {
    if (method === 'apple' || method === 'paypal' || method === 'google') return names[method];
    const card = cards.find((item) => item.id === method);
    return card ? `•••• ${card.last4}` : '—';
}