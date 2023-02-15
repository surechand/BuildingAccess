import AsyncStorage from '@react-native-async-storage/async-storage';

const useLocalObjStorage = <Type>(
  storageKey: string,
): [() => Promise<Type>, (object: Type) => void] => {
  const fetchObject = async (): Promise<Type> => {
    try {
      const jsonString = await AsyncStorage.getItem('@'.concat(storageKey));
      // console.log(jsonString);
      return jsonString != null ? JSON.parse(jsonString) : null;
    } catch (e) {
      console.log('asyncstorage error');
      throw e;
    }
  };

  const saveObject = async (object: Type) => {
    try {
      const jsonString = JSON.stringify(object);
      // console.log(jsonString);
      await AsyncStorage.setItem('@'.concat(storageKey), jsonString);
    } catch (e) {
      console.log(e);
      throw e;
    }
  };

  return [fetchObject, saveObject];
};

export default useLocalObjStorage;
