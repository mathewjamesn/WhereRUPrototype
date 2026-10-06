import React, { useState } from 'react';
import { router } from '../nav';
import { Screen } from '../ui/Screen';
import { AppText } from '../ui/AppText';
import { Button } from '../ui/Button';
import { TextField } from '../ui/Parts';
import { colors } from '../theme';
import { proto, useProto } from '../state/proto';

function maskDob(v: string) {
  const d = v.replace(/[^0-9]/g, '').slice(0, 8);
  return [d.slice(0, 2), d.slice(2, 4), d.slice(4, 8)].filter(Boolean).join('/');
}

function ageOf(dob: string): number | null {
  const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(dob);
  if (!m) return null;
  const [, dd, mm, yyyy] = m.map(Number) as unknown as number[];
  const d = new Date(yyyy, mm - 1, dd);
  if (d.getMonth() !== mm - 1 || d.getDate() !== dd) return null;
  const now = new Date();
  let age = now.getFullYear() - yyyy;
  if (now.getMonth() < mm - 1 || (now.getMonth() === mm - 1 && now.getDate() < dd)) age--;
  return age;
}

/** Sign-up fields: first/last name, email, date of birth (no gender, Aadhaar or PAN). */
export default function Details() {
  const saved = useProto(s => s.details);
  const [f, setF] = useState(saved);
  const set = (k: keyof typeof f) => (v: string) => setF(x => ({ ...x, [k]: v }));
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.trim());
  const age = ageOf(f.dob);
  const dobErr = f.dob.length === 10 ? (age === null ? 'Enter a real date, DD/MM/YYYY.' : age < 18 ? 'You must be at least 18 years old.' : null) : null;
  const valid = f.first.trim() && f.last.trim() && emailOk && age !== null && age >= 18;

  return (
    <Screen
      title="Your details"
      back="/login"
      footer={
        <>
          <Button
            label="Continue"
            disabled={!valid}
            onPress={() => {
              proto.set({ details: { ...f, first: f.first.trim(), last: f.last.trim(), email: f.email.trim() } });
              router.replace('/documents');
            }}
          />
          <AppText color={colors.muted} style={{ textAlign: 'center', fontSize: 14 }}>
            Next, you’ll add your photo and documents.
          </AppText>
        </>
      }>
      <AppText color={colors.muted}>Enter your name exactly as it appears on your driving licence.</AppText>
      <TextField label="First name" value={f.first} onChangeText={set('first')} autoComplete="given-name" placeholder="First name" />
      <TextField label="Last name" value={f.last} onChangeText={set('last')} autoComplete="family-name" placeholder="Last name" />
      <TextField
        label="Email"
        value={f.email}
        onChangeText={set('email')}
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
        placeholder="name@example.com"
        error={f.email.length > 4 && !emailOk ? 'Enter a valid email address.' : null}
      />
      <TextField
        label="Date of birth"
        value={f.dob}
        onChangeText={v => set('dob')(maskDob(v))}
        keyboardType="number-pad"
        placeholder="DD/MM/YYYY"
        error={dobErr}
        hint="You must be at least 18 to drive with us."
      />
    </Screen>
  );
}
