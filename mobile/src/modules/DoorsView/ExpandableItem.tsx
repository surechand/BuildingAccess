import React, {useEffect, useState} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {styles} from './Stylesheets/Stylesheets';
import {Door} from './DoorType';

interface ItemProps {
  item: Door;
  onPressFunction: () => void;
  longOpenFunction: () => void;
  quickOpenFunction: () => void;
  closeFunction: () => void;
  // doorsListRefresh: () => void;
}

const ExpandableItem = ({
  item,
  onPressFunction,
  longOpenFunction,
  quickOpenFunction,
  closeFunction,
}: ItemProps): JSX.Element => {
  // Custom Component for the Expandable List
  const [layoutHeight, setLayoutHeight] = useState<number | undefined>(0);

  useEffect(() => {
    if (item.isExpanded) {
      setLayoutHeight(undefined);
    } else {
      setLayoutHeight(0);
    }
  }, [item.isExpanded]);
  return (
    <View>
      {/* Header of the Expandable List Item */}
      <TouchableOpacity
        key={item.lockID.valueOf.toString()}
        activeOpacity={0.8}
        onPress={onPressFunction}
        style={[
          styles.accordionHeaderItem,
          item.isOpen ? styles.inRangeColor : styles.outOfRangeColor,
        ]}>
        <Text style={styles.accordionHeaderText}>{item.doorName}</Text>
      </TouchableOpacity>
      {item.isOpen ? (
        <View
          style={{
            height: layoutHeight,
            overflow: 'hidden',
          }}>
          <TouchableOpacity
            activeOpacity={0.5}
            style={styles.accordionListElement}
            onPress={() =>
              item.isOpen
                ? [closeFunction()]
                : alert(item.doorName.concat(' is not open'))
            }>
            <Text style={styles.accordionListElementText}>Close door</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View
          style={{
            height: layoutHeight,
            overflow: 'hidden',
          }}>
          <TouchableOpacity
            activeOpacity={0.5}
            style={styles.accordionListElement}
            onPress={() =>
              item.isOpen
                ? alert(item.doorName.concat(' is already opened'))
                : longOpenFunction()
            }>
            <Text style={styles.accordionListElementText}>Open door</Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.5}
            style={styles.accordionListElement}
            onPress={() =>
              item.isOpen
                ? alert(item.doorName.concat(' is already opened'))
                : quickOpenFunction()
            }>
            <Text style={styles.accordionListElementText}>Open for 10s</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default ExpandableItem;
