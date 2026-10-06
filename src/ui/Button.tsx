import React from 'react';
import { Pressable, StyleSheet, View, ViewStyle } from 'react-native';
import { colors, radius, TOUCH } from '../theme';
import { AppText } from './AppText';
import { Icon, IconName } from './Icon';

type Variant = 'primary' | 'lime' | 'outline' | 'danger' | 'green' | 'darkOutline' | 'text';

const palette: Record<Variant, { bg: string; fg: string; border?: string }> = {
  primary: { bg: colors.ink, fg: colors.white },
  lime: { bg: colors.lime, fg: colors.ink },
  outline: { bg: colors.white, fg: colors.ink, border: colors.ink },
  danger: { bg: colors.red, fg: colors.white },
  green: { bg: colors.green, fg: colors.white },
  darkOutline: { bg: 'transparent', fg: colors.white, border: colors.darkLine },
  text: { bg: 'transparent', fg: colors.ink },
};

export function Button(props: {
  label: string;
  onPress?: () => void;
  variant?: Variant;
  disabled?: boolean;
  icon?: IconName;
  pill?: boolean;
  height?: number;
  fontSize?: number;
  color?: string;
  style?: ViewStyle;
}) {
  const { label, onPress, variant = 'primary', disabled, icon, pill, height = 56, fontSize = 17, style } = props;
  const p = palette[variant];
  const fg = disabled ? colors.muted : props.color ?? p.fg;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: !!disabled }}
      onPress={disabled ? undefined : onPress}
      style={({ pressed }) => [
        styles.base,
        { minHeight: height, backgroundColor: disabled ? colors.line : p.bg, borderRadius: pill ? radius.pill : 16 },
        p.border && !disabled ? { borderWidth: 2, borderColor: p.border } : null,
        pressed && !disabled ? { opacity: 0.85 } : null,
        style,
      ]}>
      <View style={styles.row}>
        {icon ? <Icon name={icon} color={fg} size={22} strokeWidth={2.4} /> : null}
        <AppText variant="bodyStrong" color={fg} style={{ fontSize, fontWeight: '800' }}>
          {label}
        </AppText>
      </View>
    </Pressable>
  );
}

/** Dashed grey shortcut used only to drive the prototype (not part of the real app). */
export function ProtoLink({ label, onPress, style }: { label: string; onPress: () => void; style?: ViewStyle }) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={({ pressed }) => [styles.proto, pressed ? { opacity: 0.6 } : null, style]}>
      <AppText variant="small" color={colors.muted} style={{ fontWeight: '700', textAlign: 'center' }}>
        {label}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: { paddingHorizontal: 20, alignItems: 'center', justifyContent: 'center', minWidth: TOUCH },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  proto: {
    flex: 1,
    minHeight: 44,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: colors.line,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
