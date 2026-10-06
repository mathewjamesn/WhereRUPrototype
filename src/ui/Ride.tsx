import React, { useEffect, useRef, useState } from 'react';
import { Animated, PanResponder, Pressable, StyleSheet, View, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle } from 'react-native-svg';
import { colors } from '../theme';
import { AppText } from './AppText';
import { Icon } from './Icon';

export type Point = { kind: 'pick' | 'drop' | '1' | '2'; label?: string; title: string; sub?: string };

/** Pickup → (stops) → drop list. Drop is always shown on every request. */
export function RouteList({ points, dark }: { points: Point[]; dark?: boolean }) {
  const mt = dark ? colors.darkMuted : colors.muted;
  const lc = dark ? colors.darkLine : colors.line;
  return (
    <View>
      {points.map((p, i) => {
        const last = i === points.length - 1;
        return (
          <View key={`${p.kind}-${i}`} style={styles.li}>
            <View style={styles.rail}>
              <Marker kind={p.kind} dark={dark} />
              {!last ? <View style={[styles.railLine, { backgroundColor: lc }]} /> : null}
            </View>
            <View style={{ flex: 1, paddingBottom: last ? 0 : 14 }}>
              {p.label ? (
                <AppText variant="small" color={mt} style={{ fontWeight: '700' }}>
                  {p.label}
                </AppText>
              ) : null}
              <AppText color={dark ? colors.white : colors.ink} style={{ fontSize: 17, fontWeight: '700' }}>
                {p.title}
              </AppText>
              {p.sub ? (
                <AppText color={mt} style={{ fontSize: 14, marginTop: 2 }}>
                  {p.sub}
                </AppText>
              ) : null}
            </View>
          </View>
        );
      })}
    </View>
  );
}

export function Marker({ kind, dark }: { kind: Point['kind'] | 'done' | 'next'; dark?: boolean }) {
  if (kind === 'pick') return <View style={[styles.pick, { borderColor: dark ? colors.ink : colors.white }]} />;
  if (kind === 'drop') return <View style={[styles.drop, { backgroundColor: dark ? colors.white : colors.ink }]} />;
  return (
    <View style={[styles.num, { backgroundColor: dark ? colors.white : colors.ink }]}>
      <AppText color={dark ? colors.ink : colors.white} style={{ fontSize: 12, fontWeight: '800' }}>
        {kind}
      </AppText>
    </View>
  );
}

/** White bottom sheet over the map. */
export function Sheet({ children, bottom = 0, style }: { children: React.ReactNode; bottom?: number; style?: ViewStyle }) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.sheet, { bottom, paddingBottom: (bottom ? 20 : 20 + insets.bottom) }, style]}>
      <View style={styles.grip} />
      {children}
    </View>
  );
}

/** Black status pill at the top of map screens. */
export function StatusPill({ text, dot = colors.green, right = 72 }: { text: string; dot?: string; right?: number }) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.pill, { top: insets.top + 16, right }]}>
      <View style={[styles.dot, { backgroundColor: dot }]} />
      <AppText color={colors.white} style={{ fontSize: 15, fontWeight: '700' }} numberOfLines={1}>
        {text}
      </AppText>
    </View>
  );
}

export function TopRight({ children }: { children: React.ReactNode }) {
  const insets = useSafeAreaInsets();
  return <View style={{ position: 'absolute', top: insets.top + 16, right: 16 }}>{children}</View>;
}

/** Countdown ring for incoming requests. Calls onDone when it reaches zero. */
export function CountdownRing({ seconds, size = 96, onDone }: { seconds: number; size?: number; onDone?: () => void }) {
  const [left, setLeft] = useState(seconds * 10);
  const done = useRef(false);
  useEffect(() => {
    const t = setInterval(() => setLeft(v => Math.max(0, v - 1)), 100);
    return () => clearInterval(t);
  }, []);
  useEffect(() => {
    if (left === 0 && !done.current) {
      done.current = true;
      onDone?.();
    }
  }, [left, onDone]);
  const r = 42;
  const c = 2 * Math.PI * r;
  const frac = left / (seconds * 10);
  return (
    <View style={{ width: size, height: size }} accessibilityLabel={`${Math.ceil(left / 10)} seconds left`}>
      <Svg width={size} height={size} viewBox="0 0 96 96">
        <Circle cx="48" cy="48" r={r} fill="none" stroke={colors.darkCard} strokeWidth={8} />
        <Circle
          cx="48"
          cy="48"
          r={r}
          fill="none"
          stroke={left < 50 ? '#FF6B5E' : colors.lime}
          strokeWidth={8}
          strokeLinecap="round"
          strokeDasharray={`${c * frac} ${c}`}
          transform="rotate(-90 48 48)"
        />
      </Svg>
      <View style={[StyleSheet.absoluteFill, { alignItems: 'center', justifyContent: 'center' }]}>
        <AppText color={colors.white} style={{ fontSize: size > 90 ? 26 : 24, fontWeight: '800' }}>
          {`${Math.ceil(left / 10)}s`}
        </AppText>
      </View>
    </View>
  );
}

