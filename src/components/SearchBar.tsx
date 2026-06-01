import { View, Text, TextInput, StyleSheet } from 'react-native';
import { useTheme } from '../theme';

interface Props {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

export function SearchBar({ value, onChangeText, placeholder = 'Search...' }: Props) {
  const t = useTheme();

  return (
    <View
      style={[
        s.wrap,
        {
          backgroundColor: t.colors.surface,
          borderColor: t.colors.outline,
          borderRadius: t.radius.md,
          paddingHorizontal: t.spacing.lg,
          height: 48,
        },
      ]}
    >
      <Text style={[s.icon, { color: t.colors.onSurfaceMuted }]}>&#x1F50D;</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={t.colors.onSurfaceMuted}
        style={[
          s.input,
          {
            fontFamily: t.typography.fontFamily,
            fontSize: t.typography.body.fontSize,
            color: t.colors.onSurface,
          },
        ]}
      />
    </View>
  );
}

const s = StyleSheet.create({
  wrap: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, gap: 10 },
  icon: { fontSize: 18 },
  input: { flex: 1, height: '100%' },
});
