import React from 'react';
import {Text, Pressable, ActivityIndicator} from 'react-native';
import {Colors} from './Stylesheets/Stylesheets';

interface ButtonProps {
  isPrimary?: boolean;
  disabled?: boolean;
  loading?: boolean;
  text: string;
  onPress: () => void;
}

const CustomizedButton: React.FC<ButtonProps> = ({
  isPrimary = false,
  text,
  onPress,
  disabled = false,
  loading = false,
}: ButtonProps) => {
  return (
    <Pressable
      style={{flex: 1, justifyContent: 'space-around', alignItems: 'center'}}
      onPress={onPress}
      disabled={disabled}>
      {!loading && (
        <Text
          style={
            isPrimary
              ? {
                  fontSize: 36,
                  fontWeight: '600',
                  color: Colors.Font,
                }
              : {fontSize: 20, color: Colors.Font}
          }>
          {text}
        </Text>
      )}
      {loading && <ActivityIndicator size="large" color={Colors.Accent} />}
    </Pressable>
  );
};

export default CustomizedButton;
