import React from 'react';
import {Text, View, Modal, Button} from 'react-native';

interface ModalProps {
  visible: boolean;
  handleClose: () => void;
}
const AccountModal: React.FC<ModalProps> = ({
  visible,
  handleClose,
}: ModalProps) => (
  <Modal
    animationType="fade"
    visible={visible}
    onRequestClose={handleClose}
    transparent>
    <View
      style={{
        height: '20%',
        backgroundColor: 'white',
        marginHorizontal: 30,
        marginVertical: 320,
        borderRadius: 5,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
      }}>
      <Text style={{fontSize: 18}}>
        Aby otrzymać swoje dane logowania do systemu skontaktuj się z
        administratorem.
      </Text>
      <Button onPress={handleClose} title="Ok" />
    </View>
  </Modal>
);

export default AccountModal;
