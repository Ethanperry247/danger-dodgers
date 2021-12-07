import * as React from "react";
import { List, Modal, Portal } from 'react-native-paper';
import { StyleSheet, Text, View } from "react-native";

const HeatMapSelector = (props) => {
    const [visible, setVisible] = React.useState(props.open);

    return (
        <Portal>
            <Modal visible={visible} onDismiss={() => setVisible(false)} style={styles.selector}>
                <View>
                    <View>
                        <Text>
                            This is a menu!
                        </Text>
                    </View>
                </View>
            </Modal>
        </Portal>
    );
}

export default HeatMapSelector;

const styles = StyleSheet.create({
    selector: {
        backgroundColor: 'white',
        // height: '50%',
        top: '30%'
    },
});


// <List.Accordion
//     title="Controlled Accordion"
//     left={props => <List.Icon {...props} icon="folder" />}
//     expanded={expanded}
//     onPress={handlePress}>
//     <List.Item title="First item" />
//     <List.Item title="Second item" />
// </List.Accordion>