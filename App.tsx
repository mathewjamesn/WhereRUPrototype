import React from 'react';
import { StatusBar, View } from 'react-native';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { colors } from './src/theme';
import { navRef, syncCurrentRoute } from './src/nav';
import { ConnectionBanner, PrototypeFab } from './src/ui/Chrome';
import IndexScreen from './src/screens/index';
import AccountScreen from './src/screens/account';
import ArrivedScreen from './src/screens/arrived';
import ChatScreen from './src/screens/chat';
import CollectScreen from './src/screens/collect';
import DetailsScreen from './src/screens/details';
import DocumentsScreen from './src/screens/documents';
import DriverCancelScreen from './src/screens/driver-cancel';
import EarningsScreen from './src/screens/earnings';
import HomeScreen from './src/screens/home';
import InboxScreen from './src/screens/inbox';
import LanguageScreen from './src/screens/language';
import LoginScreen from './src/screens/login';
import OnTripScreen from './src/screens/on-trip';
import OnTripStopsScreen from './src/screens/on-trip-stops';
import OtpScreen from './src/screens/otp';
import PassengerCancelledScreen from './src/screens/passenger-cancelled';
import PermissionsScreen from './src/screens/permissions';
import ProfileScreen from './src/screens/profile';
import PrototypeScreen from './src/screens/prototype';
import RequestScreen from './src/screens/request';
import ReviewScreen from './src/screens/review';
import RideTakenScreen from './src/screens/ride-taken';
import SelfCheckScreen from './src/screens/self-check';
import SettingsScreen from './src/screens/settings';
import SummaryScreen from './src/screens/summary';
import ToPickupScreen from './src/screens/to-pickup';
import TripDetailScreen from './src/screens/trip-detail';
import TripsScreen from './src/screens/trips';
import VehicleScreen from './src/screens/vehicle';
import WalletScreen from './src/screens/wallet';

const Stack = createNativeStackNavigator();
const theme = { ...DefaultTheme, colors: { ...DefaultTheme.colors, background: colors.ground } };

/** Every screen sits in one stack; the tab bar is drawn by the four tab screens themselves. */
export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      <View style={{ flex: 1, backgroundColor: colors.ground }}>
        <NavigationContainer ref={navRef} theme={theme} onReady={syncCurrentRoute} onStateChange={syncCurrentRoute}>
          <Stack.Navigator initialRouteName="index" screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.ground } }}>
          <Stack.Screen name="index" component={IndexScreen} />
          <Stack.Screen name="account" component={AccountScreen} options={{ animation: 'none' }} />
          <Stack.Screen name="arrived" component={ArrivedScreen} />
          <Stack.Screen name="chat" component={ChatScreen} />
          <Stack.Screen name="collect" component={CollectScreen} />
          <Stack.Screen name="details" component={DetailsScreen} />
          <Stack.Screen name="documents" component={DocumentsScreen} />
          <Stack.Screen name="driver-cancel" component={DriverCancelScreen} />
          <Stack.Screen name="earnings" component={EarningsScreen} options={{ animation: 'none' }} />
          <Stack.Screen name="home" component={HomeScreen} options={{ animation: 'none' }} />
          <Stack.Screen name="inbox" component={InboxScreen} />
          <Stack.Screen name="language" component={LanguageScreen} />
          <Stack.Screen name="login" component={LoginScreen} />
          <Stack.Screen name="on-trip" component={OnTripScreen} />
          <Stack.Screen name="on-trip-stops" component={OnTripStopsScreen} />
          <Stack.Screen name="otp" component={OtpScreen} />
          <Stack.Screen name="passenger-cancelled" component={PassengerCancelledScreen} />
          <Stack.Screen name="permissions" component={PermissionsScreen} />
          <Stack.Screen name="profile" component={ProfileScreen} />
          <Stack.Screen name="prototype" component={PrototypeScreen} options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
          <Stack.Screen name="request" component={RequestScreen} options={{ animation: 'slide_from_bottom', gestureEnabled: false }} />
          <Stack.Screen name="review" component={ReviewScreen} />
          <Stack.Screen name="ride-taken" component={RideTakenScreen} />
          <Stack.Screen name="self-check" component={SelfCheckScreen} />
          <Stack.Screen name="settings" component={SettingsScreen} />
          <Stack.Screen name="summary" component={SummaryScreen} />
          <Stack.Screen name="to-pickup" component={ToPickupScreen} />
          <Stack.Screen name="trip-detail" component={TripDetailScreen} />
          <Stack.Screen name="trips" component={TripsScreen} options={{ animation: 'none' }} />
          <Stack.Screen name="vehicle" component={VehicleScreen} />
          <Stack.Screen name="wallet" component={WalletScreen} />
          </Stack.Navigator>
        </NavigationContainer>
        <ConnectionBanner />
        <PrototypeFab />
      </View>
    </SafeAreaProvider>
  );
}
