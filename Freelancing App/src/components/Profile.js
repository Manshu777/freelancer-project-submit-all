import React, {useState, useEffect, useContext} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Modal,
  FlatList,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Dp from '../assets/images/My.png';
import Bell from '../assets/images/Bell.png';
import styles from '../styles/HomeStyle';
import {useNavigation} from '@react-navigation/native';
import {Images} from '../config/Appurl';
import {UserContext} from '../components/context/UserContext';

const notificationsData = [
  {id: '1', message: 'Your profile has been updated.'},
  {id: '2', message: 'You have a new message.'},
  {id: '3', message: 'Reminder: Meeting at 3 PM.'},
];

const Profile = userData => {
  const {loginUser} = useContext(UserContext);
  const navigation = useNavigation();

  const handleEmailPress = () => {
    navigation.navigate('User');
  };

  const handleNotifications = () => {
    navigation.navigate('Notification');
  };

  return (
    <View style={styles.Userprofile}>
      <View style={styles.ProfileDet}>
        <TouchableOpacity
          style={styles.imageShadoweff}
          onPress={handleEmailPress}>
          <Image
            source={{uri: `${Images}${loginUser?.image}`}}
            style={styles.dp}
          />
        </TouchableOpacity>
        <View style={styles.UserDetails}>
          <Text style={styles.UserName}>
            {loginUser ? loginUser.Full_Name : 'Guest User'}
          </Text>
          <Text style={styles.UserLocation}>
            {loginUser ? loginUser.Email : 'Location not set'}
          </Text>
        </View>
      </View>

      <View style={styles.bellIconDes}>
        {/* <TouchableOpacity onPress={() => handleNotifications()}>
          <Image source={Bell} style={styles.BellIcon} />
          <View style={styles.NotiDot}></View>
        </TouchableOpacity> */}
      </View>
    </View>
  );
};

export default Profile;
