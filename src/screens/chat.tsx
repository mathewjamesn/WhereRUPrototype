import React, { useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppText } from '../ui/AppText';
import { Icon } from '../ui/Icon';
import { Avatar, RoundButton } from '../ui/Parts';
import { goBack } from '../ui/Screen';
import { colors } from '../theme';
import { PASSENGER, SIMPLE } from '../state/ride';

const QUICK = ['On my way', 'Reaching in 2 min', 'I’ve reached the pickup', 'Stuck in traffic, 5 min more', 'Please come to the main road'];
type Msg = { text: string; time: string; mine: boolean };

/** Driver ↔ passenger chat with one-tap quick replies (UI only for now). */
export default function Chat() {
  const [draft, setDraft] = useState('');
  const [msgs, setMsgs] = useState<Msg[]>([{ text: 'Hi, I’m at the Infopark main gate, blue shirt', time: '3:12 PM', mine: false }]);
  const scroll = useRef<ScrollView>(null);
  const add = (t: string) => {
    const text = t.trim();
    if (!text) return;
    const now = new Date();
    const time = now.toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' });
    setMsgs(m => [...m, { text, time, mine: true }]);
    setDraft('');
    setTimeout(() => scroll.current?.scrollToEnd({ animated: true }), 50);
  };
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.ground }} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Pressable accessibilityRole="button" accessibilityLabel="Back to trip" onPress={() => goBack('/to-pickup')} style={styles.back}>
          <Icon name="back" size={24} />
        </Pressable>
        <Avatar initials={PASSENGER.initials} size={40} />
        <View style={{ flex: 1 }}>
          <AppText style={{ fontSize: 18, fontWeight: '800' }}>{PASSENGER.name}</AppText>
          <AppText variant="small" color={colors.muted}>{`Pickup ${SIMPLE.pickupKm} km away`}</AppText>
        </View>
        <RoundButton icon="phone" label="Call passenger" />
      </View>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView ref={scroll} style={{ flex: 1 }} contentContainerStyle={{ padding: 16, gap: 10 }}>
          <View style={styles.note}>
            <AppText variant="small" color={colors.muted} style={{ textAlign: 'center' }}>
              Your number stays hidden. Chat closes when the trip starts.
            </AppText>
          </View>
          {msgs.map((m, i) => (
            <View key={i} style={[styles.bubble, m.mine ? styles.mine : styles.theirs]}>
              <AppText color={m.mine ? colors.white : colors.ink} style={{ fontSize: 16, lineHeight: 22 }}>
                {m.text}
              </AppText>
              <AppText color={m.mine ? '#BDBDBD' : colors.muted} style={{ fontSize: 12, marginTop: 4, textAlign: m.mine ? 'right' : 'left' }}>
                {m.time}
              </AppText>
            </View>
          ))}
        </ScrollView>
        <View style={styles.composer}>
          <AppText variant="small" color={colors.muted} style={{ fontWeight: '700', paddingLeft: 4 }}>
            Quick replies, one tap to send
          </AppText>
          <View style={styles.quick}>
            {QUICK.map(q => (
              <Pressable key={q} accessibilityRole="button" onPress={() => add(q)} style={({ pressed }) => [styles.qr, pressed ? { backgroundColor: colors.lime } : null]}>
                <AppText style={{ fontSize: 15, fontWeight: '700' }}>{q}</AppText>
              </Pressable>
            ))}
          </View>
          <View style={styles.inputRow}>
            <TextInput
              value={draft}
              onChangeText={setDraft}
              placeholder="Type a message"
              placeholderTextColor="#8A8A8A"
              accessibilityLabel="Message"
              style={styles.input}
              onSubmitEditing={() => add(draft)}
              returnKeyType="send"
            />
            <Pressable accessibilityRole="button" accessibilityLabel="Send message" onPress={() => add(draft)} style={styles.send}>
              <Icon name="send" size={20} />
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 12, paddingLeft: 8, paddingRight: 12, backgroundColor: colors.white, borderBottomWidth: 1, borderBottomColor: colors.line },
  back: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  note: { alignSelf: 'center', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10, backgroundColor: colors.white, marginBottom: 6 },
  bubble: { maxWidth: '78%', paddingHorizontal: 14, paddingVertical: 10 },
  mine: { alignSelf: 'flex-end', backgroundColor: colors.ink, borderRadius: 18, borderBottomRightRadius: 4 },
  theirs: { alignSelf: 'flex-start', backgroundColor: colors.white, borderRadius: 18, borderBottomLeftRadius: 4 },
  composer: { backgroundColor: colors.white, borderTopWidth: 1, borderTopColor: colors.line, padding: 12, paddingBottom: 16, gap: 10 },
  quick: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  qr: { minHeight: 44, paddingHorizontal: 14, borderRadius: 22, borderWidth: 1.5, borderColor: colors.ink, justifyContent: 'center' },
  inputRow: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  input: { flex: 1, height: 48, borderRadius: 24, borderWidth: 1.5, borderColor: colors.line, paddingHorizontal: 16, fontSize: 16, color: colors.ink, backgroundColor: colors.ground },
  send: { width: 48, height: 48, borderRadius: 24, backgroundColor: colors.lime, alignItems: 'center', justifyContent: 'center' },
});
