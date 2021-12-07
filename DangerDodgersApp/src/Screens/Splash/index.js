import React, { useEffect, useMemo, useRef } from 'react';
import { View, Image, Animated } from 'react-native';
import { StyleSheet } from 'react-native';
import { withTheme } from 'react-native-paper';

// Load all assets in this Splash screen, adjust animation time accordingly.
const Splash = (props) => {
    const { handleFinishedLoading } = props;
    const fadeIn = useRef(new Animated.Value(0)).current;
    const colorFade = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        setTimeout(() => {
            // Use callback from parent to trigger when the splash animation is over.
            handleFinishedLoading()
        }, 3000);
    }, []);

    useEffect(() => {
        Animated.timing(fadeIn, {
            toValue: 3,
            duration: 3000,
            useNativeDriver: true
        }).start();
    }, [fadeIn])

    return (
        <View style={styles.background}>
            <Animated.View style={{
                opacity: fadeIn.interpolate({
                    inputRange: [0.5, 1, 2.5, 3],
                    outputRange: [0, 1, 1, 0]
                }),
                ...styles.background
            }}>
                <Image style={styles.image} source={require('../../Assets/logo.png')}></Image>
            </Animated.View>
        </View>);
};

export default withTheme(Splash);

const styles = StyleSheet.create({
    background: {
        backgroundColor: '#ffffff',
        ...StyleSheet.absoluteFillObject,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    }, image: {
        width: '100%',
        height: 300
    }
});