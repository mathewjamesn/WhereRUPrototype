import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { router } from '../nav';
import { Screen } from '../ui/Screen';
import { AppText } from '../ui/AppText';
import { Button } from '../ui/Button';
import { OptionField, TextField } from '../ui/Parts';
import { MapArt } from '../ui/Map';
import { colors } from '../theme';
import { proto, useProto } from '../state/proto';

export default function Login() {
  const stateName = useProto(s => s.stateName);
  const savedMobile = useProto(s => s.mobile);
  const [mobile, setMobile] = useState(savedMobile);
  const valid = /^[6-9][0-9]{9}$/.test(mobile);
  return (
    <Screen
      bg={colors.white}
      footer={
        <>
          <Button
            label="Get OTP"
            disabled={!valid}
            onPress={() => {
              proto.set({ mobile });
              router.push('/otp');
            }}
          />
          <AppText variant="small" color={colors.muted} style={{ textAlign: 'center', lineHeight: 19 }}>
            By continuing you agree to the Terms and Privacy Policy.
          </AppText>
        </>
      }>
      <View style={styles.hero}>
        <MapArt route carAt={[120, 470]} />
        <View style={styles.brand}>
          <AppText color={colors.lime} style={{ fontSize: 15, fontWeight: '800' }}>
            WhereRU Driver
          </AppText>
        </View>
      </View>
      <View style={{ gap: 6 }}>
        <AppText variant="display" accessibilityRole="header">
          Drive and earn with WhereRU
        </AppText>
        <AppText color={colors.muted}>Sign in or create your driver account.</AppText>
      </View>
      <OptionField label="State" value={stateName} options={['Kerala', 'Karnataka', 'Tamil Nadu']} onChange={v => proto.set({ stateName: v })} />
      <TextField
        label="Mobile number"
        prefix="+91"
        keyboardType="number-pad"
        maxLength={10}
        placeholder="10-digit number"
        value={mobile}
        onChangeText={v => setMobile(v.replace(/[^0-9]/g, '').slice(0, 10))}
        error={mobile.length === 10 && !valid ? 'Enter a valid 10-digit mobile number.' : null}
        style={{ letterSpacing: 0.6 }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: { height: 200, borderRadius: 24, overflow: 'hidden' },
  brand: { position: 'absolute', left: 16, bottom: 16, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12, backgroundColor: colors.ink },
});
