import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, ThemedText } from '../Themed';
import { useTheme } from '../../context/ThemeContext';

type Column<T> = {
  key: string;
  title: string;
  width?: number | string;
  render?: (row: T) => React.ReactNode;
  dataIndex?: keyof T;
  align?: 'left' | 'center' | 'right';
};

interface Props<T> {
  columns: Column<T>[];
  data: T[];
  rowKey: (row: T) => string;
  emptyText?: string;
}

function AdminTable<T>({ columns, data, rowKey, emptyText = 'No records yet' }: Props<T>) {
  const theme = useTheme();
  return (
    <Card style={styles.card}>
      <View style={styles.headerRow}>
        {columns.map((column) => (
          <ThemedText
            key={column.key}
            style={[
              styles.header,
              { width: column.width || `${100 / columns.length}%`, textAlign: column.align || 'left' },
              { color: theme.colors.muted },
            ]}
          >
            {column.title}
          </ThemedText>
        ))}
      </View>
      {data.length === 0 ? (
        <ThemedText style={{ color: theme.colors.muted }}>{emptyText}</ThemedText>
      ) : (
        data.map((row) => (
          <View key={rowKey(row)} style={styles.row}>
            {columns.map((column) => (
              <View key={column.key} style={{ width: column.width || `${100 / columns.length}%` }}>
                {column.render ? (
                  column.render(row)
                ) : (
                  <ThemedText style={{ textAlign: column.align || 'left' }}>
                    {String(row[column.dataIndex as keyof T])}
                  </ThemedText>
                )}
              </View>
            ))}
          </View>
        ))
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 12,
    gap: 12,
  },
  headerRow: {
    flexDirection: 'row',
    gap: 8,
  },
  header: {
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
});

export default AdminTable;