/** Slide-to-confirm control used to end a trip (prevents accidental taps). */
export function SlideToConfirm({ label, onConfirm }: { label: string; onConfirm: () => void }) {
  const [width, setWidth] = useState(0);
  const x = useRef(new Animated.Value(0)).current;
  const max = Math.max(0, width - 64);
  const maxRef = useRef(0);
  maxRef.current = max;
  const pan = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_, g) => x.setValue(Math.min(maxRef.current, Math.max(0, g.dx))),
      onPanResponderRelease: (_, g) => {
        if (g.dx > maxRef.current * 0.8) {
          Animated.timing(x, { toValue: maxRef.current, duration: 120, useNativeDriver: true }).start(() => {
            onConfirm();
            x.setValue(0);
          });
        } else {
          Animated.spring(x, { toValue: 0, useNativeDriver: true }).start();
        }
      },
    }),
  ).current;
  return (
    <View
      onLayout={e => setWidth(e.nativeEvent.layout.width)}
      style={styles.slide}
      accessible
      accessibilityRole="adjustable"
      accessibilityLabel={label}
      accessibilityActions={[{ name: 'activate' }]}
      onAccessibilityAction={onConfirm}>
      <AppText color={colors.white} style={{ fontSize: 18, fontWeight: '800' }}>
        {label}
      </AppText>
      <Animated.View {...pan.panHandlers} style={[styles.knob, { transform: [{ translateX: x }] }]}>
        <Icon name="chev" size={26} color={colors.green} strokeWidth={3} />
      </Animated.View>
    </View>
  );
}

/** 3-up dark stat tiles on the request screen. */
export function StatTiles({ items }: { items: [string, string][] }) {
  return (
    <View style={{ flexDirection: 'row', gap: 10 }}>
      {items.map(([k, v]) => (
        <View key={k} style={styles.tile}>
          <AppText variant="small" color={colors.darkMuted} style={{ fontWeight: '600' }}>
            {k}
          </AppText>
          <AppText color={colors.white} style={{ fontSize: 20, fontWeight: '800', marginTop: 2 }}>
            {v}
          </AppText>
        </View>
      ))}
    </View>
  );
}

export function DarkTag({ label, lime }: { label: string; lime?: boolean }) {
  return (
    <View style={[styles.tag, lime ? { backgroundColor: colors.lime } : null]}>
      <AppText color={lime ? colors.ink : colors.white} style={{ fontSize: 14, fontWeight: lime ? '800' : '700' }}>
        {label}
      </AppText>
    </View>
  );
}

export function Scrim({ onPress }: { onPress?: () => void }) {
  return <Pressable style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.55)' }]} onPress={onPress} accessible={false} />;
}

const styles = StyleSheet.create({
  li: { flexDirection: 'row', gap: 12 },
  rail: { width: 22, alignItems: 'center', paddingTop: 4 },
  railLine: { flex: 1, width: 2, marginVertical: 4 },
  pick: { width: 18, height: 18, borderRadius: 9, backgroundColor: colors.green, borderWidth: 3 },
  drop: { width: 13, height: 13 },
  num: { width: 22, height: 22, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    backgroundColor: colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 10,
    paddingHorizontal: 20,
    gap: 16,
    shadowColor: '#1C2127',
    shadowOpacity: 0.1,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: -6 },
    elevation: 12,
  },
  grip: { alignSelf: 'center', width: 40, height: 5, borderRadius: 3, backgroundColor: colors.line },
  pill: { position: 'absolute', left: 16, height: 48, borderRadius: 24, backgroundColor: colors.ink, flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 18 },
  dot: { width: 10, height: 10, borderRadius: 5 },
  slide: { height: 64, borderRadius: 32, backgroundColor: colors.green, alignItems: 'center', justifyContent: 'center' },
  knob: { position: 'absolute', left: 6, top: 6, width: 52, height: 52, borderRadius: 26, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center' },
  tile: { flex: 1, backgroundColor: colors.darkCard, borderRadius: 14, padding: 12 },
  tag: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, backgroundColor: colors.darkCard },
});
