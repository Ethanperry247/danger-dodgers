import React, { useState } from 'react';
import { Snackbar } from 'react-native-paper';

const SnackBar = (props) => {
    const { snackBarMessage } = props;
    const [visible, setVisible] = useState(false);
    const onToggleSnackBar = () => setVisible(!visible);
    const onDismissSnackBar = () => setVisible(false);

    return (<Snackbar
            visible={visible}
            onDismiss={onDismissSnackBar}
            duration={2000}
            style={styles.snackbar}
            action={{
                label: 'Ok',
                onPress: onDismissSnackBar
            }}>
            { snackBarMessage }
        </Snackbar>);
};

const styles = StyleSheet.create({
    snackbar: {
        position: 'absolute',
        bottom: 30
    }
});