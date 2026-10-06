import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { router } from '../nav';
import { AppText } from '../ui/AppText';
import { Button } from '../ui/Button';
import { Icon } from '../ui/Icon';
import { MapArt } from '../ui/Map';
import { Sheet, StatusPill } from '../ui/Ride';
import { MoreButton, PassengerRow } from '../ui/Trip';
import { colors } from '../theme';
import { PASSENGER, SIMPLE } from '../state/ride';

export default function ToPickup() {
  return (
    <View style={{ flex: 1 }}>
      <MapArt route carAt={[120, 470]} style={{ bottom: 340 }} />
      <StatusPill text="Heading to pickup" />
      <MoreButton />
      <Sheet>
        <View>
          <AppText style={{ fontSize: 26, fontWeight: '800' }}>{`Pickup is ${SIMPLE.pickupKm} km away`}</AppText>
          <AppText color={colors.muted} style={{ fontSize: 15, marginTop: 2 }}>
            29G5+3GC, Kakkanad, Kochi 682030
          </AppText>
        </View>
        <PassengerRow unread={1} />
        <Pressable accessibilityRole="button" onPress={() => router.push('/chat')} style={styles.preview}>
          <Icon name="chat" size={20} />
          <View style={{ flex: 1 }}>
            <AppText style={{ fontSize: 13, fontWeight: '700' }}>{`New message from ${PASSENGER.name.split(' ')[0]}`}</AppText>
            <AppText numberOfLines={1} style={{ fontSize: 15, fontWeight: '600' }}>
              I’m at the Infopark main gate, blue shirt
            </AppText>
          </View>
          <AppText style={{ fontSize: 15, fontWeight: '800' }}>Reply</AppText>
        </Pressable>
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <Button label="Navigate" variant="outline" icon="nav" style={{ flex: 1 }} />
          <Button label="I’ve arrived" style={{ flex: 1 }} onPress={() => router.replace('/arrived')} />
        </View>
      </Sheet>
    </View>
  );
}

const styles = StyleSheet.create({
  preview: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12, paddingHorizontal: 14, borderRadius: 14, backgroundColor: colors.lime },
});
