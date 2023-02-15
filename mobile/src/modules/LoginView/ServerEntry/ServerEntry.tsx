import React from 'react';
import {ActivityIndicator, View} from 'react-native';
import {
  EntryContainer,
  TextContainer,
  PrimaryText,
  SecondaryText,
  RangeIcon,
  CheckIcon,
} from './ServerEntry.Components';
import {Colors} from '../Stylesheets/Stylesheets';
import {connectionStates} from '../ServersReducer';

interface EntryProps {
  ip: string;
  description: string;
  connectionStatus: number;
  isSelected: boolean;
  onPress: () => void;
  onLongPress: () => void;
}

const ServerEntry: React.FC<EntryProps> = ({
  ip,
  description,
  isSelected,
  onPress,
  connectionStatus = connectionStates.none,
  onLongPress,
}: EntryProps) => {
  const switchIcon = () => {
    switch (connectionStatus) {
      case connectionStates.none:
        return <RangeIcon name="close" color={Colors.Gray} />;
      case connectionStates.inRange:
        return <RangeIcon name="wifi" color={Colors.Accent} />;
      case connectionStates.connecting:
        return <ActivityIndicator size="large" color={Colors.Accent} />;
      case connectionStates.connected:
        return <RangeIcon name="check" color={Colors.Green} />;
      default:
    }
  };

  return (
    <EntryContainer onPress={onPress} onLongPress={onLongPress}>
      <CheckIcon
        name="check"
        color={isSelected ? 'lightblue' : 'transparent'}
      />
      <TextContainer>
        <PrimaryText>{description}</PrimaryText>
        <SecondaryText>
          IP:
          {ip}
        </SecondaryText>
      </TextContainer>
      <View
        style={{
          flex: 1,
          alignContent: 'center',
          justifyContent: 'center',
        }}>
        {switchIcon()}
      </View>
    </EntryContainer>
  );
};

export default ServerEntry;
