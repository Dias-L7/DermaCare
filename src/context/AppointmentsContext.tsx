import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import { appointments as initial, type Appointment } from '../data/appointments';

export type Review = {
    rating: number;
    text: string;
};

type AppointmentsValue = {
    appointments: Appointment[];
    /** Отзывы по id врача */
    reviews: Record<string, Review>;
    add: (data: Omit<Appointment, 'id' | 'status'>) => string;
    cancel: (id: string, reason: string) => void;
    markPaid: (id: string) => void;
    addReview: (doctorId: string, review: Review) => void;
};

const AppointmentsContext = createContext<AppointmentsValue | null>(null);

let counter = 0;

export function AppointmentsProvider({ children }: { children: ReactNode }) {
    const [appointments, setAppointments] = useState<Appointment[]>(initial);
    const [reviews, setReviews] = useState<Record<string, Review>>({});

    const value = useMemo(() => {
        const update = (id: string, patch: Partial<Appointment>) =>
            setAppointments((prev) => prev.map((item) => (item.id === id ? { ...item, ...patch } : item)));

        return {
            appointments,
            reviews,
            add: (data: Omit<Appointment, 'id' | 'status'>) => {
                counter += 1;
                const id = `b${Date.now()}-${counter}`;
                setAppointments((prev) => [...prev, { ...data, id, status: 'upcoming' }]);
                return id;
            },
            cancel: (id: string, reason: string) => update(id, { status: 'cancelled', cancelReason: reason }),
            markPaid: (id: string) => update(id, { paid: true }),
            addReview: (doctorId: string, review: Review) => setReviews((prev) => ({ ...prev, [doctorId]: review })),
        };
    }, [appointments, reviews]);

    return <AppointmentsContext.Provider value={value}>{children}</AppointmentsContext.Provider>;
}

export function useAppointments() {
    const value = useContext(AppointmentsContext);
    if (!value) {
        throw new Error('useAppointments нужно вызывать внутри AppointmentsProvider');
    }
    return value;
}