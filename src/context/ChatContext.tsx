import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';

export type Message = {
    id: string;
    from: 'me' | 'doctor';
    text: string;
    time: string;
};

type ChatValue = {
    /** Сообщения по id врача */
    messages: Record<string, Message[]>;
    /** id врачей, которые сейчас «печатают» ответ */
    typing: string[];
    send: (doctorId: string, text: string, reply: string) => void;
};

const ChatContext = createContext<ChatValue | null>(null);

function now() {
    const date = new Date();
    return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
}

let counter = 0;
const nextId = () => `m${Date.now()}-${counter++}`;

export function ChatProvider({ children }: { children: ReactNode }) {
    const [messages, setMessages] = useState<Record<string, Message[]>>({});
    const [typing, setTyping] = useState<string[]>([]);
    const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

    useEffect(() => {
        const list = timers.current;
        return () => list.forEach(clearTimeout);
    }, []);

    const add = useCallback((doctorId: string, message: Message) => {
        setMessages((prev) => ({ ...prev, [doctorId]: [...(prev[doctorId] ?? []), message] }));
    }, []);

    const send = useCallback(
        (doctorId: string, text: string, reply: string) => {
            add(doctorId, { id: nextId(), from: 'me', text, time: now() });
            // Имитация ответа врача: через 1 с «печатает», через 2,5 с — ответ.
            timers.current.push(
                setTimeout(() => setTyping((prev) => [...prev, doctorId]), 1000),
                setTimeout(() => {
                    setTyping((prev) => prev.filter((id) => id !== doctorId));
                    add(doctorId, { id: nextId(), from: 'doctor', text: reply, time: now() });
                }, 2500)
            );
        },
        [add]
    );

    const value = useMemo(() => ({ messages, typing, send }), [messages, typing, send]);

    return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export function useChat() {
    const value = useContext(ChatContext);
    if (!value) {
        throw new Error('useChat нужно вызывать внутри ChatProvider');
    }
    return value;
}