import React, { useEffect, useContext, useState } from 'react';
import { View, ScrollView, RefreshControl, StyleSheet } from 'react-native';
import { Text, List, Headline, Paragraph, Avatar, ProgressBar, Portal, Dialog, Button, TextInput } from 'react-native-paper';
import AuthContext from '../../Helpers/Auth';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

const Alerts = ({ navigation }) => {
  const context = useContext(AuthContext);
  const [alerts, setAlerts] = useState(new Map());
  const [refreshing, setRefreshing] = React.useState(false);

  useEffect(() => {
    getAlerts();
  }, []);

  const getAlerts = async () => {
    const data = await context.useAuthorizedGet('/report/list');
    if (data.state === 'SUCCESS') {
      const map = new Map();

      const reformatted = data.content?.length > 0 && data.content?.map((alert) => {
        return {
          ...alert,
          timestamp: new Date(Date.parse(alert.timestamp))
        };
      })

      reformatted.length > 0 && reformatted.map((alert) => {
        const dateString = alert.timestamp.toDateString();
        if (map.has(dateString)) {
          map.set(dateString, [...map.get(dateString), alert])
        } else {
          map.set(dateString, [alert])
        }
      })

      setAlerts(map);
    }
  };

  const updateHandler = (date, alert) => {
    navigation.navigate("Alert Details", { ...alert, timestamp: alert.timestamp.toLocaleTimeString(), date: date });
  };

  return (
    <ScrollView
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={getAlerts}
        />}>
      <List.Section>
        {/* <List.Subheader>My Alerts</List.Subheader> */}
        {
          alerts.size > 0 && Array.from(alerts.keys()).map((date, outerIndex) => {
            return (<List.Accordion title={date} key={outerIndex}>
              {alerts.get(date).map((alert, index) => {
                return (<List.Item
                  key={index}
                  title={"Alert Created at " + alert.timestamp.toLocaleTimeString()}
                  right={() => <List.Icon icon="chevron-right" />}
                  onPress={() => updateHandler(date, alert)}
                />);
              })}
            </List.Accordion>)
          })
        }
      </List.Section>
    </ScrollView>
  );
};

const Update = (props) => {
  const { date, risk_level, description, type, id, title } = props.route.params;

  const context = useContext(AuthContext);
  const [visible, setVisible] = useState(false);
  const showDialog = () => setVisible(true);
  const hideDialog = () => setVisible(false);
  const [current, setCurrent] = useState(0);
  const [field, setField] = useState('');

  const options = [
    "Title",
    "Description",
    "Risk Level",
    "Hazard Type",
  ];

  const updateHandler = async (index) => {
    await setCurrent(index);
    showDialog();
  };

  const handleCancel = () => {
    hideDialog();
    setField('');
  };

  const handleSubmit = async () => {
    const data = await context.useAuthorizedPatch(`/report/${id}`, {
      // Spot for future improvement, could be implemented/organized differently:
      title: current === 0 ? field : null,
      description: current === 1 ? field : null,
      risk_level: current === 2 ? field : null,
      type: current === 3 ? field : null,
    });

    hideDialog();
  };

  return (<ScrollView style={styles.container}>
    <View style={styles.heading}>
      <View style={styles.avatar}>
        <Avatar.Icon
          size={100}
          icon="map-marker-alert" />
      </View>
      <Headline style={styles.head}>{title ?? "Alert"}</Headline>
      <Headline style={styles.subhead}>Created on {date}</Headline>
    </View>
    <View style={styles.body}>
      <View style={styles.row}>
        <Paragraph>Suggested Risk Level: </Paragraph>
        <ProgressBar progress={(risk_level ?? 0) / 10} style={styles.progress} />
        <Paragraph>{risk_level ?? 0} / 10</Paragraph>
      </View>
      {description && <Paragraph>Description: {description}</Paragraph>}
      {type && <Paragraph>Hazard Type: {type}</Paragraph>}
    </View>
    <List.Section>
        {options.map((option, index) => {
          return (
            <List.Item
              key={index}
              title={"Edit " + option}
              right={() => <List.Icon icon="chevron-right" />}
              onPress={() => updateHandler(index)}
            />
          );
        })}
    </List.Section>

    <Portal>
        <Dialog visible={visible} onDismiss={hideDialog}>
          <Dialog.Title>{"Change " + options[current]}</Dialog.Title>
          <Dialog.Content>
            <Paragraph>Please enter updated information.</Paragraph>
            <TextInput
              label={"New " + options[current]}
              value={field}
              onChangeText={text => setField(text)}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button style={{ color: '#ff0000' }} onPress={handleCancel}>Cancel</Button>
            <Button onPress={handleSubmit}>Done</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
  </ScrollView>);
};

const A = () => {
  return (
    <Stack.Navigator screenOptions={{
      headerShown: true
    }}>
      <Stack.Screen name="Alerts" component={Alerts} />
      <Stack.Screen name="Alert Details" component={Update} />
    </Stack.Navigator>);
};

const styles = StyleSheet.create({
  heading: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  }, container: {
    ...StyleSheet.absoluteFillObject,
    padding: 16,
    paddingTop: 32,
    marginBottom: 24
  },
  avatar: {
    padding: 32
  }, subhead: {
    fontSize: 20
  }, head: {
    fontSize: 32
  }, progress: {
    height: 5,
    marginTop: 10,
    marginBottom: 10
  }, row: {
  }, body: {
    paddingTop: 16
  }
})

export default A;