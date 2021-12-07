import { PermissionsAndroid } from "react-native";

const requestPermissions = async () => {
  try {
    await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
      {
        title: "Access Coarse Location Services",
        message: "This app needs to use your location in order to use the built-in map.",
        buttonNegative: "Cancel",
        buttonPositive: "OK"
      }
    );
    await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: "Access Fine Location Services",
        message: "This app needs to use your location in order to use the built-in map.",
        buttonNegative: "Cancel",
        buttonPositive: "OK"
      }
    );
  } catch (err) {
    console.warn(err);
  }
};

export default { requestPermissions };