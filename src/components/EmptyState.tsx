import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../theme';

interface Props {
  icon?: string;
  title?: string;
  message: string;
}

export function EmptyState({ icon = '📭', title, message }: Props) {
  const theme = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={styles.icon}>{icon}</Text>
      {title && (
        <Text style={[styles.title, { color: theme.colors.onSurface }]}>{title}</Text>
      )}
      <Text style={[styles.message, { color: theme.colors.onSurfaceMuted }]}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  icon: {
    fontSize: 48,
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  message: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
  },
});
