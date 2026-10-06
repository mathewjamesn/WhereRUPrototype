import React, { useEffect, useRef, useState } from 'react';
import { Alert, Pressable, StyleSheet, View } from 'react-native';
import { router } from '../nav';
import { Screen } from '../ui/Screen';
import { AppText } from '../ui/AppText';
import { Button } from '../ui/Button';
import { Avatar, Card, Notice, OptionField, TextField } from '../ui/Parts';
import { Icon } from '../ui/Icon';
import { colors } from '../theme';
import { docsReady, proto, REJECT_NOTES, useProto, type ProtoState } from '../state/proto';

type SlotKey = 'photo' | 'dlFront' | 'dlBack' | 'rcFront' | 'rcBack';
const MAKES: Record<string, string[]> = { Toyota: ['Innova Crysta (SUV)', 'Etios (Sedan)'], Maruti: ['Dzire (Sedan)', 'Ertiga (SUV)', 'Wagon R (Mini)'], Hyundai: ['Aura (Sedan)', 'i10 (Mini)'] };
const YEARS = Array.from({ length: 12 }, (_, i) => String(new Date().getFullYear() - i));

/** Pretends to pick a photo and upload it: short "Uploading…" then "Uploaded". */
function useUpload() {
  const [busy, setBusy] = useState<SlotKey | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);
  const start = (k: SlotKey, ask = true) => {
    const run = () => {
      setBusy(k);
      timer.current = setTimeout(() => {
        proto.set({ [k]: true } as Partial<ProtoState>);
        setBusy(null);
      }, 700);
    };
    if (!ask) return run();
    Alert.alert('Take a photo or choose from gallery', undefined, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Choose from gallery', onPress: run },
      { text: 'Take photo', onPress: run },
    ]);
  };
  return { busy, start };
}

