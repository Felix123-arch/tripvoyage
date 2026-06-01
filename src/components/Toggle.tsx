import { TouchableOpacity, Animated, StyleSheet } from 'react-native';
import { useEffect, useRef } from 'react';
import { useTheme } from '../theme';

interface Props {
  value: boolean;
  onToggle: (val: boolean) => void;
}

export function Toggle({ value, onToggle }: Props) {
  const t = useTheme();
  const offset = useRef(new Animated.Value(value ? 20 : 0)).current;

  useEffect(() => {
    Animated.timing(offset, {
      toValue: value ? 20 : 0,
      duration: t.animation.fast,
      useNativeDriver: true,
    }).start();
  }, [value]);

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => onToggle(!value)}
      style={[
        s.track,
        {
          backgroundColor: value ? t.colors.primary : t.colors.outline,
          borderRadius: t.radius.full,
          width: 48,
          height: 28,
        },
      ]}
    >
      <Animated.View
        style={[
          s.thumb,
          {
            backgroundColor: t.colors.surface,
            borderRadius: t.radius.full,
            transform: [{ translateX: offset }],
          },
        ]}
      />
    </TouchableOpacity>
  );
}

const s = StyleSheet.create({
  track: { justifyContent: 'center', paddingHorizontal: 3 },
  thumb: { width: 22, height: 22, position: 'absolute' as const, top: 3, left: 3 },
});
