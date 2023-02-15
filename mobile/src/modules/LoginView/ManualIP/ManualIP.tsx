import React, { useState } from 'react';
import { SecondaryText, StyledTextInput } from '../LoginView.Components';
import {
  ViewContainerVertical,
  InputContainerHorizontal,
  IconButton,
} from './ManualIP.Components';

interface ManualIPProps {
  connectionHandler: (ip: string, callback?: () => void) => void;
}

const ManualIP: React.FC<ManualIPProps> = ({
  connectionHandler,
}: ManualIPProps) => {
  const [address, setAddress] = useState<string>('');

  return (
    <ViewContainerVertical>
      <SecondaryText style={{ marginTop: 10, marginBottom: 10 }}>
        Manual IP
      </SecondaryText>
      <InputContainerHorizontal>
        <StyledTextInput
          editable
          style={{ height: 40, flex: 7 }}
          placeholder="Server's IP"
          onChangeText={setAddress}
        />
        <IconButton onPress={() => connectionHandler(address)} />
      </InputContainerHorizontal>
    </ViewContainerVertical>
  );
};

export default ManualIP;
