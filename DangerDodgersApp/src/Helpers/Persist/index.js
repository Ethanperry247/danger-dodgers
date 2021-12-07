import AsyncStorage from '@react-native-async-storage/async-storage';

const store = async (key, value) => {
    try {
        await AsyncStorage.setItem(key, value);
    } catch (error) {
        console.error(error);
        return null;
    }
}

const retrieve = async (key) => {
    try {
        const value = await AsyncStorage.getItem(key);
        if (value !== null) {
            return value;
        } else {
            return null;
        }
    } catch (error) {
        console.error(error);
        return null;
    }
}
const remove = async (key) => {
    try {
        await AsyncStorage.removeItem(key);
    } catch (error) {
        console.error(error);
    }
}

export default { store, retrieve, remove };
