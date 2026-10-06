import React from 'react';
import { StyleSheet, View } from 'react-native';
import { router } from '../nav';
import { Screen } from '../ui/Screen';
import { AppText } from '../ui/AppText';
import { Button } from '../ui/Button';
import { Card } from '../ui/Parts';
import { Icon } from '../ui/Icon';
import { MapArt } from '../ui/Map';
import { colors } from '../theme';
import { approvedDriver, proto } from '../state/proto';

/** Prototype launcher. Not part of the real app. */
export default function Start() {
  return (
    <Screen bg={colors.white}>
      <View style={styles.hero}>
        <MapArt route carAt={[120, 470]} />
        <View style={styles.brand}>
          <AppText color={colors.lime} style={{ fontSize: 15, fontWeight: '800' }}>
            WhereRU Driver
          </AppText>
        </View>
      </View>
      <View style={{ gap: 6 }}>
        <AppText variant="display">Driver app prototype</AppText>
        <AppText color={colors.muted}>Clickable version 2.0 of the driver screens. Nothing here talks to the server, so try anything.</AppText>
      </View>
      <Button
        label="Start as a new driver"
        icon="user"
        onPress={() => {
          proto.reset();
          router.replace('/language');
        }}
      />
      <Button
        label="Start as an approved driver"
        variant="outline"
        icon="car"
        onPress={() => {
          proto.reset(approvedDriver);
          router.replace('/home');
        }}
      />
      <Button label="Browse all screens" variant="lime" icon="grid" onPress={() => router.push('/prototype')} />
      <Card style={{ backgroundColor: colors.ground, flexDirection: 'row', gap: 12 }}>
        <Icon name="info" color={colors.muted} />
        <AppText variant="small" color={colors.muted} style={{ flex: 1, fontSize: 14, lineHeight: 20 }}>
          The small dark tab on the right edge of every screen opens the prototype menu. Use it to jump to any screen or to simulate no internet and location off.
        </AppText>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: { height: 200, borderRadius: 24, overflow: 'hidden', marginTop: 8 },
  brand: { position: 'absolute', left: 16, bottom: 16, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12, backgroundColor: colors.ink },
});
