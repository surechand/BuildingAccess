/* eslint-disable import/prefer-default-export */
import styled from 'styled-components';
import { View } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import { Colors } from '../Stylesheets/Stylesheets';

export const ViewContainerVertical = styled(View)`
  display: flex;
  width: 100%;
  padding-left: 8px;
  margin-bottom: 10px;
  align-items: center;
`;

export const InputContainerHorizontal = styled(View)`
  display: flex;
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
  align-content: center;
  /* border: 1px solid white; */
`;

export const IconButton = styled(Icon).attrs({
  name: 'plus',
})`
  flex: 1;
  color: ${Colors.Accent};
  font-size: 36px;
  align-self: center;
  margin-left: 4px;
`;
