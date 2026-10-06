import React from 'react';
import { Alert } from 'react-native';
import { Screen } from '../ui/Screen';
import { AppText } from '../ui/AppText';
import { Button } from '../ui/Button';
import { Chip, KV, ListCard, SwitchRow } from '../ui/Parts';
import { colors } from '../theme';
import { proto, useProto } from '../state/proto';
import { View } from 'react-native';

export default function VehicleScreen() {
  const s = useProto(x => x);
  const v = s.vehicle;
  return (
    <Screen title="My vehicle" back="/account">
      <ListCard>
        <KV k="Category" v="SUV" />
        <KV k="Registration" v={v?.reg ?? 'KL07AB1234'} />
        <KV k="Vehicle" v={v ? `${v.make} ${v.model}` : 'Toyota Innova Crysta'} />
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', minHeight: 52 }}>
          <AppText color={colors.muted} style={{ fontSize: 15 }}>
            Status
          </AppText>
          <Chip label="Verified" bg={colors.greenTint} fg={colors.green} />
        </View>
      </ListCard>
      <Button label="Request RC change" variant="outline" icon="doc" onPress={() => Alert.alert('Request RC change', 'Opens the vehicle and RC steps again for review.')} />
      <AppText variant="small" color={colors.muted} style={{ marginTop: -8, marginLeft: 4 }}>
        Our team reviews RC changes before you can go online with the new vehicle.
      </AppText>
      <AppText variant="heading" style={{ marginLeft: 4 }}>
        Ride types you accept
      </AppText>
      <ListCard>
        <SwitchRow label="Mini rides" sub="Paid at Mini fares" value={s.acceptsMini} onChange={x => proto.set({ acceptsMini: x })} />
        <SwitchRow label="Sedan rides" sub="Paid at Sedan fares" value={s.acceptsSedan} onChange={x => proto.set({ acceptsSedan: x })} last />
      </ListCard>
    </Screen>
  );
}
