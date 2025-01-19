import React, {useState} from 'react';
import {
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  Dimensions,
} from 'react-native';
import Down from '../../assets/images/Down.png';
import Up from '../../assets/images/Up.png';
import Logout from '../../assets/images/Logout.png';
import Facebook from '../../assets/images/FaceBook.png';
import Insta from '../../assets/images/instagram.png';
import Twitter from '../../assets/images/twitter.png';
import Meta from '../../assets/images/meta.png';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation, CommonActions} from '@react-navigation/native';

const {width} = Dimensions.get('window');

const DefaultSettings = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();

  const SocialLinks = [
    {IconAddress: Facebook, Link: ''},
    {IconAddress: Insta, Link: ''},
    {IconAddress: Twitter, Link: ''},
    {IconAddress: Meta, Link: ''},
  ];

  const ProfileSec = [
    {
      name: 'Freelancer Profile',
      Questions: [
        {
          Question: 'How to update skills?',
          Answer: 'Go to Profile > Edit Skills.',
        },
        {
          Question: 'How to set my hourly rate?',
          Answer: 'Go to Profile > Set Rate.',
        },
      ],
    },
    {
      name: 'Job Preferences',
      Questions: [
        {
          Question: 'How to update job categories?',
          Answer: 'Go to Settings > Job Preferences.',
        },
        {
          Question: 'How to adjust availability?',
          Answer: 'Go to Profile > Set Availability.',
        },
      ],
    },
    {
      name: 'Client Interactions',
      Questions: [
        {
          Question: 'How to manage client messages?',
          Answer: 'Go to Messages > Manage Conversations.',
        },
        {
          Question: 'How to view contracts?',
          Answer: 'Go to Contracts section.',
        },
      ],
    },
  ];

  const [expandedSections, setExpandedSections] = useState([]);

  const toggleSection = index => {
    if (expandedSections.includes(index)) {
      setExpandedSections(expandedSections.filter(i => i !== index));
    } else {
      setExpandedSections([...expandedSections, index]);
    }
  };

  const handleLogout = async () => {
    AsyncStorage.removeItem('authToken');
    AsyncStorage.removeItem('loginUser');
    try {
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('loginUser');
      console.log('User info cleared from local storage');
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{name: 'SplashScreen'}],
        }),
      );
    } catch (error) {
      console.error('Failed to clear user info:', error);
    }
  };

  const handle = () => {
    navigation.navigate('plans'); // Ensure 'Plan' is a valid route in your navigator
  };

  return (
    <View style={{width: width * 0.9}}>
      <TouchableOpacity style={styles.logoutButton2} onPress={handle}>
        <Text style={styles.logoutText2}>Membership</Text>
      </TouchableOpacity>

      <FlatList
        data={ProfileSec}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item, index}) => (
          <View style={styles.section}>
            <TouchableOpacity
              style={styles.sectionHeader}
              onPress={() => toggleSection(index)}>
              <Text style={styles.sectionTitle}>{item.name}</Text>
              <Image
                source={expandedSections.includes(index) ? Up : Down}
                style={styles.icon}
              />
            </TouchableOpacity>

            {expandedSections.includes(index) && (
              <View style={styles.questionsContainer}>
                {item.Questions.map((q, idx) => (
                  <View key={idx} style={styles.questionItem}>
                    <Text style={styles.questionText}>{q.Question}</Text>
                    <Text style={styles.answerText}>{q.Answer}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}
      />

      <View style={styles.footerContainer}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
          <Image source={Logout} style={styles.logoutIcon} />
        </TouchableOpacity>

        <Text style={styles.followText}>Follow us on</Text>
        <View style={styles.socialLinks}>
          {SocialLinks.map((social, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => console.log(social.Link)}>
              <Image source={social.IconAddress} style={styles.socialIcon} />
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.versionText}>Version 1.5.1</Text>
      </View>
    </View>
  );
};

export default DefaultSettings;

const styles = StyleSheet.create({
  section: {
    borderColor: '#D0D0D0',
    borderBottomWidth: 2,
    width: '100%',
    alignItems: 'center',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    width: '100%',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '400',
    color: 'black',
  },
  icon: {
    width: 14.9,
    height: 8.56,
  },
  questionsContainer: {
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
    width: width * 0.9,
  },
  questionItem: {
    marginBottom: 10,
  },
  questionText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  answerText: {
    fontSize: 14,
    color: '#555',
  },
  footerContainer: {
    width: width * 1,
    flex: 0,
    paddingVertical: 25,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 15,
  },
  logoutButton: {
    padding: 5,
    flex: 0,
    flexDirection: 'row',
    gap: 5,
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 5,
  },
  logoutText: {
    color: '#E1353C',
    fontSize: 16,
    fontWeight: '600',
  },
  logoutButton2: {
    padding: 5,
    borderColor: '#D0D0D0',
    borderBottomWidth: 2,
    flex: 0,
    flexDirection: 'row',
    gap: 5,
    backgroundColor: 'white',

    paddingVertical: 10,
   
  },
  logoutText2: {
    fontSize: 16,
    fontWeight: '600',
  },
  logoutIcon: {
    width: 20,
    height: 20,
    marginRight: 5,
  },
  followText: {
    color: '#000',
    textAlign: 'center',
    fontSize: 16,
  },
  socialLinks: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 0,
  },
  socialIcon: {
    width: 35,
    height: 35,
    marginHorizontal: 5,
  },
  versionText: {
    color: '#A6A6A6',
    textAlign: 'center',
    fontSize: 16,
  },
});
