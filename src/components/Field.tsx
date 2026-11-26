import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View, type TextInputProps } from 'react-native';
import { colors, fonts, radius, spacing } from '../theme';
import { Icon } from './Icon';

type Props = {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
  error?: string;
  secure?: boolean;
  keyboardType?: TextInputProps['keyboardType'];
  maxLength?: number;
};

export function Field({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  secure = false,
  keyboardType,
  maxLength,
}: Props) {
  const [hidden, setHidden] = useState(true);

  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.inputBox, !!error && styles.inputBoxError]}>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.muted}
          secureTextEntry={secure && hidden}
          keyboardType={keyboardType}
          maxLength={maxLength}
          autoCapitalize="none"
          autoCorrect={false}
          style={styles.input}
        />
        {secure ? (
          <Pressable onPress={() => setHidden((prev) => !prev)} hitSlop={8}>
            <Icon name={hidden ? 'eyeOff' : 'eye'} color={colors.muted} size={20} />
          </Pressable>
        ) : null}
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: spacing.md,
  },
  label: {
    ...fonts.bold,
    fontSize: 14,
    color: colors.text,
    marginBottom: spacing.sm - 2,
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 46,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.surface,
  },
  inputBoxError: {
    borderColor: colors.error,
  },
  input: {
    ...fonts.regular,
    flex: 1,
    fontSize: 14,
    color: colors.text,
  },
  error: {
    ...fonts.regular,
    fontSize: 12,
    color: colors.error,
    marginTop: spacing.xs,
  },
});
