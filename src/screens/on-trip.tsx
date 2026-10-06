import React from 'react';
import { View } from 'react-native';
import { router } from '../nav';
import { AppText } from '../ui/AppText';
import { Button } from '../ui/Button';
import { MapArt } from '../ui/Map';
import { Notice } from '../ui/Parts';
import { Sheet, SlideToConfirm, StatusPill } from '../ui/Ride';
import { SosButton } from '../ui/Trip';
import { colors } from '../theme';
import { useProto } from '../state/proto';
import { SIMPLE } from '../state/ride';

export default function OnTrip() {
  const noNet = useProto(s => s.conn === 'noNet');
  const drop = SIMPLE.points[SIMPLE.points.length - 1];
  return (
    <View style={{ flex: 1 }}>
      <MapArt route carAt={[180, 318]} style={{ bottom: noNet ? 380 : 310 }} />
      <StatusPill text="On trip" right={110} />
      <SosButton />
      <Sheet>
        {noNet ? <Notice tone="red">Your trip is still being recorded on this phone. It will sync when you’re back online.</Notice> : null}
        <View>
          <AppText color={colors.muted} style={{ fontSize: 15, fontWeight: '600' }}>
            Dropping at
          </AppText>
          <AppText style={{ fontSize: 26, fontWeight: '800' }}>{drop.title}</AppText>
          <AppText color={colors.muted} style={{ fontSize: 15, marginTop: 2 }}>{`${SIMPLE.tripKm} km trip, cash ₹${SIMPLE.fare}`}</AppText>
        </View>
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <Button label="Navigate" variant="outline" icon="nav" style={{ flex: 1 }} />
          <Button label="Call" variant="outline" icon="phone" style={{ flex: 1 }} />
        </View>
        <SlideToConfirm label="Slide to end trip" onConfirm={() => router.replace('/collect')} />
      </Sheet>
    </View>
  );
}

