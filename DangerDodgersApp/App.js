import React, { useState, useEffect, useReducer, createContext, useMemo } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { DefaultTheme, Provider as PaperProvider, Portal } from 'react-native-paper';
import { StyleSheet } from 'react-native';
import Perist from './src/Helpers/Persist';
import config from './config';

// Screen views
import MainMap from './src/Screens/MainMap';
import Reports from './src/Screens/Reports';
import Alerts from './src/Screens/Alerts';
import About from './src/Screens/About';
import Account from './src/Screens/Account';
import Login from './src/Screens/Login';
import Splash from './src/Screens/Splash';

// Top level components 
import UtilityBar from './src/Components/UtilityBar';
import Permissions from './src/Helpers/Permissions';

// Helpers/Utilities
import AuthContext from './src/Helpers/Auth';
import Settings from './src/Screens/Settings';

// Create navigators.
const Tab = createMaterialBottomTabNavigator();



// Edit global theming here.
const theme = {
  ...DefaultTheme,
  mode: 'adaptive',
  dark: true,
  roundness: 15,
  colors: {
    ...DefaultTheme.colors,
    primary: '#BABBB1',
    accent: '#000000',
    light: '#ffffff',
    backgroundColor: '#ffffff',
    splashBackground: '#000000'
  },
};

const bottomNavStyles = StyleSheet.create({
  nav: {
    // position: 'absolute',
    // padding: 5,
    // right: 10,
    // left: 10,
    // bottom: 10,
    backgroundColor: theme.colors.light,
    shadowRadius: 3.5,
    shadowOpacity: 0.25,
    elevation: 5,
  },
});

