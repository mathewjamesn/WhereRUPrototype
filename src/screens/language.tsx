import React, { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { router, useLocalSearchParams } from '../nav';
import { Screen, goBack } from '../ui/Screen';
import { AppText } from '../ui/AppText';
import { Button } from '../ui/Button';
import { Icon } from '../ui/Icon';
import { colors } from '../theme';
import { proto, useProto } from '../state/proto';

const LANGS = [
  { code: 'en', name: 'English', native: 'English' },
  { code: 'ml', name: 'Malayalam', native: 'മലയാളം' },
] as const;

/** First screen on a fresh install, and Account → Settings → Language. */
export default function LanguageScreen() {
  const { from } = useLocalSearchParams<{ from?: string }>();
  const fromSettings = from === 'settings';
  const saved = useProto(s => s.language);
  const [pick, setPick] = useState<'en' | 'ml'>(saved ?? 'en');

  return (
    <Screen
      title={fromSettings ? 'Language' : undefined}
      back={fromSettings ? '/settings' : undefined}
      footer={
        <Button
          label="Continue"
          onPress={() => {
            proto.set({ language: pick });
            if (fromSettings) goBack('/settings');
            else router.replace('/login');
          }}
        />
      }>
      {!fromSettings ? (
        <View style={{ gap: 6, paddingTop: 24 }}>
          <View style={styles.badge}>
            <Icon name="globe" size={28} />
          </View>
          <AppText variant="display" accessibilityRole="header">
            Choose your language
          </AppText>
          <AppText color={colors.muted}>ഭാഷ തിരഞ്ഞെടുക്കുക. You can change this later in Account.</AppText>
        </View>
      ) : (
        <AppText color={colors.muted}>The app, ride alerts and notifications use this language.</AppText>
      )}
      <View style={{ gap: 10 }} accessibilityRole="radiogroup">
        {LANGS.map(l => {
          const on = pick === l.code;
          return (
            <Pressable
              key={l.code}
              accessibilityRole="radio"
              accessibilityState={{ checked: on }}
              onPress={() => setPick(l.code)}
              style={[styles.option, on ? styles.optionOn : null]}>
              <View style={{ flex: 1 }}>
                <AppText style={{ fontSize: 20, fontWeight: '800' }}>{l.native}</AppText>
                {l.native !== l.name ? (
                  <AppText color={colors.muted} style={{ fontSize: 14 }}>
                    {l.name}
                  </AppText>
                ) : null}
              </View>
              <View style={[styles.radio, on ? styles.radioOn : null]}>{on ? <Icon name="check" size={16} color={colors.white} strokeWidth={3} /> : null}</View>
            </Pressable>
          );
        })}
      </View>
      {pick === 'ml' ? (
        <AppText variant="small" color={colors.muted}>
          Prototype note: screens stay in English here. The TOK Driver build has the full Malayalam text.
        </AppText>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  badge: { width: 56, height: 56, borderRadius: 28, backgroundColor: colors.lime, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  option: { flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 72, paddingHorizontal: 18, borderRadius: 18, backgroundColor: colors.white, borderWidth: 2, borderColor: colors.white },
  optionOn: { borderColor: colors.ink, backgroundColor: colors.lime },
  radio: { width: 26, height: 26, borderRadius: 13, borderWidth: 2, borderColor: colors.muted, alignItems: 'center', justifyContent: 'center' },
  radioOn: { backgroundColor: colors.ink, borderColor: colors.ink },
});
