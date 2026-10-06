import React from 'react';
import { Pressable, StyleSheet, Switch, TextInput, TextInputProps, View, ViewProps, ViewStyle } from 'react-native';
import { colors, radius, space } from '../theme';
import { AppText } from './AppText';
import { Icon, IconName } from './Icon';

export function Card({ style, ...rest }: ViewProps) {
  return <View {...rest} style={[styles.card, style]} />;
}

/** Card holding divided rows (lists, key/value tables). */
export function ListCard({ children, style }: { children: React.ReactNode; style?: ViewStyle }) {
  return <View style={[styles.card, { paddingVertical: 4 }, style]}>{children}</View>;
}

export function SectionLabel({ children }: { children: string }) {
  return (
    <AppText variant="label" color={colors.muted} style={{ marginTop: 4, marginLeft: 4, fontSize: 15 }}>
      {children}
    </AppText>
  );
}

export function NavRow(props: { icon: IconName; label: string; sub?: string; onPress?: () => void; color?: string; last?: boolean }) {
  const color = props.color ?? colors.ink;
  return (
    <Pressable accessibilityRole="button" onPress={props.onPress} style={({ pressed }) => [styles.navRow, props.last ? null : styles.divider, pressed ? { opacity: 0.6 } : null]}>
      <Icon name={props.icon} color={color} />
      <AppText variant="bodyStrong" color={color} style={styles.flex}>
        {props.label}
      </AppText>
      {props.sub ? (
        <AppText variant="label" color={colors.muted} style={{ fontWeight: '500' }}>
          {props.sub}
        </AppText>
      ) : null}
      <Icon name="chev" size={18} color={colors.muted} />
    </Pressable>
  );
}

export function KV({ k, v, last, vColor }: { k: string; v: string; last?: boolean; vColor?: string }) {
  return (
    <View style={[styles.kv, last ? null : styles.divider]}>
      <AppText color={colors.muted} style={{ fontSize: 15 }}>
        {k}
      </AppText>
      <AppText variant="bodyStrong" color={vColor} style={{ textAlign: 'right', flexShrink: 1 }}>
        {v}
      </AppText>
    </View>
  );
}

export function Money({ k, v, bold, color, last }: { k: string; v: string; bold?: boolean; color?: string; last?: boolean }) {
  return (
    <View style={[styles.kv, { minHeight: 44 }, last ? null : styles.divider]}>
      <AppText color={bold ? colors.ink : colors.muted} style={{ fontSize: 15, fontWeight: bold ? '800' : '600' }}>
        {k}
      </AppText>
      <AppText color={color ?? colors.ink} style={{ fontSize: bold ? 18 : 16, fontWeight: bold ? '800' : '600' }}>
        {v}
      </AppText>
    </View>
  );
}

export function SwitchRow({ label, sub, value, onChange, last }: { label: string; sub: string; value: boolean; onChange: (v: boolean) => void; last?: boolean }) {
  return (
    <View style={[styles.switchRow, last ? null : styles.divider]}>
      <View style={styles.flex}>
        <AppText variant="bodyStrong">{label}</AppText>
        <AppText variant="small" color={colors.muted} style={{ fontSize: 14, marginTop: 2 }}>
          {sub}
        </AppText>
      </View>
      <Switch value={value} onValueChange={onChange} trackColor={{ true: colors.green, false: colors.line }} thumbColor={colors.white} accessibilityLabel={label} />
    </View>
  );
}

export function Chip({ label, bg, fg }: { label: string; bg: string; fg: string }) {
  return (
    <View style={[styles.chip, { backgroundColor: bg }]}>
      <AppText variant="label" color={fg} style={{ fontSize: 13, fontWeight: '800' }}>
        {label}
      </AppText>
    </View>
  );
}

type FieldProps = TextInputProps & { label: string; error?: string | null; prefix?: string; hint?: string };
export function TextField({ label, error, prefix, hint, style, ...rest }: FieldProps) {
  return (
    <View style={{ gap: 6 }}>
      <AppText variant="label" color={colors.muted}>
        {label}
      </AppText>
      <View style={[styles.box, error ? { borderColor: colors.red } : null]}>
        {prefix ? (
          <View style={styles.prefix}>
            <AppText variant="bodyStrong" style={{ fontSize: 17 }}>
              {prefix}
            </AppText>
          </View>
        ) : null}
        <TextInput accessibilityLabel={label} placeholderTextColor="#8A8A8A" style={[styles.input, style]} maxFontSizeMultiplier={1.4} {...rest} />
      </View>
      {error ? (
        <AppText variant="small" color={colors.red}>
          {error}
        </AppText>
      ) : hint ? (
        <AppText variant="small" color={colors.muted}>
          {hint}
        </AppText>
      ) : null}
    </View>
  );
}

