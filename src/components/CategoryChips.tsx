import React from 'react';
import { ScrollView, Pressable, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { ThemedText } from './Themed';

interface Props {
  categories: string[];
  selected?: string;
  onSelect: (category?: string) => void;
}

const CategoryChips: React.FC<Props> = ({ categories, selected, onSelect }) => {
  const theme = useTheme();
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.container}>
      <Pressable
        accessibilityRole="button"
        onPress={() => onSelect(undefined)}
        style={({ pressed }) => [
          styles.chip,
          {
            backgroundColor: !selected ? theme.colors.primary : theme.colors.surface,
            borderColor: theme.colors.border,
            opacity: pressed ? 0.85 : 1,
          },
        ]}
      >
        <ThemedText style={{ color: !selected ? '#fff' : theme.colors.text }}>All</ThemedText>
      </Pressable>
      {categories.map((category) => {
        const isSelected = category === selected;
        return (
          <Pressable
            key={category}
            accessibilityRole="button"
            onPress={() => onSelect(category)}
            style={({ pressed }) => [
              styles.chip,
              {
                backgroundColor: isSelected ? theme.colors.primary : theme.colors.surface,
                borderColor: theme.colors.border,
                opacity: pressed ? 0.85 : 1,
              },
            ]}
          >
            <ThemedText style={{ color: isSelected ? '#fff' : theme.colors.text }}>{category}</ThemedText>
          </Pressable>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  chip: {
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
});

export default CategoryChips;
