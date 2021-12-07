import RNLocation from 'react-native-location';

export default () => {
        RNLocation.configure({
                distanceFilter: 5.0
        })
        RNLocation.requestPermission({
                ios: "whenInUse",
                android: {
                        detail: "coarse"
                }
        }).then(granted => {
                if (granted) {
                        this.locationSubscription = RNLocation.subscribeToLocationUpdates(locations => {
                                console.log(locations)
                        })
                }
        })
}