/** Tappable single-select field that cycles through a short option list (prototype stand-in for a picker). */
export function OptionField({ label, value, options, onChange }: { label: string; value: string | null; options: string[]; onChange: (v: string) => void }) {
  const [open, setOpen] = React.useState(false);
  return (
    <View style={{ gap: 6 }}>
      <AppText variant="label" color={colors.muted}>
        {label}
      </AppText>
      <Pressable accessibilityRole="button" accessibilityLabel={`${label}: ${value ?? 'Choose'}`} onPress={() => setOpen(o => !o)} style={[styles.box, { paddingHorizontal: 14, justifyContent: 'space-between' }]}>
        <AppText style={{ fontSize: 17 }} color={value ? colors.ink : '#8A8A8A'}>
          {value ?? 'Choose'}
        </AppText>
        <View style={{ transform: [{ rotate: open ? '-90deg' : '90deg' }] }}>
          <Icon name="chev" size={18} color={colors.muted} />
        </View>
      </Pressable>
      {open ? (
        <View style={styles.options}>
          {options.map((o, i) => (
            <Pressable
              key={o}
              accessibilityRole="button"
              onPress={() => {
                onChange(o);
                setOpen(false);
              }}
              style={[styles.option, i < options.length - 1 ? styles.divider : null, o === value ? { backgroundColor: colors.lime } : null]}>
              <AppText variant="bodyStrong">{o}</AppText>
              {o === value ? <Icon name="check" size={18} strokeWidth={3} /> : null}
            </Pressable>
          ))}
        </View>
      ) : null}
    </View>
  );
}

export function RoundButton({ icon, label, onPress, badge, bg = colors.ground }: { icon: IconName; label: string; onPress?: () => void; badge?: number; bg?: string }) {
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={label} onPress={onPress} style={({ pressed }) => [styles.round, { backgroundColor: bg }, pressed ? { opacity: 0.7 } : null]}>
      <Icon name={icon} size={20} />
      {badge ? (
        <View style={styles.badge}>
          <AppText color={colors.white} style={{ fontSize: 12, fontWeight: '800' }}>
            {badge}
          </AppText>
        </View>
      ) : null}
    </Pressable>
  );
}

export function Avatar({ initials, size = 48, dark }: { initials: string; size?: number; dark?: boolean }) {
  return (
    <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: dark ? colors.ink : colors.ground, alignItems: 'center', justifyContent: 'center' }}>
      <AppText color={dark ? colors.lime : colors.ink} style={{ fontSize: size * 0.36, fontWeight: '800' }}>
        {initials}
      </AppText>
    </View>
  );
}

export function Notice({ tone, children }: { tone: 'warn' | 'red' | 'green'; children: string }) {
  const map = { warn: [colors.warnTint, colors.warnText], red: [colors.redTint, colors.red], green: [colors.greenTint, colors.green] } as const;
  const [bg, fg] = map[tone];
  return (
    <View style={{ backgroundColor: bg, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10 }}>
      <AppText color={fg} style={{ fontSize: 14, fontWeight: '600', lineHeight: 20 }}>
        {children}
      </AppText>
    </View>
  );
}

export const styles = StyleSheet.create({
  flex: { flex: 1 },
  card: { backgroundColor: colors.card, borderRadius: radius.lg, padding: space.lg },
  divider: { borderBottomWidth: 1, borderBottomColor: colors.line },
  navRow: { flexDirection: 'row', alignItems: 'center', gap: 14, minHeight: 56 },
  kv: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', minHeight: 52, gap: 12 },
  switchRow: { flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 64, paddingVertical: 8 },
  chip: { paddingHorizontal: 9, paddingVertical: 5, borderRadius: 8, alignSelf: 'flex-start' },
  box: { flexDirection: 'row', alignItems: 'center', minHeight: 54, borderRadius: radius.md, borderWidth: 1.5, borderColor: colors.line, backgroundColor: colors.white, overflow: 'hidden' },
  prefix: { paddingHorizontal: 12, borderRightWidth: 1.5, borderRightColor: colors.line, alignSelf: 'stretch', justifyContent: 'center' },
  input: { flex: 1, paddingHorizontal: 14, fontSize: 17, color: colors.ink, minHeight: 50 },
  options: { backgroundColor: colors.white, borderRadius: radius.md, borderWidth: 1.5, borderColor: colors.line, overflow: 'hidden' },
  option: { minHeight: 48, paddingHorizontal: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  round: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  badge: { position: 'absolute', top: -2, right: -2, minWidth: 20, height: 20, borderRadius: 10, backgroundColor: colors.red, borderWidth: 2, borderColor: colors.white, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 3 },
});
