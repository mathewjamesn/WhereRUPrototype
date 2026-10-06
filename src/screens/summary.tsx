import React, { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { router } from '../nav';
import { Screen } from '../ui/Screen';
import { AppText } from '../ui/AppText';
import { Button } from '../ui/Button';
import { Card, Money } from '../ui/Parts';
import { Icon } from '../ui/Icon';
import { colors } from '../theme';
import { proto } from '../state/proto';
import { EARN, PASSENGER, SIMPLE, net, rupees } from '../state/ride';

export default function Summary() {
  const [stars, setStars] = useState(0);
  return (
    <Screen
      footer={
        <>
          <Button
            label="Stay online"
            height={60}
            onPress={() => {
              proto.set({ online: true });
              router.replace('/home');
            }}
          />
          <Button
            label="Go offline"
            variant="text"
            onPress={() => {
              proto.set({ online: false });
              router.replace('/home');
            }}
          />
        </>
      }>
      <View style={{ alignItems: 'center', gap: 10, paddingTop: 16 }}>
        <View style={styles.tick}>
          <Icon name="check" size={34} color={colors.white} strokeWidth={3} />
        </View>
        <AppText style={{ fontSize: 26, fontWeight: '800' }} accessibilityRole="header">
          Trip complete
        </AppText>
        <AppText color={colors.muted} style={{ fontSize: 15 }}>{`Kakkanad to Sunrise Hospital, ${SIMPLE.tripKm} km, 21 min`}</AppText>
      </View>
      <Card>
        <AppText color={colors.muted} style={{ fontSize: 15, fontWeight: '600' }}>
          You earned
        </AppText>
        <AppText color={colors.green} style={{ fontSize: 44, fontWeight: '800', letterSpacing: -1 }}>
          {rupees(net())}
        </AppText>
        <Money k="Fare collected in cash" v={rupees(EARN.fare)} />
        <Money k="Platform fee" v={`−${rupees(EARN.fee)}`} />
        <Money k="GST on platform fee" v={`−${rupees(EARN.gst)}`} last />
        <AppText variant="small" color={colors.muted} style={{ marginTop: 10, lineHeight: 19 }}>
          Fees from cash trips are added to your wallet balance.
        </AppText>
      </Card>
      <Card style={{ alignItems: 'center' }}>
        <AppText variant="bodyStrong">{`Rate ${PASSENGER.name}`}</AppText>
        <View style={{ flexDirection: 'row', gap: 4, marginTop: 6 }} accessibilityRole="radiogroup">
          {[1, 2, 3, 4, 5].map(i => (
            <Pressable key={i} accessibilityRole="radio" accessibilityLabel={`${i} star${i > 1 ? 's' : ''}`} accessibilityState={{ checked: stars === i }} onPress={() => setStars(i)} style={styles.star}>
              <Icon name="star" size={34} strokeWidth={1.5} fill={i <= stars ? colors.ink : 'none'} />
            </Pressable>
          ))}
        </View>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  tick: { width: 64, height: 64, borderRadius: 32, backgroundColor: colors.green, alignItems: 'center', justifyContent: 'center' },
  star: { width: 48, height: 48, alignItems: 'center', justifyContent: 'center' },
});
