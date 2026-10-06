import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Screen } from '../ui/Screen';
import { AppText } from '../ui/AppText';
import { Button } from '../ui/Button';
import { Card, Money } from '../ui/Parts';
import { Icon } from '../ui/Icon';
import { MapArt } from '../ui/Map';
import { RouteList } from '../ui/Ride';
import { colors } from '../theme';
import { EARN, net, rupees } from '../state/ride';

export default function TripDetail() {
  const facts: [string, string][] = [
    ['Vehicle', 'SUV'],
    ['Distance', '3.5 km'],
    ['Duration', '21 min'],
    ['Pickup charge', '₹0'],
  ];
  return (
    <Screen title="Trip details" back="/trips">
      <View style={styles.map}>
        <MapArt route car={false} />
      </View>
      <Card>
        <RouteList
          points={[
            { kind: 'pick', title: 'Kakkanad, Kochi', sub: 'Started 3:17 PM, 3 Oct' },
            { kind: 'drop', title: 'Sunrise Hospital, Kochi', sub: 'Finished 3:38 PM' },
          ]}
        />
      </Card>
      <View style={styles.grid}>
        {facts.map(([k, v]) => (
          <View key={k} style={styles.fact}>
            <AppText variant="small" color={colors.muted} style={{ fontWeight: '600' }}>
              {k}
            </AppText>
            <AppText style={{ fontSize: 18, fontWeight: '800', marginTop: 2 }}>{v}</AppText>
          </View>
        ))}
      </View>
      <Card style={{ paddingVertical: 6 }}>
        <Money k={`Fare (estimate ₹${EARN.fare})`} v={rupees(EARN.fare)} />
        <Money k="Platform fee" v={`−${rupees(EARN.fee)}`} />
        <Money k="GST on platform fee" v={`−${rupees(EARN.gst)}`} />
        <Money k="You earned" v={rupees(net())} bold color={colors.green} last />
      </Card>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 4 }}>
        <Icon name="check" size={20} color={colors.green} strokeWidth={3} />
        <AppText color={colors.green} style={{ fontSize: 15, fontWeight: '700' }}>
          Paid in cash
        </AppText>
      </View>
      <Button label="Get help with this trip" variant="outline" icon="help" />
    </Screen>
  );
}

const styles = StyleSheet.create({
  map: { height: 150, borderRadius: 18, overflow: 'hidden' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  fact: { width: '48.5%', backgroundColor: colors.white, borderRadius: 14, padding: 12 },
});
