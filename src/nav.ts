import { useSyncExternalStore } from 'react';
import { createNavigationContainerRef, StackActions, useRoute } from '@react-navigation/native';

/**
 * Tiny path-style navigation helper on top of React Navigation, so screens can say
 * router.push('/home') or router.push({ pathname: '/request', params: { stops: '1' } }).
 * Route names are the screen file names ('/' is the launcher, route "index").
 */
export type Href = string | { pathname: string; params?: Record<string, string> };

export const navRef = createNavigationContainerRef<Record<string, object | undefined>>();

function toRoute(h: Href) {
  const path = typeof h === 'string' ? h : h.pathname;
  const params = typeof h === 'string' ? undefined : h.params;
  return { name: path === '/' ? 'index' : path.replace(/^\//, ''), params };
}

export const router = {
  push(h: Href) {
    const r = toRoute(h);
    if (navRef.isReady()) navRef.dispatch(StackActions.push(r.name, r.params));
  },
  replace(h: Href) {
    const r = toRoute(h);
    if (navRef.isReady()) navRef.dispatch(StackActions.replace(r.name, r.params));
  },
  back() {
    if (navRef.isReady() && navRef.canGoBack()) navRef.goBack();
  },
  canGoBack: () => navRef.isReady() && navRef.canGoBack(),
  /** True when there is anything under the current screen to pop. */
  canDismiss: () => navRef.isReady() && navRef.canGoBack(),
  /** Pop back to the first screen in the stack. */
  dismissAll() {
    if (navRef.isReady() && navRef.canGoBack()) navRef.dispatch(StackActions.popToTop());
  },
};

export function useLocalSearchParams<T extends Record<string, string | undefined>>(): Partial<T> {
  return (useRoute().params ?? {}) as Partial<T>;
}

// Current route, tracked from NavigationContainer so components outside the stack can read it.
let current = '/';
const listeners = new Set<() => void>();
export function syncCurrentRoute() {
  const name = navRef.isReady() ? navRef.getCurrentRoute()?.name : undefined;
  const next = !name || name === 'index' ? '/' : `/${name}`;
  if (next !== current) {
    current = next;
    listeners.forEach(l => l());
  }
}
export function usePathname() {
  return useSyncExternalStore(
    l => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    () => current,
  );
}
