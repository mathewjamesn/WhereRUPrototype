import React from 'react';
import { View } from 'react-native';
import { Icon } from '../ui/Icon';
import { MapArt } from '../ui/Map';
import { KV } from '../ui/Parts';
import { Scrim } from '../ui/Ride';
import { NoticeCard } from '../ui/Trip';
import { colors } from '../theme';
import { PASSENGER } from '../state/ride';

export default function PassengerCancelled() {
  return (
    <View style={{ flex: 1 }}>
      <MapArt route carAt={[120, 470]} />
      <Scrim />
      <NoticeCard
        iconBg={colors.redTint}
        icon={<Icon name="x" size={28} color={colors.red} strokeWidth={3} />}
        title="Passenger cancelled the ride"
        text={`${PASSENGER.name} cancelled at 3:15 PM while you were heading to the pickup in Kakkanad.`}
        extra={
          <View style={{ backgroundColor: colors.ground, borderRadius: 14, paddingHorizontal: 14 }}>
            <KV k="Passenger’s reason" v="Changed my plans" />
            <KV k="Cancellation fee" v="₹25, added to earnings" last />
          </View>
        }
      />
    </View>
  );
}

