import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  TouchableOpacity,
  ScrollView,
  Modal,
  Dimensions,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Baseurl} from '../../config/Appurl';
import AboutUs from '../Coach/AboutUs';
import Icon from 'react-native-vector-icons/FontAwesome';

const {width, height} = Dimensions.get('window');

const ProfileInfo = () => {
  const [userData, setUserData] = useState(null);
  const [FullName, setFullName] = useState('');
  const [UserName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [Contact, setContact] = useState('');
  const [gender, setGender] = useState('male');
  const [location, setLocation] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [UserRole, setUserRole] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  // Fetch user data from the API
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('loginUser');
        if (storedUser) {
          const useimg = JSON.parse(storedUser);
          setUserData(useimg);
          setUserName(useimg.User_Name);
          setFullName(useimg.Full_Name);
          setEmail(useimg.Email);
          setContact(useimg.Contact);
          setUserRole(useimg.role);
        }
      } catch (error) {
        console.error('Error fetching login user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const handleGenderSelect = selectedGender => {
    setGender(selectedGender);
  };

  const handleSubmit = () => {
    Alert.alert(
      'Form Submitted',
      `Name: ${FullName}, Phone: ${Contact}, Email: ${email}, Gender: ${gender}, Location: ${location}, Zip Code: ${zipCode}`,
    );
  };

  return (
    <ScrollView style={styles.scrollContainer}>
      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.heading}>{userData?.Full_Name}</Text>

          <View style={styles.infoRow}>
            <Icon name="user" size={20} color="#007BFF" />
            <Text style={styles.label}>Username: {userData?.User_Name}</Text>
          </View>

          <View style={styles.infoRow}>
            <Icon name="envelope" size={20} color="#007BFF" />
            <Text style={styles.label}>Email: {userData?.Email}</Text>
          </View>

          <View style={styles.infoRow}>
            <Icon name="phone" size={20} color="#007BFF" />
            <Text style={styles.label}>Contact: {userData?.Contact}</Text>
          </View>

          <View style={styles.infoRow}>
            <Icon name="briefcase" size={20} color="#007BFF" />
            <Text style={styles.label}>Role: {userData?.role}</Text>
          </View>

          {/* <TouchableOpacity
            style={styles.editButton}
            onPress={() => setModalVisible(true)}>
            <Text style={styles.editText}>Edit</Text>
          </TouchableOpacity> */}
        </View>

        <Modal
          visible={modalVisible}
          animationType="slide"
          onRequestClose={() => setModalVisible(false)}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalHeading}>Edit Profile</Text>
            <TextInput
              style={styles.input}
              value={FullName}
              onChangeText={setFullName}
              placeholder="Full Name"
              placeholderTextColor="#808080"
            />
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="Email"
              placeholderTextColor="#808080"
            />
            <TextInput
              style={styles.input}
              value={Contact}
              onChangeText={setContact}
              placeholder="Contact Number"
              placeholderTextColor="#808080"
            />
            <TextInput
              style={styles.input}
              value={location}
              onChangeText={setLocation}
              placeholder="Location"
              placeholderTextColor="#808080"
            />
            <TextInput
              style={styles.input}
              value={zipCode}
              onChangeText={setZipCode}
              placeholder="Zip Code"
              placeholderTextColor="#808080"
            />

            <View style={styles.genderContainer}>
              <TouchableOpacity
                style={[
                  styles.genderButton,
                  gender === 'male' && styles.selectedButton,
                ]}
                onPress={() => handleGenderSelect('male')}>
                <Text style={styles.genderText}>Male</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.genderButton,
                  gender === 'female' && styles.selectedButton,
                ]}
                onPress={() => handleGenderSelect('female')}>
                <Text style={styles.genderText}>Female</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmit}>
              <Text style={styles.submitText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setModalVisible(false)}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    marginBottom: 10,
  },
  container: {
    // padding: 20,
  },
  card: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: 'center',
    marginBottom: 15,
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  label: {
    marginLeft: 10,
    fontSize: 16,
    color: '#333',
  },
  editButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  editText: {
    color: '#fff',
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 20,
    justifyContent: 'center',
  },
  modalHeading: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  genderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 15,
  },
  genderButton: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    width: '40%',
    alignItems: 'center',
  },
  selectedButton: {
    backgroundColor: '#007BFF',
  },
  genderText: {
    fontSize: 16,
    color: '#000',
  },
  submitButton: {
    backgroundColor: '#28a745',
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  submitText: {
    color: '#fff',
    fontSize: 16,
  },
  cancelButton: {
    backgroundColor: '#dc3545',
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  cancelText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default ProfileInfo;