function Slot({ k, label, busy, onPress, note }: { k: SlotKey; label: string; busy: SlotKey | null; onPress: () => void; note?: string | null }) {
  const done = useProto(s => s[k]) && busy !== k;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${label}. ${done ? 'Uploaded' : 'Take a photo or choose from gallery'}`}
      onPress={busy === k ? undefined : onPress}
      style={[styles.slot, done ? styles.slotDone : styles.slotTodo]}>
      <View style={[styles.slotIcon, { backgroundColor: done ? colors.white : colors.lime }]}>
        <Icon name={done ? 'doc' : 'camera'} color={done ? colors.muted : colors.ink} />
      </View>
      <View style={{ flex: 1 }}>
        <AppText variant="bodyStrong">{label}</AppText>
        {busy === k ? (
          <AppText variant="small" color={colors.muted}>Uploading…</AppText>
        ) : note ? (
          <AppText variant="small" color={colors.red}>{`Needs a new upload: ${note}`}</AppText>
        ) : done ? (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <Icon name="check" size={16} color={colors.green} strokeWidth={3} />
            <AppText variant="label" color={colors.green}>Uploaded</AppText>
          </View>
        ) : (
          <AppText variant="small" color={colors.muted} style={{ fontSize: 14 }}>Take a photo or choose from gallery</AppText>
        )}
      </View>
      {done ? <AppText variant="label">Retake</AppText> : null}
    </Pressable>
  );
}

function VehicleForm() {
  const [reg, setReg] = useState('');
  const [type, setType] = useState<string | null>(null);
  const [make, setMake] = useState<string | null>(null);
  const [model, setModel] = useState<string | null>(null);
  const [year, setYear] = useState<string | null>(null);
  const [colour, setColour] = useState<string | null>(null);
  const regOk = /^[A-Z]{2}\s?\d{1,2}\s?[A-Z]{0,3}\s?\d{1,4}$/.test(reg.trim());
  const valid = regOk && type && make && model && year && colour;
  return (
    <Card style={{ gap: 14 }}>
      <TextField
        label="Registration number"
        value={reg}
        onChangeText={v => setReg(v.toUpperCase())}
        autoCapitalize="characters"
        placeholder="KL 07 AB 1234"
        error={reg.length > 5 && !regOk ? 'Enter it as printed on the RC.' : null}
      />
      <OptionField label="Vehicle type" value={type} options={['Car', 'Auto rickshaw']} onChange={setType} />
      <OptionField
        label="Make"
        value={make}
        options={Object.keys(MAKES)}
        onChange={v => {
          setMake(v);
          setModel(null);
        }}
      />
      {make ? <OptionField label="Model" value={model} options={MAKES[make]} onChange={setModel} /> : null}
      <OptionField label="Year of manufacture" value={year} options={YEARS} onChange={setYear} />
      <OptionField label="Colour" value={colour} options={['White', 'Silver', 'Grey', 'Black', 'Red', 'Blue']} onChange={setColour} />
      <Button
        label="Save vehicle"
        disabled={!valid}
        onPress={() => proto.set({ vehicle: { reg: reg.replace(/\s+/g, ''), type: type!, make: make!, model: model!, year: year!, colour: colour! } })}
      />
    </Card>
  );
}

/** Four steps, opening at the first incomplete one (same order as the real app's profile flags). */
export default function Documents() {
  const s = useProto(x => x);
  const ready = docsReady(s);
  const rejected = s.verification === 'rejected';
  const [step, setStep] = useState(() => Math.max(0, docsReady(proto.get()).indexOf(false)));
  const { busy, start } = useUpload();
  const licenceOk = s.licenceNo.trim().length >= 6;
  const last = step === 3;
  const firstMissing = ready.indexOf(false);
  const labels = ['Photo', 'Licence', 'Vehicle', 'Vehicle RC'];

  const next = () => {
    if (!last) return setStep(step + 1);
    proto.set({ verification: 'pending' });
    router.replace('/review');
  };

  return (
    <Screen
      title="Documents"
      right={
        <Pressable
          accessibilityRole="button"
          onPress={() => {
            proto.set({ conn: 'ok' });
            router.replace('/login');
          }}
          style={{ padding: 10 }}>
          <AppText variant="label" color={colors.red} style={{ fontSize: 15 }}>
            Log out
          </AppText>
        </Pressable>
      }
      footer={
        <Button
          label={!ready[step] ? (step === 2 ? 'Save your vehicle to continue' : 'Upload to continue') : last ? (ready.every(Boolean) ? 'Submit for review' : `Finish step ${firstMissing + 1} to submit`) : 'Save and continue'}
          disabled={!ready[step] || (last && !ready.every(Boolean))}
          onPress={next}
        />
      }>
      <View style={styles.stepper} accessibilityRole="tablist">
        {labels.map((l, i) => (
          <Pressable key={l} accessibilityRole="tab" accessibilityState={{ selected: i === step }} onPress={() => setStep(i)} style={{ flex: 1 }}>
            <View style={[styles.bar, { backgroundColor: i === step ? colors.ink : ready[i] ? colors.green : colors.line }]} />
            <AppText variant="small" color={i === step ? colors.ink : colors.muted} style={{ fontWeight: i === step ? '800' : '600' }} numberOfLines={1}>
              {`${i + 1}. ${l}`}
            </AppText>
          </Pressable>
        ))}
      </View>

      {step === 0 ? (
        <View style={{ gap: 14 }}>
          <AppText variant="title">Profile photo</AppText>
          <AppText color={colors.muted} style={{ lineHeight: 22 }}>
            Passengers see this photo. Face the camera in good light, no sunglasses or cap.
          </AppText>
          {rejected && !s.photo ? <Notice tone="red">{`Needs a new photo: ${REJECT_NOTES.photo}`}</Notice> : null}
          <Pressable accessibilityRole="button" accessibilityLabel="Take selfie" onPress={() => start('photo', false)} style={[styles.selfie, s.photo && busy !== 'photo' ? styles.selfieDone : null]}>
            {busy === 'photo' ? (
              <AppText variant="bodyStrong">Uploading…</AppText>
            ) : s.photo ? (
              <>
                <Avatar initials={(s.details.first[0] ?? 'M') + (s.details.last[0] ?? 'J')} size={172} dark />
                <View style={styles.tick}>
                  <Icon name="check" size={20} color={colors.white} strokeWidth={3} />
                </View>
              </>
            ) : (
              <>
                <Icon name="camera" size={32} />
                <AppText variant="bodyStrong">Take selfie</AppText>
              </>
            )}
          </Pressable>
          {s.photo ? <Button variant="outline" label="Retake" pill style={{ alignSelf: 'center' }} height={44} onPress={() => start('photo', false)} /> : null}
        </View>
      ) : null}

      {step === 1 ? (
        <View style={{ gap: 12 }}>
          <AppText variant="title">Driving licence</AppText>
          <TextField
            label="Driving licence number"
            value={s.licenceNo}
            onChangeText={v => proto.set({ licenceNo: v.toUpperCase().replace(/[^A-Z0-9 -]/g, '') })}
            autoCapitalize="characters"
            maxLength={20}
            placeholder="KL07 20110012345"
            error={s.licenceNo.length > 0 && !licenceOk ? 'Enter the licence number as printed on the card.' : null}
          />
          <AppText color={colors.muted}>Both sides. Keep all four corners in the frame and avoid glare.</AppText>
          {!licenceOk ? (
            <AppText variant="small" color={colors.muted}>
              Enter your licence number first, then add the photos.
            </AppText>
          ) : null}
          <View style={!licenceOk ? styles.disabled : null} pointerEvents={licenceOk ? 'auto' : 'none'}>
            <View style={{ gap: 12 }}>
              <Slot k="dlFront" label="Front side" busy={busy} onPress={() => start('dlFront')} />
              <Slot k="dlBack" label="Back side" busy={busy} onPress={() => start('dlBack')} note={rejected && !s.dlBack ? REJECT_NOTES.licence : null} />
            </View>
          </View>
        </View>
      ) : null}

      {step === 2 ? (
        <View style={{ gap: 12 }}>
          <AppText variant="title">Your vehicle</AppText>
          <AppText color={colors.muted}>The vehicle you’ll drive. Enter it exactly as on the RC.</AppText>
          {s.vehicle ? (
            <Card style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <Icon name="car" />
              <View style={{ flex: 1 }}>
                <AppText variant="bodyStrong">{s.vehicle.reg}</AppText>
                <AppText variant="small" color={colors.muted}>{`${s.vehicle.make} ${s.vehicle.model}, ${s.vehicle.colour}, ${s.vehicle.year}`}</AppText>
              </View>
              <Pressable accessibilityRole="button" onPress={() => proto.set({ vehicle: null })} style={{ padding: 8 }}>
                <AppText variant="label">Edit</AppText>
              </Pressable>
            </Card>
          ) : (
            <VehicleForm />
          )}
        </View>
      ) : null}

      {step === 3 ? (
        <View style={{ gap: 12 }}>
          <AppText variant="title">Vehicle RC</AppText>
          <AppText color={colors.muted}>Registration certificate of the vehicle you’ll drive. Clear and readable.</AppText>
          {!s.vehicle ? (
            <Button variant="outline" label="Add your vehicle details first" onPress={() => setStep(2)} />
          ) : (
            <>
              <Card style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <Icon name="car" />
                <AppText variant="bodyStrong">{`${s.vehicle.reg} · ${s.vehicle.model}`}</AppText>
              </Card>
              <Slot k="rcFront" label="Front side" busy={busy} onPress={() => start('rcFront')} />
              <Slot k="rcBack" label="Back side" busy={busy} onPress={() => start('rcBack')} />
            </>
          )}
        </View>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  stepper: { flexDirection: 'row', gap: 8 },
  bar: { height: 5, borderRadius: 3, marginBottom: 6 },
  slot: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderRadius: 16, minHeight: 72 },
  slotTodo: { backgroundColor: colors.white, borderWidth: 2, borderStyle: 'dashed', borderColor: '#BDBDBD' },
  slotDone: { backgroundColor: colors.greenTint, borderWidth: 1.5, borderColor: colors.green },
  slotIcon: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  selfie: { alignSelf: 'center', width: 180, height: 180, borderRadius: 90, borderWidth: 3, borderStyle: 'dashed', borderColor: '#BDBDBD', backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center', gap: 8 },
  selfieDone: { borderStyle: 'solid', borderColor: colors.green, backgroundColor: colors.ink },
  tick: { position: 'absolute', right: 6, bottom: 6, width: 40, height: 40, borderRadius: 20, backgroundColor: colors.green, borderWidth: 3, borderColor: colors.white, alignItems: 'center', justifyContent: 'center' },
  disabled: { opacity: 0.45 },
});
