import React, { useState } from 'react';
import { Alert, Pressable, View } from 'react-native';
import { Screen } from '../ui/Screen';
import { AppText } from '../ui/AppText';
import { Button } from '../ui/Button';
import { Card, TextField } from '../ui/Parts';
import { Icon } from '../ui/Icon';
import { colors } from '../theme';
import { proto, useProto } from '../state/proto';

export default function Profile() {
  const s = useProto(x => x);
  const [f, setF] = useState({ first: s.details.first, last: s.details.last, dob: s.details.dob, lic: s.licenceNo });
  const mobile = s.mobile || '9876543210';
  return (
    <Screen title="Profile" back="/account">
      <Card style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <Icon name="phone" />
        <View style={{ flex: 1 }}>
          <AppText variant="label" color={colors.muted} style={{ fontWeight: '600' }}>
            Mobile number
          </AppText>
          <AppText style={{ fontSize: 17, fontWeight: '700' }}>{`+91 •••••• ${mobile.slice(-4)}`}</AppText>
        </View>
        <Pressable accessibilityRole="button" onPress={() => Alert.alert('Change number', 'We send a code to your new number before it changes.')} style={{ padding: 12 }}>
          <AppText color={colors.green} style={{ fontSize: 16, fontWeight: '800' }}>
            Change
          </AppText>
        </Pressable>
      </Card>
      <Card style={{ gap: 14 }}>
        <TextField label="First name" value={f.first} onChangeText={v => setF({ ...f, first: v })} />
        <TextField label="Last name" value={f.last} onChangeText={v => setF({ ...f, last: v })} />
        <TextField label="Date of birth" value={f.dob} onChangeText={v => setF({ ...f, dob: v })} />
        <TextField label="Driving licence number" value={f.lic} autoCapitalize="characters" onChangeText={v => setF({ ...f, lic: v.toUpperCase() })} />
      </Card>
      <Button
        label="Save changes"
        onPress={() => {
          proto.set({ details: { ...s.details, first: f.first, last: f.last, dob: f.dob }, licenceNo: f.lic });
          Alert.alert('Saved');
        }}
      />
      <Button label="Delete my account" variant="text" color={colors.red} onPress={() => Alert.alert('Delete my account', 'The real app asks for confirmation and explains what is deleted.')} />
    </Screen>
  );
}
