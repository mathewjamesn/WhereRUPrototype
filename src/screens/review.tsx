import React from 'react';
import { StyleSheet, View } from 'react-native';
import { router } from '../nav';
import { Screen } from '../ui/Screen';
import { AppText } from '../ui/AppText';
import { Button, ProtoLink } from '../ui/Button';
import { Chip, ListCard } from '../ui/Parts';
import { Icon, IconName } from '../ui/Icon';
import { colors } from '../theme';
import { proto, REJECT_NOTES, useProto } from '../state/proto';

/** "All documents uploaded" while waiting for approval; reviewer comments when rejected. */
export default function Review() {
  const rejected = useProto(s => s.verification === 'rejected');
  const rows: { icon: IconName; label: string; reason?: string }[] = [
    { icon: 'user', label: 'Profile photo', reason: REJECT_NOTES.photo },
    { icon: 'doc', label: 'Driving licence', reason: REJECT_NOTES.licence },
    { icon: 'car', label: 'Vehicle details' },
    { icon: 'doc', label: 'Vehicle RC' },
  ];
  return (
    <Screen
      footer={
        <>
          {rejected ? (
            <Button
              label="Upload again"
              onPress={() => {
                proto.set({ photo: false, dlBack: false });
                router.replace('/documents');
              }}
            />
          ) : null}
          <Button variant="outline" label="Check status" icon="reset" onPress={() => {}} />
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <ProtoLink
              label="Prototype: approve"
              onPress={() => {
                proto.set({ verification: 'approved' });
                router.replace('/permissions');
              }}
            />
            <ProtoLink label={rejected ? 'Prototype: back to waiting' : 'Prototype: reject'} onPress={() => proto.set({ verification: rejected ? 'pending' : 'rejected' })} />
          </View>
        </>
      }>
      <View style={[styles.badge, { backgroundColor: rejected ? colors.redTint : colors.lime }]}>
        <Icon name="doc" size={30} color={rejected ? colors.red : colors.ink} />
      </View>
      <View style={{ gap: 6 }}>
        <AppText variant="display" accessibilityRole="header">
          {rejected ? 'Some documents need attention' : 'All documents uploaded'}
        </AppText>
        <AppText color={colors.muted} style={{ lineHeight: 23 }}>
          {rejected
            ? 'Our team checked your documents. Please upload the items marked below again.'
            : 'Your account is waiting for approval. This usually takes a day. We’ll notify you as soon as you can go online.'}
        </AppText>
      </View>
      <ListCard>
        {rows.map((r, i) => {
          const bad = rejected && !!r.reason;
          return (
            <View key={r.label} style={[styles.row, i < rows.length - 1 ? styles.divider : null]}>
              <Icon name={r.icon} />
              <View style={{ flex: 1 }}>
                <AppText variant="bodyStrong">{r.label}</AppText>
                {bad ? (
                  <AppText variant="small" color={colors.red} style={{ marginTop: 2 }}>
                    {r.reason}
                  </AppText>
                ) : null}
              </View>
              {bad ? <Chip label="Upload again" bg={colors.redTint} fg={colors.red} /> : rejected ? <Chip label="Approved" bg={colors.greenTint} fg={colors.green} /> : <Chip label="In review" bg={colors.warnTint} fg={colors.warnText} />}
            </View>
          );
        })}
      </ListCard>
      <Button variant="text" icon="help" label="Contact support" />
    </Screen>
  );
}

const styles = StyleSheet.create({
  badge: { width: 64, height: 64, borderRadius: 32, alignItems: 'center', justifyContent: 'center', marginTop: 24 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 60, paddingVertical: 8 },
  divider: { borderBottomWidth: 1, borderBottomColor: colors.line },
});