const App = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState(null);

  const [state, dispatch] = useReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'RESTORE_TOKEN':
          return {
            ...prevState,
            userToken: action.token,
            isLoading: false,
          };
        case 'SIGN_IN':
          return {
            ...prevState,
            isSignout: false,
            userToken: action.token,
          };
        case 'SIGN_OUT':
          return {
            ...prevState,
            isSignout: true,
            userToken: null,
          };
      }
    },
    {
      isLoading: true,
      isSignout: false,
      userToken: null,
    }
  );

  const checkSignIn = (status) => {
    return (status === 401);
  };

  const setUser = async (token) => {
    const res = await fetch(`${config.protocol}${config.serverPath}/user/`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    const json = await res.json();

    if (res.status === 200 && json.id) {
      setUserId(json.id);
    }
  };

  const context = useMemo(() => {
    return {
      getUserId: () => {
        return userId;
      },
      signIn: async (creds) => {
        try {
          const res = await fetch(`${config.protocol}${config.serverPath}/user/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(creds)
          });
          const json = await res.json();

          if (res.status === 200 && json.access_token) {
            setTimeout(() => {
              dispatch({ type: 'SIGN_IN', token: json.access_token });
              Perist.store('user-token', json.access_token);
              setUser(json.access_token);
            }, 500);

            return {
              state: 'SUCCESS',
              message: 'Sign in successful.'
            };
          } else {
            return {
              state: 'ERROR',
              message: 'There was an error. Please try again.'
            };
          }
        } catch (error) {
          console.error(error)

          return {
            state: 'ERROR',
            message: 'Network error. Please try again.'
          };
        }
      }, signUp: async (creds) => {
        try {
          const res = await fetch(`${config.protocol}${config.serverPath}/user/`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(creds)
          });

          if (Number(res.status) === 429) {
            return {
              state: 'ERROR',
              message: 'Too many sign ups from this device. Please try again in a few minutes.'
            };
          }

          const json = await res.json();

          if (json?.detail && json.detail === 'ALREADY_EXISTS') {
            return {
              state: 'ERROR',
              message: 'User already exists. Please visit the sign-in page instead.'
            };
          }

          return {
            state: 'SUCCESS',
            message: 'Signed up successfully. Please visit sign in page.'
          };
        } catch (error) {
          console.error(error)

          return {
            state: 'ERROR',
            message: 'Network error. Please try again.'
          };
        }
      }, signOut: async () => {
        // Invalidate persistent token and log out.
        await Perist.remove('user-token');
        dispatch({ type: 'SIGN_OUT' });

      }, refresh: async () => {
        try {
          // Fetch a fresh token.
          const res = await fetch(`${config.protocol}${config.serverPath}/user/refresh`, {
            method: 'POST',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${state.userToken}`
            }
          });

          // If the request is successful, proceed to log the user in. 
          // This should all be happening in the background while user sees loading screen.
          if (res.status === 200) {
            const json = await res.json();
            dispatch({ type: 'SIGN_IN', token: json.access_token });
            setUser(json.access_token);
          } else {
            // Log user out if the key is not current. 
            dispatch({ type: 'SIGN_OUT' });
          }
        } catch (error) {
          // Otherwise if there is some kind of network error, log the user out so that they must sign back in.
          dispatch({ type: 'SIGN_OUT' });
        }
      }, useAuthorizedPost: async (path, body) => {
        // Insert current JWT into a request. 
        try {
          const res = await fetch(`${config.protocol}${config.serverPath}${path}`, {
            method: 'POST',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${state.userToken}`
            },
            body: JSON.stringify(body)
          });
          const json = await res.json();

          // If the JWT failed and authentication cannot be completed,
          // Nullify login token and sign out.
          if (checkSignIn(res.status)) {
            await Perist.remove('user-token');
            dispatch({ type: 'SIGN_OUT' });
          }

          return {
            state: 'SUCCESS',
            content: json,
            status: res.status
          };
        } catch (error) {
          console.error(error)

          return {
            state: 'ERROR',
            message: 'Network error. Please try again.'
          };
        }

      }, useAuthorizedPatch: async (path, body) => {
        // Insert current JWT into a request. 
        try {
          const res = await fetch(`${config.protocol}${config.serverPath}${path}`, {
            method: 'PATCH',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${state.userToken}`
            },
            body: JSON.stringify(body)
          });
          const json = await res.json();

          // If the JWT failed and authentication cannot be completed,
          // Nullify login token and sign out.
          if (checkSignIn(res.status)) {
            await Perist.remove('user-token');
            dispatch({ type: 'SIGN_OUT' });
          }

          return {
            state: 'SUCCESS',
            content: json,
            status: res.status
          };
        } catch (error) {
          console.error(error)

          return {
            state: 'ERROR',
            message: 'Network error. Please try again.'
          };
        }

      }, useAuthorizedGet: async (path) => {
        // Insert current JWT into a request. 

        try {
          const res = await fetch(`${config.protocol}${config.serverPath}${path}`, {
            method: 'GET',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${state.userToken}`
            }
          });
          const json = await res.json();

          // If the JWT failed and authentication cannot be completed,
          // Nullify login token and sign out.
          if (checkSignIn(res.status)) {
            await Perist.remove('user-token');
            dispatch({ type: 'SIGN_OUT' });
          }

          return {
            state: 'SUCCESS',
            content: json,
            status: res.status
          };
        } catch (error) {
          console.error(error)

          return {
            state: 'ERROR',
            message: 'Network error. Please try again.'
          };
        }

      }
    };
  }, [state]);

  useEffect(() => {
    const isSignedIn = async () => {
      // Retirve token from persistent memory.
      const token = await Perist.retrieve('user-token');

      // If a token was stored into persistent memory, try to grab a new refresh token with it.
      if (token) {
        try {

          // Fetch a fresh token.
          const res = await fetch(`${config.protocol}${config.serverPath}/user/refresh`, {
            method: 'POST',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          });

          // If the request is successful, proceed to log the user in. 
          // This should all be happening in the background while user sees loading screen.
          if (res.status === 200) {
            const json = await res.json();
            dispatch({ type: 'SIGN_IN', token: json.access_token });
            setUser(json.access_token);
          } else {
            // Log user out if the key is not current. 
            dispatch({ type: 'SIGN_OUT' });
          }
        } catch (error) {
          // Otherwise if there is some kind of network error, log the user out so that they must sign back in.
          dispatch({ type: 'SIGN_OUT' });
        }
      }
    };

    isSignedIn();

    // Get location services running. 
    const initializeLocationServices = async () => {
      await Permissions.requestPermissions();
    }

    initializeLocationServices();
  }, []);

  const handleFinishedLoading = () => {
    setIsLoading(false);
  };

  if (isLoading) {
    return (<Splash handleFinishedLoading={handleFinishedLoading}></Splash>);
  }

  return (
    <AuthContext.Provider value={context}>
      {state.userToken == null
        ? <Login></Login>
        : (<Portal.Host><UtilityBar navigation={navigation}></UtilityBar>
          <Tab.Navigator
            barStyle={bottomNavStyles.nav}
            shifting={true}
            sceneAnimationEnabled={false}>
            <Tab.Screen name="Explore" children={() => <MainMap></MainMap>} options={{
              tabBarIcon: 'home-account',
            }} />
            {/* <Tab.Screen name="Create Report" component={Reports} options={{
              tabBarIcon: 'alert-octagon-outline',
            }} /> */}
            <Tab.Screen name="My Alerts" component={Alerts} options={{
              tabBarIcon: 'bell-outline',
            }} />
            <Tab.Screen name="My Account" component={Account} options={{
              tabBarIcon: 'account-circle-outline',
            }} />
          </Tab.Navigator>
        </Portal.Host>)}
    </AuthContext.Provider>
  );
}

const Stack = createStackNavigator();

const A = () => {
  return (
    <PaperProvider theme={theme}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{
          headerShown: false
        }}>
          <Stack.Screen name="Home" component={App} />
          <Stack.Screen name="About" component={About} />
          <Stack.Screen name="Settings" component={Settings} />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>);
};

export default A;