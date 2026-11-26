import { StyleSheet, TextInput, View } from 'react-native';
import { colors, fonts, radius, spacing } from '../theme';
import { Icon } from './Icon';

type Props = {
  value: string;
  onChangeText: (value: string) => void;
  placeholder: string;
};

export function SearchBar({ value, onChangeText, placeholder }: Props) {
  return (
    <View style={styles.box}>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.muted}
        style={styles.input}
      />
      <Icon name="search" color={colors.primary} size={18} />
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    height: 40,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.pill,
  },
  input: {
    ...fonts.regular,
    flex: 1,
    fontSize: 14,
    color: colors.text,
  },
});
