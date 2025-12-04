import React from 'react';
import { TextInput, View, StyleSheet, FlatList, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { ThemedText, Card } from './Themed';

interface Props {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  suggestions?: string[];
  onSelectSuggestion?: (value: string) => void;
}

const SearchBar: React.FC<Props> = ({ value, onChangeText, placeholder, suggestions = [], onSelectSuggestion }) => {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <View style={[styles.inputWrapper, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
        <Ionicons name="search" size={18} color={theme.colors.muted} style={styles.icon} />
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.muted}
          style={[styles.input, { color: theme.colors.text }]}
          accessibilityLabel="Search"
        />
      </View>
      {suggestions.length > 0 && (
        <Card style={styles.suggestionsCard}>
          <FlatList
            data={suggestions}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <Pressable onPress={() => onSelectSuggestion?.(item)} style={styles.suggestionRow}>
                <Ionicons name="flash" size={16} color={theme.colors.accent} />
                <ThemedText style={styles.suggestionText}>{item}</ThemedText>
              </Pressable>
            )}
            ItemSeparatorComponent={() => <View style={[styles.separator, { backgroundColor: theme.colors.border }]} />}
          />
        </Card>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: 44,
    fontSize: 16,
  },
  suggestionsCard: {
    marginTop: 8,
    paddingVertical: 4,
  },
  suggestionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    gap: 8,
  },
  suggestionText: {
    fontSize: 15,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
  },
});

export default SearchBar;
