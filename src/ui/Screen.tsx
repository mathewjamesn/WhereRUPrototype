import React from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, View, ViewStyle } from 'react-native';
import { router, type Href } from '../nav';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, space } from '../theme';
import { AppText } from './AppText';
import { Icon } from './Icon';

export function goBack(fallback?: Href) {
  if (router.canGoBack()) router.back();
  else if (fallback) router.replace(fallback);
}

/** Standard screen: ground background, optional back header, scrolling body and pinned footer. */
export function Screen(props: {
  title?: string;
  back?: boolean | Href;
  right?: React.ReactNode;
  scroll?: boolean;
  footer?: React.ReactNode;
  bg?: string;
  children: React.ReactNode;
  contentStyle?: ViewStyle;
  bottomInset?: boolean;
}) {
  const { title, back, right, scroll = true, footer, bg = colors.ground, children, contentStyle, bottomInset = true } = props;
  const Body = scroll ? ScrollView : View;
  return (
    <SafeAreaView style={[styles.root, { backgroundColor: bg }]} edges={bottomInset ? ['top', 'bottom'] : ['top']}>
      {title || back ? (
        <View style={styles.header}>
          {back ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Back"
              onPress={() => goBack(typeof back === 'string' ? back : undefined)}
              style={styles.backBtn}
              hitSlop={8}>
              <Icon name="back" size={24} />
            </Pressable>
          ) : null}
          {title ? (
            <AppText variant="title" accessibilityRole="header" style={[styles.title, back ? null : styles.titleNoBack]}>
              {title}
            </AppText>
          ) : (
            <View style={styles.flex} />
          )}
          {right}
        </View>
      ) : null}
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <Body
          style={styles.flex}
          contentContainerStyle={scroll ? [styles.content, contentStyle] : undefined}
          keyboardShouldPersistTaps="handled">
          {scroll ? children : <View style={[styles.flex, styles.content, contentStyle]}>{children}</View>}
        </Body>
        {footer ? <View style={[styles.footer, { backgroundColor: bg }]}>{footer}</View> : null}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  flex: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: space.sm, paddingTop: space.sm, minHeight: 56, gap: 4 },
  backBtn: { width: 48, height: 48, alignItems: 'center', justifyContent: 'center' },
  title: { flex: 1, paddingHorizontal: space.xs },
  titleNoBack: { paddingHorizontal: space.md, fontSize: 28 },
  content: { padding: space.lg, gap: space.lg },
  footer: { padding: space.lg, paddingTop: space.sm, gap: space.sm },
});
