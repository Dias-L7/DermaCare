import { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useDoctors } from '../context/DoctorsContext';
import { useLanguage } from '../context/LanguageContext';
import { useAppointments } from '../context/AppointmentsContext';
import { workHours } from '../data/appointments';
import { spacing } from '../theme';
import { getDays } from '../utils/schedule';
import { DayPicker, type DayPickerItem } from './DayPicker';
import { ScheduleCard, type ScheduleEntry } from './ScheduleCard';

export function Schedule() {
  const { t } = useLanguage();
  const { doctors } = useDoctors();
  const { appointments } = useAppointments();
  const [selected, setSelected] = useState(0);
  const days = useMemo(() => getDays(6), []);

  const pickerDays: DayPickerItem[] = days.map((day) => ({
    offset: day.offset,
    weekday: t.days.short[day.date.getDay()],
    number: day.date.getDate(),
    marked: appointments.some((item) => item.dayOffset === day.offset),
  }));

  const entries: ScheduleEntry[] = appointments
    .filter((item) => item.dayOffset === selected)
    .map((item) => {
      const doctor = doctors.find((candidate) => candidate.id === item.doctorId);
      return {
        hour: item.hour,
        title: t.topics[item.topic],
        subtitle: doctor ? `${t.home.doctorPrefix} ${doctor.name}` : '',
      };
    });

  const selectedDate = days[selected].date; const hours = [...new Set([...workHours, ...entries.map((entry) => entry.hour)])].sort((a, b) => a - b);
  const dayName = t.days.full[selectedDate.getDay()];
  const heading =
    selected === 0 ? `${dayName} · ${t.home.today}` : `${dayName}, ${selectedDate.getDate()}`;

  return (
    <View style={styles.container}>
      <DayPicker days={pickerDays} selected={selected} onSelect={setSelected} />
      <ScheduleCard
        heading={heading}
        hours={workHours}
        entries={entries}
        emptyText={t.home.noAppointments}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.md,
  },
});
