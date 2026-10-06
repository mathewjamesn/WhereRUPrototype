import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import Svg, { Circle, Path, Rect, Text as SvgText } from 'react-native-svg';

/** Illustrated map (no API key needed). The real app uses Google Maps here. */
export function MapArt({
  route,
  stops,
  car = true,
  pulse,
  carAt = [195, 300],
  style,
}: {
  route?: boolean;
  stops?: boolean;
  car?: boolean;
  pulse?: boolean;
  carAt?: [number, number];
  style?: ViewStyle;
}) {
  const [x, y] = carAt;
  const line = 'M120 470 L 128 330 L 228 302 L 248 160';
  return (
    <View style={[StyleSheet.absoluteFill, style]} pointerEvents="none">
      <Svg width="100%" height="100%" viewBox="0 0 390 600" preserveAspectRatio="xMidYMid slice">
        <Rect width="390" height="600" fill="#E4E9ED" />
        <Path d="M-10 430 C 80 390, 140 480, 230 440 S 360 340, 400 370" fill="none" stroke="#C9DDEB" strokeWidth={28} />
        <Path d="M-10 190 L 400 125" stroke="#FFFFFF" strokeWidth={13} fill="none" />
        <Path d="M40 -10 L 150 610" stroke="#FFFFFF" strokeWidth={13} fill="none" />
        <Path d="M262 -10 C 240 200, 300 350, 282 610" stroke="#FFFFFF" strokeWidth={10} fill="none" />
        <Path d="M-10 305 L 400 272" stroke="#FFFFFF" strokeWidth={7} fill="none" />
        <Path d="M120 -10 L 360 610" stroke="#F6F7F8" strokeWidth={5} fill="none" />
        <Path d="M-10 540 L 400 520" stroke="#F6F7F8" strokeWidth={5} fill="none" />
        <Rect x="300" y="190" width="54" height="40" rx="4" fill="#D7DEE3" />
        <Rect x="60" y="215" width="40" height="52" rx="4" fill="#D7DEE3" />
        {route || stops ? (
          <>
            <Path d={line} fill="none" stroke="#000000" strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />
            <Circle cx="120" cy="470" r="9" fill="#0E7C4A" stroke="#FFFFFF" strokeWidth={3} />
            <Rect x="239" y="151" width="18" height="18" fill="#000000" stroke="#FFFFFF" strokeWidth={3} />
          </>
        ) : null}
        {stops
          ? ([
              [128, 330, '1'],
              [228, 302, '2'],
            ] as const).map(([sx, sy, n]) => (
              <React.Fragment key={n}>
                <Circle cx={sx} cy={sy} r="13" fill="#FFFFFF" stroke="#000000" strokeWidth={3} />
                <SvgText x={sx} y={sy + 5} textAnchor="middle" fontSize="14" fontWeight="800" fill="#000000">
                  {n}
                </SvgText>
              </React.Fragment>
            ))
          : null}
        {car ? (
          <>
            {pulse ? (
              <>
                <Circle cx={x} cy={y} r="60" fill="#0E7C4A" fillOpacity={0.1} />
                <Circle cx={x} cy={y} r="34" fill="#0E7C4A" fillOpacity={0.14} />
              </>
            ) : null}
            <Circle cx={x} cy={y} r="20" fill="#1F5FBF" fillOpacity={0.16} />
            <Circle cx={x} cy={y} r="9" fill="#1F5FBF" stroke="#FFFFFF" strokeWidth={3} />
          </>
        ) : null}
      </Svg>
    </View>
  );
}
