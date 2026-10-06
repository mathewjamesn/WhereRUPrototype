import React from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { Screen } from '../ui/Screen';
import { AppText } from '../ui/AppText';
import { Button } from '../ui/Button';
import { Card, ListCard } from '../ui/Parts';
import { colors } from '../theme';
import { proto, useProto } from '../state/proto';
import { rupees } from '../state/ride';

const TXNS = ['3:38 PM', '2:51 PM', '1:40 PM'];

/** Platform fees and GST owed from cash trips, paid with PhonePe. */
export default function Wallet() {
  const due = useProto(s => s.walletDue);
  const pay = () =>
    Alert.alert('PhonePe', `The real app opens PhonePe to pay ${rupees(due)}. Mark it as paid in the prototype?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Paid', onPress: () => proto.set({ walletDue: 0 }) },
    ]);
  return (
    <Screen title="Wallet" back="/earnings">
      <Card style={{ backgroundColor: colors.ink }}>
        <AppText color={colors.darkMuted} style={{ fontSize: 15, fontWeight: '600' }}>
          {due > 0 ? 'You owe' : 'Balance'}
        </AppText>
        <AppText color={colors.white} style={{ fontSize: 44, fontWeight: '800', letterSpacing: -1 }}>
          {rupees(due)}
        </AppText>
        <AppText color={colors.darkMuted} style={{ fontSize: 14, lineHeight: 20, marginTop: 4, marginBottom: 14 }}>
          {due > 0 ? 'Platform fees and GST from cash trips. Clear dues above ₹500 to keep getting ride requests.' : 'Nothing due. Fees from your next cash trips will show here.'}
        </AppText>
        {due > 0 ? <Button label={`Pay ${rupees(due)} with PhonePe`} variant="lime" height={54} onPress={pay} /> : null}
      </Card>
      <AppText variant="heading" style={{ marginLeft: 4 }}>
        Today
      </AppText>
      <ListCard>
        {TXNS.map((t, i) => (
          <View key={t} style={[styles.txn, i < TXNS.length - 1 ? styles.divider : null]}>
            <View style={{ flex: 1 }}>
              <AppText variant="bodyStrong">{`Cash trip, ${t}`}</AppText>
              <AppText variant="small" color={colors.muted} style={{ marginTop: 2 }}>
                Fee ₹9.09 + GST ₹1.64
              </AppText>
            </View>
            <AppText color={colors.red} style={{ fontSize: 16, fontWeight: '800' }}>
              −₹10.73
            </AppText>
          </View>
        ))}
      </ListCard>
    </Screen>
  );
}

const styles = StyleSheet.create({
  txn: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12 },
  divider: { borderBottomWidth: 1, borderBottomColor: colors.line },
});
