import React, { useState, useContext } from 'react';
import { TextInput, ToggleButton, Button, Snackbar, Headline } from 'react-native-paper';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import AuthContext from '../../Helpers/Auth';

const Login = () => {
    const [value, setValue] = useState('login');
    const context = useContext(AuthContext);

    const LoginMenu = () => {
        const [email, setEmail] = useState('');
        const [password, setPassword] = useState('');

        // Snackbar message states.
        const [visible, setVisible] = useState(false);
        const [snackBarMessage, setSnackBarMessage] = useState('');
        const onToggleSnackBar = () => setVisible(!visible);
        const onDismissSnackBar = () => setVisible(false);

        const handleLogIn = async () => {
            const result = await context.signIn({
                username: email,
                password: password
            });
            
            await setSnackBarMessage(result.message);
            onToggleSnackBar();
        };

        return (<View>
            <TextInput
                label="Email"
                value={email}
                onChangeText={text => setEmail(text)}
                style={styles.input}
            />
            <TextInput
                label="Password"
                secureTextEntry
                value={password}
                onChangeText={text => setPassword(text)}
                style={styles.input}
            />
            <Button style={styles.input} mode="contained" onPress={handleLogIn}>
                Sign In
            </Button>
            <Snackbar
                visible={visible}
                onDismiss={onDismissSnackBar}
                duration={2000}
                style={styles.snackbar}
                action={{
                    label: 'Ok',
                    onPress: onDismissSnackBar
                }}>
                { snackBarMessage }
            </Snackbar>
        </View>);
    };

    const SignUpMenu = () => {

        // Form fill states.
        const [email, setEmail] = useState('');
        const [password, setPassword] = useState('');
        const [firstName, setFirstName] = useState('');
        const [lastName, setLastName] = useState('');
        const [phone, setPhone] = useState('');

        // Snackbar message states.
        const [visible, setVisible] = useState(false);
        const [snackBarMessage, setSnackBarMessage] = useState('');
        const onToggleSnackBar = () => setVisible(!visible);
        const onDismissSnackBar = () => setVisible(false);

        const handleSignUp = async () => {
            const result = await context.signUp({
                firstname: firstName,
                lastname: lastName,
                phone: phone,
                username: email,
                password: password
            });
            await setSnackBarMessage(result.message);
            onToggleSnackBar();
        };

        return (<View style={styles.fullheight}>
            <TextInput
                label="Email"
                value={email}
                onChangeText={text => setEmail(text)}
                style={styles.input}
            />
            <TextInput
                label="Password"
                value={password}
                secureTextEntry
                onChangeText={text => setPassword(text)}
                style={styles.input}
            />
            <TextInput
                label="First Name"
                value={firstName}
                onChangeText={text => setFirstName(text)}
                style={styles.input}
            />
            <TextInput
                label="Last Name"
                value={lastName}
                onChangeText={text => setLastName(text)}
                style={styles.input}
            />
            <TextInput
                label="Phone Number"
                value={phone}
                onChangeText={text => setPhone(text)}
                style={styles.input}
            />
            <Button style={styles.input} mode="contained" onPress={handleSignUp}>
                Sign Up
            </Button>
            <Snackbar
                visible={visible}
                onDismiss={onDismissSnackBar}
                duration={2000}
                style={styles.snackbar}
                action={{
                    label: 'Ok',
                    onPress: onDismissSnackBar
                }}>
                { snackBarMessage }
            </Snackbar>
        </View>);
    };

    return(<ScrollView style={styles.fill}>
        <View style={styles.center}>
            <Image style={styles.image} source={require('../../Assets/logo.png')}></Image>
        </View>
        <View style={styles.login}>
            <ToggleButton.Row onValueChange={value => setValue(value)} value={value}>
                <ToggleButton style={styles.toggleButton} icon={() => <Text style={styles.toggleText}>Sign In</Text>} value="login"></ToggleButton>
                <ToggleButton style={styles.toggleButton} icon={() => <Text style={styles.toggleText}>Sign Up</Text>} value="signup">Sign Up</ToggleButton>
            </ToggleButton.Row>
        </View>
        <View style={{marginBottom: 64}}>
            {
                value == 'login' 
                    ? <LoginMenu></LoginMenu>
                    : <SignUpMenu></SignUpMenu>
            }
        </View>
    </ScrollView>
)};

const styles = StyleSheet.create({
    snackbar: {
        position: 'absolute',
        bottom: 250
    }, fill: {
        ...StyleSheet.absoluteFillObject,
        padding: 16,
    }, fullheight: {
        height: '100%' 
    }, login: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    }, toggleText: {
        color: '#000000'
    }, input: {
        margin: 16
    }, toggleButton: {
        width: '40%',
        margin: 10,
        // borderRadius: '5%'
    }, image: {
        width: '90%',
        height: 200
    }, center: {
        width: '100%',
        alignItems: 'center',
        padding: 16
    }
});

export default Login;