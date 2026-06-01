import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useTheme } from '../theme';
import type { PinColor } from '../data';

interface Props {
  color: PinColor;
  top: string;
  left: string;
  onPress?: () => void;
}

const pinColors: Record<PinColor, string> = {
  blue: '#2563EB',
  green: '#059669',
  amber: '#D97706',
  red: '#DC2626',
};

export function MapPin({ color, top, left, onPress }: Props) {
  const t = useTheme();

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={[
        s.pin,
        {
          backgroundColor: pinColors[color],
          borderRadius: t.radius.full,
          borderBottomRightRadius: 2,
          transform: [{ rotate: '-45deg' }],
          top: top as any,
          left: left as any,
        },
      ]}
    >
      <Text style={s.inner}>&#x25CF;</Text>
    </TouchableOpacity>
  );
}

const s = StyleSheet.create({
  pin: { position: 'absolute', width: 28, height: 28, alignItems: 'center', justifyContent: 'center', borderTopLeftRadius: 9999, borderTopRightRadius: 9999, borderBottomLeftRadius: 9999 },
  inner: { color: 'rgba(255,255,255,0.6)', fontSize: 10, transform: [{ rotate: '45deg' }] },
});
