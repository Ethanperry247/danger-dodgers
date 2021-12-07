import React, { useState, useEffect } from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import { Text, List, Portal, Dialog, Button, Paragraph, Switch } from 'react-native-paper';
import Slider from '@react-native-community/slider';
import Persist from '../../Helpers/Persist';


const Settings = () => {
  const [value, setValue] = useState(0.5);
  const [initialValue, setIntialValue] = useState(0.5);
  const [visible, setVisible] = useState(false);
  const showDialog = () => setVisible(true);
  const hideDialog = () => setVisible(false);
  
  const [outlineVisible, setOutlineVisible] = useState(false);
  const showOutlineDialog = () => setOutlineVisible(true);
  const hideOutlineDialog = () => setOutlineVisible(false);

  useEffect(() => {
    const getRadiusValue = async () => {
      const stored = await Persist.retrieve('radius');
      if (stored) {
        const storedValue = (Math.round(convertKilometersToMiles(Number(stored)) * 100) / 100);
        setValue(storedValue);
        setIntialValue(storedValue);
      }
    };

    getRadiusValue();
  }, [visible]);

  const [isSwitchOn, setIsSwitchOn] = useState(false);

  const onToggleSwitch = () => setIsSwitchOn(!isSwitchOn);

  useEffect(() => {
    const getRadiusValue = async () => {
      const stored = await Persist.retrieve('radius-toggle');
      if (stored) {
        setIsSwitchOn(stored === 'on' ? true : false);
      }
    };

    getRadiusValue();
  }, [outlineVisible])

  const convertMilesToKilometers = (miles) => {
    return miles * 1.60934;
  }

  const convertKilometersToMiles = (km) => {
    return km * 0.621371;
  }

  const handleCancel = () => {
    hideDialog();
  };

  const handleSubmit = () => {
    Persist.store('radius', String(convertMilesToKilometers(value)));
    hideDialog();
  };

  const handleChange = (displayValue) => {
    setValue(Math.round(displayValue * 100) / 100);
  };


  // Future improvements -- abstract the dialogs to one central component to avoid code duplication.
  const handleOutlineCancel = () => {
    hideOutlineDialog();
  };

  const handleOutlineSubmit = () => {
    if (isSwitchOn) {
      Persist.store('radius-toggle', 'on');
    } else {
      Persist.store('radius-toggle', 'off');
    }
    hideOutlineDialog();
  };

  return (
    <ScrollView>
      <List.Section>
        <List.Subheader>Map Settings</List.Subheader>
        <List.Item
          title={"Alert Display Radius"}
          right={() => <List.Icon icon="chevron-right" />}
          onPress={showDialog}
        />
        <List.Item
          title={"Show Display Radius Outline"}
          right={() => <List.Icon icon="chevron-right" />}
          onPress={showOutlineDialog}
        />
      </List.Section>
      <Portal>
        <Dialog visible={visible} onDismiss={hideDialog}>
          <Dialog.Title>{"Change Alert Display Radius"}</Dialog.Title>
          <Dialog.Content>
            <Paragraph>Set the search radius for alerts around your location.</Paragraph>
            <View style={styles.element}>
              <Slider
                style={{ width: 200, height: 40 }}
                minimumValue={0.125}
                maximumValue={20}
                minimumTrackTintColor="#000000"
                maximumTrackTintColor="#000000"
                thumbTintColor="#000000"
                onValueChange={handleChange}
                value={initialValue}
              ></Slider>
              <Text>{value + " miles"}</Text>
            </View>
          </Dialog.Content>
          <Dialog.Actions>
            <Button style={{ color: '#ff0000' }} onPress={handleCancel}>Cancel</Button>
            <Button onPress={handleSubmit}>Done</Button>
          </Dialog.Actions>
        </Dialog>

        <Dialog visible={outlineVisible} onDismiss={hideOutlineDialog}>
          <Dialog.Title>{"Change Alert Display Radius"}</Dialog.Title>
          <Dialog.Content>
            <Paragraph>Toggle to display alert search radius outline.</Paragraph>
            <View style={styles.element}>
              <Switch value={isSwitchOn} onValueChange={onToggleSwitch} />
              <Text>Search radius outline is currently {isSwitchOn ? "on" : "off"}.</Text>
            </View>
          </Dialog.Content>
          <Dialog.Actions>
            <Button style={{ color: '#ff0000' }} onPress={handleOutlineCancel}>Cancel</Button>
            <Button onPress={handleOutlineSubmit}>Done</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </ScrollView>
  )
};

const styles = StyleSheet.create({
  element: {
    display: 'flex',
    flexWrap: 'nowrap',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  }
});

export default Settings;