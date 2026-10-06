import React from 'react';
import { Alert } from 'react-native';
import { router } from '../nav';
import { Screen } from '../ui/Screen';
import { ListCard, NavRow, SectionLabel } from '../ui/Parts';
import { GATE_ITEMS, proto, useProto } from '../state/proto';

export default function Settings() {
  const lang = useProto(s => s.language);
  const gate = useProto(s => s.gate);
  const review = GATE_ITEMS.filter(i => !gate[i.id]).length;
  return (
    <Screen title="Settings" back="/account">
      <SectionLabel>General</SectionLabel>
      <ListCard>
        <NavRow icon="globe" label="Language" sub={lang === 'ml' ? 'മലയാളം' : 'English'} onPress={() => router.push({ pathname: '/language', params: { from: 'settings' } })} />
        <NavRow icon="sound" label="Ride alert sound" sub="Default" onPress={() => Alert.alert('Ride alert sound', 'Pick from the bundled alert tones.')} last />
      </ListCard>
      <SectionLabel>Permissions</SectionLabel>
      <ListCard>
        <NavRow icon="shield" label="Self check" sub={review ? `${review} to review` : 'All ready'} onPress={() => router.push('/self-check')} last />
      </ListCard>
      <SectionLabel>App data</SectionLabel>
      <ListCard>
        <NavRow
          icon="reset"
          label="Reset app data"
          onPress={() =>
            Alert.alert('Reset app data?', 'You will be signed out and the app starts fresh.', [
              { text: 'Cancel', style: 'cancel' },
              {
                text: 'Reset',
                style: 'destructive',
                onPress: () => {
                  proto.reset();
                  router.replace('/');
                },
              },
            ])
          }
          last
        />
      </ListCard>
    </Screen>
  );
}
