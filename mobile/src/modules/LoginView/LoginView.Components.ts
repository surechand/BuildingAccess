/* eslint-disable import/prefer-default-export */
import { BlurView } from '@react-native-community/blur';
import { Text, View, TextInput, ScrollView } from 'react-native';
import styled from 'styled-components';
import { Shadows, Colors } from './Stylesheets/Stylesheets';

export const LoginViewContainer = styled(View)`
  flex: 1;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  /* border: 1px solid black; */
`;

export const HeaderText = styled(Text)`
  flex: 1.5;
  margin-top: 5%;
  font-weight: 600;
  font-size: 52px;
  color: ${Colors.Font};
  /* text-shadow: ${Shadows.AccentBigger}; */
  /* border: 1px solid black; */
`;

export const SecondaryText = styled(Text)`
  font-size: 24px;
  font-weight: 500;
  color: ${Colors.Font};
  /* text-shadow: ${Shadows.AccentSmaller}; */
`;

export const ServerScrollView = styled(ScrollView)`
  flex: 6;
  width: 90%;
  border: 1px solid ${Colors.Accent};
  border-radius: 5px;
`;

export const InputContainer = styled(View)`
  margin-top: 20px;
  margin-bottom: 10px;
  flex: 2.2;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  /* border: 1px solid black; */
  height: 55%;
  width: 100%;
`;

export const StyledTextInput = styled(TextInput).attrs({
  autoCapitalize: 'none',
})`
  border-radius: 5px;
  padding: 8px;
  width: 90%;
  height: 40%;
  font-size: 22px;
  background-color: ${(props) => (props.editable ? '#f7fbff' : '#707070')};
  border: 1px solid ${Colors.Accent};
`;

export const ButtonsContainer = styled(View)`
  flex: 2;
  width: 100%;
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  /* border: 1px solid black; */
`;

export const StyledBlurView = styled(BlurView)`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
`;
