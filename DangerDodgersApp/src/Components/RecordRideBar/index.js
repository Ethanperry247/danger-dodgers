import React, { useContext, useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Appbar, Headline, Dialog, Portal, Paragraph, Button, Snackbar } from 'react-native-paper';
import AuthContext from '../../Helpers/Auth';

const RecordRideBar = (props) => {
    // Visibility state for our modal.
    const context = useContext(AuthContext);
    const [visible, setVisible] = useState(false);
    const [recording, setRecording] = useState(false);
    const [paused, setPaused] = useState(false);
    const [intervalState, setIntervalState] = useState(null);
    const [currentTime, setCurrentTime] = useState(Date.now());
    const [startTime, setStartTime] = useState(Date.now());
    const [pausedDuration, setPausedDuration] = useState(Date.now());
    const [persistData, setPersistData] = useState([]);
    const [timeSinceOrigin, setTimeSinceOrigin] = useState(0);
    const [infoBarVisible, setInfoBarVisible] = useState(false);
    const { latitude, longitude, altitude, handleNewDataPoint } = props;

    const hideDialog = () => {
        setVisible(false);
    };

    const beginInterval = () => {
        setIntervalState(setInterval(() => {
            setCurrentTime(Date.now());
        }, 1000));
    }

    const onStart = () => {
        setRecording(true);
        setStartTime(Date.now());
        setCurrentTime(Date.now());
        beginInterval();
    };

    const onStop = () => {
        clearInterval(intervalState);
        setRecording(false);
        setPaused(false);
        setTimeSinceOrigin(0);
        setPersistData([]);
        handleNewDataPoint(null);
    };

    const onTryStop = () => {
        onPause();
        setVisible(true);
    };

    const onPause = () => {
        clearInterval(intervalState);
        setPaused(true);
        setPausedDuration(Date.now())
    };

    const onResume = async () => {
        setPaused(false);
        await setStartTime(startTime + Date.now() - pausedDuration);
        await setCurrentTime(Date.now());
        beginInterval();
    };

    const handleCancel = () => {
        onStop();
        hideDialog();
    };

    const handleContinue = () => {
        onResume();
        hideDialog();
    };

    const handleAnalyze = async () => {
        hideDialog();

        if (persistData.length < 4) {
            return;
        }

        const data = await context.useAuthorizedPost('/jobs/recording', {
            public: false,
            recording: persistData
        });

        if (data.state === 'SUCCESS') {
            // The case in which the request succeeds, give the user a message accordingly.
            onToggleInfoBar();
        }

        onStop();
    };

    const onToggleInfoBar = () => setInfoBarVisible(!infoBarVisible);

    const onDismissInfoBar = () => setInfoBarVisible(false);

    useEffect(() => {
        // onStart();
        return () => {
            clearInterval(intervalState);
        };
    }, [])

    useEffect(() => {
        setTimeSinceOrigin(timeSinceOrigin + 1);
        if (timeSinceOrigin % 2 === 0) {
            setPersistData([...persistData, {
                latitude,
                longitude,
                altitude: altitude,
                time: timeSinceOrigin
            }]);
            handleNewDataPoint({latitude, longitude});
        }
    }, [currentTime])

    const styles = StyleSheet.create({
        container: {
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: 250,
            height: 60,
            margin: 15,
            borderRadius: 200,
            overflow: 'hidden'
        },
        bar: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            // height: 100,
        },
        play: {
        },
        modal: {
        },
        modalContainer: {
            // backgroundColor: 'white',
            // padding: 20
        },
        recording: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            backgroundColor: 'white',
            margin: 0,
            padding: 0,
            paddingLeft: 20,
            paddingRight: 20,
        }, snackbar: {
            position: 'absolute',
            bottom: 30
        }
    });

    const RecordingDisplay = () => {
        return (<>
            {paused
                ? <Appbar.Action
                    icon="play"
                    onPress={onResume}
                />
                : <Appbar.Action
                    icon="pause"
                    onPress={onPause}
                />
            }
            <View style={styles.recording}>
                <Timer startTime={startTime} currentTime={currentTime}></Timer>
            </View>
            <Appbar.Action
                icon="stop"
                onPress={onTryStop}
            />
        </>);
    };

    return (<>
        <View style={styles.container}>
            <Portal>
                <Dialog visible={visible} onDismiss={hideDialog}>
                    <Dialog.Title>Recording Finished?</Dialog.Title>
                    <Dialog.Content>
                        <Paragraph>If you are finished with your recording, select yes to generate danger analysis of your ride. Otherwise, you can continue recording, or cancel the recording.</Paragraph>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={handleCancel}>Cancel Recording</Button>
                        <Button onPress={handleContinue}>No</Button>
                        <Button onPress={handleAnalyze}>Yes</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
            <Appbar style={styles.bar}>
                {
                    !recording ?
                        <Appbar.Action
                            style={styles.play}
                            size={40}
                            icon="play"
                            onPress={onStart}
                        /> : <RecordingDisplay />
                }
            </Appbar>
        </View>

        <Snackbar
            visible={infoBarVisible}
            onDismiss={onDismissInfoBar}
            duration={2000}
            style={styles.snackbar} >
            Recording analysis processing in background.
        </Snackbar>
    </>)
};

export default RecordRideBar;

const Timer = ({ currentTime, startTime }) => (
    <Headline>
        {
            (() => {
                const date = new Date(currentTime - startTime);
                return `${String(date.getUTCHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`
            })()
        }
    </Headline>
);