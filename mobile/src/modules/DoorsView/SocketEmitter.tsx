import {useContext} from 'react';
import {useRoute} from '@react-navigation/core';
import {DoorsScreenRouteProp} from '../../navigation/Params';
import {SocketContext} from '../../context/SocketContext';

const useSocketEmitter = (): {
  refreshDoorsList: () => void;
  lockLongOpen: (lockID: string) => void;
  lockQuickOpen: (lockID: string) => void;
  lockClose: (lockID: string) => void;
} => {
  const {params} = useRoute<DoorsScreenRouteProp>();
  const {email} = params;
  const {socket} = useContext(SocketContext);

  const refreshDoorsList = () => {
    socket.emit('doorsList', {email});
  };

  const lockLongOpen = (lockID: string) => {
    socket.emit('openDoor', {lockID: lockID});
  };

  const lockQuickOpen = (lockID: string) => {
    socket.emit('quickOpenDoor', {lockID: lockID});
  };

  const lockClose = (lockID: string) => {
    socket.emit('closeDoor', {lockID: lockID});
  };

  return {
    refreshDoorsList,
    lockLongOpen,
    lockQuickOpen,
    lockClose,
  };
};

export default useSocketEmitter;
