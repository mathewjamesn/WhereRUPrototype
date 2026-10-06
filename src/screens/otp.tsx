import React, { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { router } from '../nav';
import { Screen } from '../ui/Screen';
import { AppText } from '../ui/AppText';
import { Button, ProtoLink } from '../ui/Button';
import { colors } from '../theme';
import { approvedDriver, proto, routeAfterSignIn, useProto } from '../state/proto';

const LEN = 5; // TOK OTP is exactly 5 digits (ValidationHelper.isValidOtp)

export default function Otp() {
  const mobile = useProto(s => s.mobile) || '9876543210';
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [left, setLeft] = useState(30);
  const input = useRef<TextInput>(null);

  useEffect(() => {
    const t = setInterval(() => setLeft(v => Math.max(0, v - 1)), 1000);
    return () => clearInterval(t);
  }, []);

  const verify = () => {
    if (code === '00000') {
      setError('That code is not correct. Please check and try again.');
      return;
    }
    router.replace(routeAfterSignIn(proto.get()) as never);
  };

  return (
    <Screen
      title="Verify number"
      back="/login"
      footer={
        <>
          <Button label="Verify" disabled={code.length !== LEN} onPress={verify} />
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <ProtoLink label="Prototype: new driver" onPress={() => router.replace('/details')} />
            <ProtoLink
              label="Prototype: existing driver"
              onPress={() => {
                proto.set({ ...approvedDriver, mobile });
                router.replace('/home');
              }}
            />
          </View>
        </>
      }>
      <AppText color={colors.muted} style={{ lineHeight: 23 }}>
        Enter the {LEN}-digit code sent to{' '}
        <AppText variant="bodyStrong">{`+91 ${mobile.slice(0, 5)} ${mobile.slice(5)}`}</AppText>.{' '}
        <AppText variant="bodyStrong" style={{ textDecorationLine: 'underline' }} onPress={() => router.replace('/login')}>
          Edit
        </AppText>
      </AppText>
      <Pressable onPress={() => input.current?.focus()} style={styles.boxes} accessibilityLabel={`${LEN}-digit code`}>
        {Array.from({ length: LEN }).map((_, i) => {
          const active = i === code.length;
          return (
            <View key={i} style={[styles.box, active ? { borderColor: colors.ink } : null, error ? { borderColor: colors.red } : null]}>
              <AppText style={{ fontSize: 26, fontWeight: '800' }}>{code[i] ?? ''}</AppText>
            </View>
          );
        })}
        <TextInput
          ref={input}
          value={code}
          onChangeText={v => {
            setError(null);
            setCode(v.replace(/[^0-9]/g, '').slice(0, LEN));
          }}
          keyboardType="number-pad"
          textContentType="oneTimeCode"
          autoComplete="sms-otp"
          autoFocus
          maxLength={LEN}
          style={styles.hidden}
          accessibilityLabel="OTP"
        />
      </Pressable>
      {error ? <AppText color={colors.red}>{error}</AppText> : null}
      <AppText color={colors.muted} style={{ fontSize: 14 }}>
        Reading the code from SMS automatically.{' '}
        {left > 0 ? (
          `Resend in 0:${String(left).padStart(2, '0')}`
        ) : (
          <AppText variant="label" style={{ textDecorationLine: 'underline' }} onPress={() => setLeft(30)}>
            Resend code
          </AppText>
        )}
      </AppText>
      <AppText variant="small" color={colors.muted}>
        Prototype: any {LEN} digits work. 00000 shows the wrong-code message.
      </AppText>
    </Screen>
  );
}

const styles = StyleSheet.create({
  boxes: { flexDirection: 'row', gap: 10 },
  box: { flex: 1, height: 62, borderRadius: 14, borderWidth: 2, borderColor: colors.line, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center' },
  hidden: { position: 'absolute', opacity: 0, width: 1, height: 1 },
});
