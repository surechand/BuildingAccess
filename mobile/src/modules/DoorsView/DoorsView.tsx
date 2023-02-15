/* eslint-disable no-param-reassign */
import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  LayoutAnimation,
  View,
  Text,
  ScrollView,
  Pressable,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import {StackNavigationProp} from '@react-navigation/stack';
import {useNavigation} from '@react-navigation/core';
import {styles} from './Stylesheets/Stylesheets';
import ExpandableItem from './ExpandableItem';
import {MainStackParams} from '../../navigation/Params';
import useSocketManager from './SocketManager';
import useSocketEmitter from './SocketEmitter';

type doorsScreenProp = StackNavigationProp<MainStackParams, 'Doors'>;

const DoorsView: React.FC = () => {
  const {doorsList, setDoorsList, disconnectSocket} = useSocketManager();
  const {refreshDoorsList, lockLongOpen, lockQuickOpen, lockClose} =
    useSocketEmitter();
  const navigation = useNavigation<doorsScreenProp>();
  const [lastExpanded, setLastExpanded] = useState<string | undefined>();

  const logOut = () => {
    disconnectSocket();
    navigation.navigate('Login');
  };

  const updateLayout = (index: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    const array = [...doorsList];
    array.forEach((el, placeindex) => {
      el.isExpanded =
        placeindex === index
          ? (el.isExpanded = !el.isExpanded)
          : (el.isExpanded = false);
      setLastExpanded(el.lockID);
    });
    setDoorsList(array);
  };

  useEffect(() => {
    refreshDoorsList();
    setLastExpanded(undefined);
    const lastTemp = doorsList.find(el => el.lockID === lastExpanded);
    if (lastTemp) {
      lastTemp.isExpanded = true;
    }
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerRow}>
        <Pressable
          onPress={() => {
            logOut();
          }}>
          <Icon name="log-out" style={styles.headerButton} />
        </Pressable>
        <Text style={styles.headerText}>Available doors</Text>
        <Pressable
          onPress={() => {
            refreshDoorsList();
          }}>
          <Icon name="refresh-ccw" style={styles.headerButton} />
        </Pressable>
      </View>
      <ScrollView>
        {doorsList?.map((door, key) => (
          <ExpandableItem
            key={door.lockID}
            onPressFunction={() => {
              updateLayout(key);
            }}
            longOpenFunction={() => {
              lockLongOpen(door.lockID);
            }}
            quickOpenFunction={() => {
              lockQuickOpen(door.lockID);
            }}
            closeFunction={() => {
              lockClose(door.lockID);
            }}
            item={door}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default DoorsView;
