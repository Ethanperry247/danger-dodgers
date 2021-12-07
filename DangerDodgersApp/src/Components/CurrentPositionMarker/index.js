import * as React from "react";
import { Marker } from "react-native-maps";
import { StyleSheet, View } from "react-native";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const CurrentPositionMarker = (props) => {
    return (<Marker coordinate={props.latlong} image={require('../../Assets/circle.png')}>
    </Marker>);
}

export default CurrentPositionMarker;

const styles = StyleSheet.create({
});