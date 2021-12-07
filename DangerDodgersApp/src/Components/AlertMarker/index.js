import React, { useEffect, useContext, useState } from "react";
import { Marker } from "react-native-maps";
import { StyleSheet, View } from "react-native";
import { Dialog, Portal, Paragraph, Button, IconButton } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AuthContext from "../../Helpers/Auth";

const AlertMarker = (props) => {
    const context = useContext(AuthContext);
    const [visible, setVisible] = useState(false);
    const [freq, setFreq] = useState(null);
    const [thumbUp, setThumbUp] = useState(false);
    const [thumbDown, setThumbDown] = useState(false);
    const [userOwns, setUserOwns] = useState(false);
    const openMenu = () => setVisible(true);
    const closeMenu = () => setVisible(false);
    const { latitude, longitude, id, risk_level, type, description, title, newAlert } = props.content;

    useEffect(() => {
        const getVotes = async () => {
            const data = await context.useAuthorizedGet(`/report/${id}/votes`)

            if (data.state === 'SUCCESS') {
                setFreq(data.content.frequency);
            }
        };


        const setUserOwnership = async () => {
            if (newAlert) {
                setUserOwns(true);
                return;
            }

            if (!context.getUserId()) {
                const data = await context.useAuthorizedGet('/user/');

                if (data.state === 'SUCCESS') {
                    setUserOwns(data.content.id === props.content.user_id);
                }
            } else {
                setUserOwns(context.getUserId() === props.content.user_id);
            }
        };

        getVotes();
        setUserOwnership();
    }, []);

    const markerPressHandler = () => {
        openMenu();
    };

    const handleDrag = async (event) => {

        const data = await context.useAuthorizedPatch(`/report/${id}`, {
            latitude: event.nativeEvent.coordinate.latitude,
            longitude: event.nativeEvent.coordinate.longitude
        });
        if (data.state === 'SUCCESS') {
            // TODO
        }
    };

    const thumbUpHandler = async () => {
        let data = null;
        if (thumbUp) {
            setThumbUp(false);
            data = await context.useAuthorizedPost(`/report/${id}/downvote`, {});
        } else {
            if (thumbDown) {
                setThumbDown(false);
                data = await context.useAuthorizedPost(`/report/${id}/upvote`, {});
            }
            data = await context.useAuthorizedPost(`/report/${id}/upvote`, {});
            setThumbUp(true);
        }

        if (data.state === 'SUCCESS') {
            setFreq(data.content.frequency);
        }
    };

    const thumbDownHandler = async () => {
        let data = null;
        if (thumbDown) {
            setThumbDown(false);
            data = await context.useAuthorizedPost(`/report/${id}/upvote`, {});
        } else {
            if (thumbUp) {
                setThumbUp(false);
                data = await context.useAuthorizedPost(`/report/${id}/downvote`, {});
            }
            data = await context.useAuthorizedPost(`/report/${id}/downvote`, {});
            setThumbDown(true);
        }

        if (data.state === 'SUCCESS') {
            setFreq(data.content.frequency);
        }
    };

    return (<>
        <Marker onPress={markerPressHandler} draggable={userOwns} coordinate={{ latitude: latitude, longitude: longitude }} onDragEnd={handleDrag}>
            <Icon name="map-marker-alert" size={40} color={userOwns ? '#ff0000' : '#444444'}></Icon>
        </Marker>
            <Portal>
                <Dialog visible={visible} onDismiss={closeMenu}>
                    <Dialog.Title>{title ?? "Alert"}</Dialog.Title>
                    <Dialog.Content>
                        {!!risk_level && <Paragraph>Risk Level: {risk_level}</Paragraph>}
                        {!!type && <Paragraph>Alert Type: {type}</Paragraph>}
                        {!!description && <Paragraph>Description: {description}</Paragraph>}
                        <Paragraph>User Approval: {freq}</Paragraph>
                    </Dialog.Content>
                    <Dialog.Actions style={styles.action}>
                        <View style={styles.row}>
                            {thumbUp ? <IconButton
                                icon="thumb-up"
                                color="#000000"
                                size={20}
                                onPress={thumbUpHandler}
                            /> : <IconButton
                                icon="thumb-up-outline"
                                color="#000000"
                                size={20}
                                onPress={thumbUpHandler}
                            />}
                            {thumbDown
                                ? <IconButton
                                    icon="thumb-down"
                                    color="#000000"
                                    size={20}
                                    onPress={thumbDownHandler}
                                /> : <IconButton
                                    icon="thumb-down-outline"
                                    color="#000000"
                                    size={20}
                                    onPress={thumbDownHandler}
                                />}
                        </View>
                        <View style={styles.row}>
                            <Button onPress={closeMenu}>Close</Button>
                        </View>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
    </>);
}

const styles = StyleSheet.create({
    row: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'nowrap'
    }, action: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'nowrap',
        justifyContent: 'space-between'
    }
});

export default AlertMarker;