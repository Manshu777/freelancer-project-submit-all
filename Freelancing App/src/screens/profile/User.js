import React, {useEffect, useState, useContext} from 'react';
import {
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  Dimensions,
  LayoutAnimation,
  Platform,
  UIManager,
  ScrollView,
} from 'react-native';
import Back from '../../assets/images/LeftArrow.png';
import Phone from '../../assets/images/Phone.png';
import {useNavigation} from '@react-navigation/native';
import DefaultSettings from '../../components/UserProfile/DefaultSettings';
import ProfileInfo from '../../components/UserProfile/ProfileInfo';
import AboutUs from '../../components/Coach/AboutUs';
import Education from '../../components/Coach/Education';
import Projects from '../../components/Coach/Projects';
import {Images} from '../../config/Appurl';
import {UserContext} from '../../components/context/UserContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
const {width} = Dimensions.get('window');

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const User = () => {
  const {loginUser} = useContext(UserContext);
  const [userData, setUserData] = useState(null);
  const [selectedTab, setSelectedTab] = useState('Settings');
  const navigation = useNavigation();

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleNotificatios = () => {
    navigation.navigate('Notification');
  };
  const handleTabPress = tab => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setSelectedTab(tab);
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('loginUser');
        if (storedUser) {
          const useimg = JSON.parse(storedUser);
          setUserData(useimg);
        }
      } catch (error) {
        console.error('Error fetching login user data:', error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <View style={styles.mainContainer}>
      <View style={styles.Priofilemaincont}>
        <View style={styles.PriofileHeaders}>
          <TouchableOpacity
            style={styles.backButtonContainer}
            onPress={handleBackPress}>
            <Image
              source={require('../../assets/images/LeftArrow.png')}
              style={styles.backButtonIcon}
            />
          </TouchableOpacity>
          <Text style={styles.HeaderText}>Profile</Text>
        </View>
        {/* <View style={styles.bellIconDes}>
          <TouchableOpacity
            onPress={() => handleNotificatios()}
            style={styles.BellButt}>
            <Image
              source={require('../../assets/images/Bell.png')}
              style={styles.BellIcon}
            />
            <View style={styles.NotiDot}></View>
          </TouchableOpacity>
        </View> */}
      </View>

      <View
        style={{
          flex: 0,
          alignItems: 'center',
          justifyContent: 'center',
          width: width * 0.875,
          backgroundColor: 'white',
          marginTop: 75,
          paddingBottom: 10,
          borderRadius: 15,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 1,
          shadowRadius: 4,
          elevation: 5,
          zIndex: 1,
        }}>
        <View
          style={{
            height: 104,
            width: 104,
            borderColor: 'white',
            borderWidth: 2,
            borderRadius: 75,
            marginTop: -50,
          }}>
          {userData && userData.image ? (
            <Image
              source={{uri: `${Images}${loginUser.image}`}}
              style={{height: 100, width: 100, borderRadius: 75}}
            />
          ) : (
            <Image
              source={require('../../assets/images/My.png')} // Fallback image
              style={{height: 100, width: 100, borderRadius: 75}}
            />
          )}
        </View>
        <View
          style={{
            flex: 0,
            alignItems: 'center',
            justifyContent: 'center',
            gap: 5,
            marginTop: 10,
          }}>
          <Text style={{color: 'black', fontSize: 18, fontWeight: '600'}}>
            {loginUser?.Full_Name || 'Unknown User'}
          </Text>
          <View style={{flex: 0, flexDirection: 'row', alignItems: 'center'}}>
            <Image
              source={Phone}
              style={{width: 20, aspectRatio: 1, marginRight: 5}}
            />
            <Text style={{color: 'black', fontSize: 18, fontWeight: '400'}}>
              {loginUser?.Contact || 'No Contact Info'}
            </Text>
          </View>
        </View>
        <View
          style={{
            flex: 0,
            alignItems: '',
            justifyContent: 'space-between',
            flexDirection: 'row',
            paddingVertical: 15,
            width: '80%',
          }}>
          <TouchableOpacity
            style={{padding: 5}}
            onPress={() => handleTabPress('Personal Info')}>
            <Text
              style={{
                color: selectedTab === 'Personal Info' ? '#000' : '#838383',
                fontSize: 16,
                fontWeight: '600',
              }}>
              Personal Info
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{padding: 5}}
            onPress={() => handleTabPress('Settings')}>
            <Text
              style={{
                color: selectedTab === 'Settings' ? '#000' : '#838383',
                fontSize: 16,
                fontWeight: '600',
              }}>
              Settings
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.container}>
        {selectedTab === 'Personal Info' ? (
          userData.role === 'Company' ? (
            <ProfileInfo />
          ) : (
            <ScrollView>
              <ProfileInfo />
              <AboutUs />
              <Education />
              <Projects />
            </ScrollView>
          )
        ) : (
          <DefaultSettings />
        )}
      </View>
    </View>
  );
};

export default User;

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: 'rgba(126,88,199,1)',
    flex: 1,
    alignItems: 'center',
    paddingTop: 15,
  },
  Priofilemaincont: {
    flex: 0,
    width: width,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  PriofileHeaders: {
    flex: 0,
    gap: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButtonContainer: {
    padding: 10,
  },
  backButtonIcon: {
    height: 25,
    aspectRatio: 1,
  },
  HeaderText: {
    fontSize: 20,
    fontWeight: '600',
    color: 'white',
  },
  bellIconDes: {
    marginTop: 5,
    position: 'relative',
  },
  BellButt: {
    padding: 5,
    borderRadius: 25,
    backgroundColor: 'white',
  },
  BellIcon: {
    height: 25,
    width: 25,
  },
  NotiDot: {
    height: 7.5,
    width: 7.5,
    backgroundColor: 'rgba(126,88,199,1)',
    position: 'absolute',
    bottom: 7.5,
    right: 7.5,
    borderRadius: 50,
  },
  container: {
    marginTop: -70,
    paddingTop: 85,
    paddingBottom: 0,
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
    width: width,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
  },
});
