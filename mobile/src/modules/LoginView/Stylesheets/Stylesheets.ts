/* eslint-disable import/prefer-default-export */
import { StyleSheet } from 'react-native';

export const Styles = StyleSheet.create({
  Background: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: '#373838',
  },
});

export const Colors = {
  Font: '#f7fbff',
  Accent: '#0288f5',
  Alert: '#fc7e00',
  Gray: '#8f8f8f',
  Green: '#1abd46',
  Red: '#e30505',
};

export const Shadows = {
  AccentBigger: '0px 0px 5px #0288f5',
  AccentSmaller: '0px 0px 2px #0288f5',
};
