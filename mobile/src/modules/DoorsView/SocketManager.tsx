import React, {useState, useContext, useEffect} from 'react';
import {Door} from './DoorType';
import {SocketContext} from '../../context/SocketContext';
import useSocketEmitter from './SocketEmitter';

interface DataType {
  doorsList: Door[];
}

const useSocketManager = (): {
  doorsList: Door[];
  setDoorsList: React.Dispatch<React.SetStateAction<Door[]>>;
  disconnectSocket: () => void;
} => {
  const {refreshDoorsList} = useSocketEmitter();
  const [doorsList, setDoorsList] = useState<Door[]>([]);
  const {socket} = useContext(SocketContext);

  const disconnectSocket = () => {
    socket.disconnect();
  };

  useEffect(() => {
    socket.on('doors', (data: DataType) => {
      setDoorsList(
        data.doorsList.map(item => ({
          lockID: item.lockID,
          doorName: item.doorName,
          isOpen: item.isOpen,
          isExpanded: false,
        })),
      );
    });
  }, [socket]);

  useEffect(() => {
    socket.on('doorStateChanged', () => {
      refreshDoorsList();
    });
  }, [socket]);

  return {
    doorsList,
    setDoorsList,
    disconnectSocket,
  };
};

export default useSocketManager;
