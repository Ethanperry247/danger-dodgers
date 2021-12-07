import React, { useEffect, useContext, useState } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Button, Text, Paragraph, Dialog, Portal, List, TextInput, Snackbar, Avatar, Headline } from 'react-native-paper';
import { createStackNavigator } from '@react-navigation/stack';
import AuthContext from '../../Helpers/Auth';

const Stack = createStackNavigator();

const Settings = ({ navigation }) => {
  const context = useContext(AuthContext);
  const [first, setFirst] = useState('');
  const [last, setLast] = useState('');
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  const [refreshing, setRefreshing] = useState(false);


  const getUserData = async () => {
    const data = await context.useAuthorizedGet('/user/');
    if (data.state === 'SUCCESS') {
      setFirst(data.content.firstname);
      setLast(data.content.lastname);
      setPhone(data.content.phone);
      setUsername(data.content.username);
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  const handleLogOut = () => {
    context.signOut();
  };

  const refresh = () => {
    getUserData();
  };

  return (
    <ScrollView style={styles.settings}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={refresh}
        />}>
      <View style={styles.heading}>
        <View style={styles.avatar}>
          <Avatar.Icon
            size={100}
            icon="account" />
        </View>
        <Headline style={styles.head}>Welcome {first}!</Headline>
        <Headline style={styles.subhead}>Account Settings</Headline>
      </View>
      <View style={styles.infoContainer}>
      <List.Section>
        {Boolean(phone) && <List.Item
          title={phone}
          left={() => <List.Icon icon="phone" />}
        />}
        {Boolean(username) && <List.Item
          title={username}
          left={() => <List.Icon icon="email" />}
        />}
      </List.Section>
      </View>
      <View style={styles.buttonContainer}>
        <Button onPress={() => navigation.navigate("Update Account")} styles={styles.button}>Update Account Information</Button>
        <Button onPress={handleLogOut} styles={styles.button}>Log Out</Button>
      </View>
    </ScrollView>
  );
};

const Account = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Account Settings" component={Settings} />
      <Stack.Screen name="Update Account" component={Update} />
    </Stack.Navigator>);
}

const styles = StyleSheet.create({
  settings: {
    padding: 10,
    ...StyleSheet.absoluteFillObject,
    // display: 'flex',
    // flexDirection: 'column',
    // justifyContent: 'space-between',
  }, button: {
  }, buttonContainer: {
    paddingTop: 15
  }, infoContainer: {
  },
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
    width: 150
  }, row: {
  }, body: {
    paddingTop: 16
  }, paddingBottom: {
    paddingBottom: 16
  }
});

const Update = () => {
  const context = useContext(AuthContext);

  const [visible, setVisible] = useState(false);
  const showDialog = () => setVisible(true);
  const hideDialog = () => setVisible(false);
  const [current, setCurrent] = useState(0);

  // Used for editing dialog.
  const [show, setShow] = useState(false);
  const [field, setField] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [snackBarVisible, setSnackBarVisible] = useState(false);
  const onToggleSnackBar = () => setSnackBarVisible(!snackBarVisible);
  const onDismissSnackBar = () => setSnackBarVisible(false);

  const updateHandler = async (index) => {
    await setCurrent(index);
    showDialog();
  };

  const handleShow = () => {
    setShow(!show);
  }

  const handleCancel = () => {
    hideDialog();
    setShow(false);
    setField('');
    setUsername('');
    setPassword('');
  };

  const options = [
    "Username",
    "Password",
    "Phone",
    "First Name",
    "Last Name",
  ];

  const attributes = [
    "newUsername",
    "newPassword",
    "phone",
    "firstname",
    "lastname",
  ];

  const handleSubmit = async () => {
    setShow(false);
    const data = await context.useAuthorizedPatch('/user/', {
      username: username,
      password: password,
      // Spot for future improvement, could be implemented/organized differently:
      newUsername: current === 0 ? field : null,
      newPassword: current === 1 ? field : null,
      phone: current === 2 ? field : null,
      firstname: current === 3 ? field : null,
      lastname: current === 4 ? field : null,
    });

    hideDialog();
    if (data.status === 400) {
      onToggleSnackBar();
    }
  };

  return (
    <ScrollView>
      <List.Section>
        <List.Subheader>Account Settings</List.Subheader>
        {options.map((option, index) => {
          return (
            <List.Item
              key={index}
              title={"Change " + option}
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
            <Paragraph>Please enter your new account information in addition to your current username and password.</Paragraph>
            <TextInput
              label={"New " + options[current]}
              value={field}
              onChangeText={text => setField(text)}
            />
            <TextInput
              label="Current Username"
              value={username}
              onChangeText={text => setUsername(text)}
            />
            <TextInput
              label="Current Password"
              value={password}
              secureTextEntry={show}
              onChangeText={text => setPassword(text)}
              right={<TextInput.Icon name="eye" onPress={handleShow} />}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button style={{ color: '#ff0000' }} onPress={handleCancel}>Cancel</Button>
            <Button onPress={handleSubmit}>Done</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      <Snackbar
        visible={snackBarVisible}
        onDismiss={onDismissSnackBar}
        duration={2000}
        style={styles.snackbar}
        action={{
          label: 'Ok',
          onPress: onDismissSnackBar
        }}>
        Incorrect username or password. Please try again.
      </Snackbar>
    </ScrollView>
  );
};

export default Account;