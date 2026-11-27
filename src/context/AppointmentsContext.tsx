import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import { appointments as initial, type Appointment } from '../data/appointments';

type AppointmentsValue = {
    appointments: Appointment[];
    add: (data: Omit<Appointment, 'id'>) => string;
    cancel: (id: string) => void;
};

const AppointmentsContext = createContext<AppointmentsValue | null>(null);

let counter = 0;

export function AppointmentsProvider({ children }: { children: ReactNode }) {
    const [appointments, setAppointments] = useState<Appointment[]>(initial);

    const value = useMemo(
        () => ({
            appointments,
            add: (data: Omit<Appointment, 'id'>) => {
                counter += 1;
                const id = `b${Date.now()}-${counter}`;
                setAppointments((prev) => [...prev, { ...data, id }]);
                return id;
            },
            cancel: (id: string) => setAppointments((prev) => prev.filter((item) => item.id !== id)),
        }),
        [appointments]
    );

    return <AppointmentsContext.Provider value={value}>{children}</AppointmentsContext.Provider>;
}

export function useAppointments() {
    const value = useContext(AppointmentsContext);
    if (!value) {
        throw new Error('useAppointments нужно вызывать внутри AppointmentsProvider');
    }
    return value;
}