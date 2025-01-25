import React, {useEffect, useState} from 'react';
import {Alert, BackHandler, ToastAndroid} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

import SplashScreen from './src/screens/auth/SplashScreen';
import StudentRegistration from './src/screens/auth/StudentRegistration';
import LoginScreen from './src/screens/auth/LoginScreen';
import LoginSuccess from './src/screens/auth/LoginSuccess';
import LoginOTPverify from './src/screens/auth/LoginOTPverify';
import Home from './src/screens/home/Home';
import OurCoaches from './src/screens/coaches/OurCoaches';
import Message from './src/screens/Message/Message';
import ChatScreen from './src/screens/Message/ChatScreen';
import Notification from './src/screens/notification/Notification';
import CoachProfile from './src/screens/profile/CoachProfile';
import Loading from './src/screens/Loading/Loading';
import Navigation from './src/components/navigation/Navigation';
import User from './src/screens/profile/User';
import Plans from './src/screens/Plans/Plans';


import axios from 'axios';
import {Provider} from 'react-redux';
import {store} from './src/store/store';
import {Baseurl} from './src/config/Appurl';
import {UserProvider} from './src/components/context/UserContext';

const Stack = createStackNavigator();

const App = () => {
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);
  const [currentRoute, setCurrentRoute] = useState('Home');

  let lastBackPressed = 0;

  useEffect(() => {
    const checkSession = async () => {
      const storedToken = await AsyncStorage.getItem('authToken');
      if (storedToken) {
        setToken(storedToken);
      }
      setLoading(false);
    };
    checkSession();
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${Baseurl}/user`);
        const loginUser = response.data.filter(user => user.token === token);

        if (loginUser.length > 0) {
          // console.log(loginUser[0], 'this is a user');
          await AsyncStorage.setItem('loginUser', JSON.stringify(loginUser[0]));
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    if (token) fetchUserData();
  }, [token]);

  useEffect(() => {
    const handleBackPress = () => {
      if (['SplashScreen', 'Home'].includes(currentRoute)) {
        const now = Date.now();
        if (lastBackPressed && now - lastBackPressed < 2000) {
          BackHandler.exitApp();
        } else {
          lastBackPressed = now;
          ToastAndroid.show('Press back again to exit', ToastAndroid.SHORT);
        }
        return true;
      }
      return false;
    };

    BackHandler.addEventListener('hardwareBackPress', handleBackPress);

    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
    };
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <Provider store={store}>
      <UserProvider>
        <NavigationContainer
          onStateChange={state => {
            if (state) {
              const routeName = state.routes[state.index].name;
              const matchedRoutes = ['Home', 'OurCoaches', 'Chat'];
              setCurrentRoute(
                matchedRoutes.includes(routeName) ? routeName : null,
              );
            }
          }}>
          <Stack.Navigator
            initialRouteName={token ? 'Home' : 'SplashScreen'}
            screenOptions={{
              headerShown: false,
              gestureEnabled: false,
            }}>
            {/* Authentication Flow */}
            <Stack.Screen name="SplashScreen" component={SplashScreen} />
            <Stack.Screen name="LoginScreen" component={LoginScreen} />
            <Stack.Screen name="LoginOTPverify" component={LoginOTPverify} />
            <Stack.Screen name="LoginSuccess" component={LoginSuccess} />

            {/* App Flow */}
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="User" component={User} />
            <Stack.Screen name="OurCoaches" component={OurCoaches} />
            <Stack.Screen name="Chat" component={Message} />
            <Stack.Screen name="ChatScreen" component={ChatScreen} />
            <Stack.Screen name="Notification" component={Notification} />
            <Stack.Screen name="Profile" component={CoachProfile} />
            <Stack.Screen
              name="StudentRegistration"
              component={StudentRegistration}
            />
            <Stack.Screen name="plans" component={Plans} />
          </Stack.Navigator>

          {/* Conditionally Render Navigation Bar */}
          {token && currentRoute && <Navigation currentRoute={currentRoute} />}
        </NavigationContainer>
      </UserProvider>
    </Provider>
  );
};

export default App;
