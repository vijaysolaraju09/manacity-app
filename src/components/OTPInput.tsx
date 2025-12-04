import React, { useEffect, useRef } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { useTheme } from '../context/ThemeContext';

interface Props {
  value: string;
  onChange: (val: string) => void;
  length?: number;
}

const OTPInput: React.FC<Props> = ({ value, onChange, length = 6 }) => {
  const theme = useTheme();
  const inputs = useRef<TextInput[]>([]);

  useEffect(() => {
    const idx = value.length;
    inputs.current[idx]?.focus();
  }, [value]);

  const handleChange = (text: string, index: number) => {
    const sanitized = text.replace(/\D/g, '').slice(0, 1);
    const next = value.split('');
    next[index] = sanitized;
    const joined = next.join('').slice(0, length);
    onChange(joined);
    if (sanitized && index < length - 1) {
      inputs.current[index + 1]?.focus();
    }
  };

  return (
    <View style={styles.container}>
      {Array.from({ length }).map((_, index) => (
        <TextInput
          key={index}
          ref={(ref) => {
            if (ref) inputs.current[index] = ref;
          }}
          keyboardType="number-pad"
          value={value[index] ?? ''}
          onChangeText={(text) => handleChange(text, index)}
          maxLength={1}
          style={[
            styles.box,
            {
              borderColor: theme.colors.border,
              backgroundColor: theme.colors.card,
              color: theme.colors.text,
            },
          ]}
          returnKeyType="next"
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'center',
    marginVertical: 12,
  },
  box: {
    width: 48,
    height: 58,
    borderRadius: 12,
    borderWidth: 1,
    textAlign: 'center',
    fontSize: 24,
  },
});

export default OTPInput;
