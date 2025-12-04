import React from 'react';
import { StyleSheet, TextInput, TextInputProps, View } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { ThemedText } from './Themed';

interface Props extends TextInputProps {
  label: string;
  error?: string;
}

const FormTextInput: React.FC<Props> = ({ label, error, style, ...rest }) => {
  const theme = useTheme();
  return (
    <View style={{ marginBottom: theme.spacing.md }}>
      <ThemedText style={styles.label}>{label}</ThemedText>
      <TextInput
        style={[
          styles.input,
          {
            borderColor: error ? theme.colors.danger : theme.colors.border,
            color: theme.colors.text,
            backgroundColor: theme.colors.card,
          },
          style,
        ]}
        placeholderTextColor={theme.colors.muted}
        {...rest}
      />
      {error ? <ThemedText style={[styles.error, { color: theme.colors.danger }]}>{error}</ThemedText> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    marginBottom: 4,
    fontSize: 14,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
  },
  error: {
    marginTop: 4,
    fontSize: 12,
  },
});

export default FormTextInput;
