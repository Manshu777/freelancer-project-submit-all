import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  Alert,
  StyleSheet,
  ScrollView,
  Image,
  Dimensions,
} from 'react-native';
import axios from 'axios';
import {Baseurl} from '../../config/Appurl';
import AsyncStorage from '@react-native-async-storage/async-storage';

const {width} = Dimensions.get('window');

const Education = () => {
  const [educationData, setEducationData] = useState([]);
  const [LoginUserId, setLoginUserId] = useState(null);
  const [currentEducation, setCurrentEducation] = useState({
    degree: '',
    institution: '',
    year: '',
  });
  const [loading, setLoading] = useState(true);
  const [showEducationModal, setShowEducationModal] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('loginUser');
        if (storedUser) {
          const useimg = JSON.parse(storedUser);
          // console.log(useimg.id)
          setLoginUserId(useimg.id)
        }
      } catch (error) {
        console.error('Error fetching login user data:', error);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchEducationData = async () => {
      try {
        const response = await axios.get(`${Baseurl}/user`);
        const userData = response.data.find(user => user.id === LoginUserId);
        if (userData) {
          setEducationData(userData.education || []);
        }
      } catch (error) {
        console.error('Error fetching education data', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEducationData();
  }, []);

  const addEducation = () => {
    setShowEducationModal(true);
    setCurrentEducation({degree: '', institution: '', year: ''});
    setCurrentIndex(null);
  };

  const editEducation = index => {
    setCurrentEducation(educationData[index]);
    setCurrentIndex(index);
    setShowEducationModal(true);
  };

  const removeEducation = async index => {
    if (index < 0 || index >= educationData.length) {
      console.error('Invalid index');
      return;
    }

    const updatedEducationData = [...educationData];

    updatedEducationData.splice(index, 1);

    setEducationData(updatedEducationData);
  };

  const saveEducation = async () => {
    const {degree, institution, year} = currentEducation;

    if (!degree || !institution || !year) {
      Alert.alert('Error', 'All fields are required.');
      return;
    }

    const updatedData = {degree, institution, year};

    try {
      if (currentIndex !== null) {
        const updatedEducation = [...educationData];
        updatedEducation[currentIndex] = updatedData;
        setEducationData(updatedEducation);
        await axios.put(`${Baseurl}/user/12`, updatedEducation);
      } else {
        const newEducationData = [...educationData, updatedData];
        setEducationData(newEducationData);
        await axios.post(`${Baseurl}/user/12`, newEducationData);
      }

      setShowEducationModal(false);
    } catch (error) {
      console.error('Error saving education data', error);
      Alert.alert('Error', 'Failed to save education data');
    }
  };

  const updateUserInfo = async () => {
    console.log(educationData)
    const updatedUserData = {
      education:
        educationData.map(Edu => ({
          degree: Edu.degree,
          institution: Edu.institution,
          year: Edu.year,
        })) || [],
    };

    try {
      await axios.put(`${Baseurl}/user/${LoginUserId}`, updatedUserData);
      Alert.alert('Success', 'User data updated successfully');
    } catch (error) {
      console.error('Error updating user data', error);
      Alert.alert('Error', 'Failed to update user data');
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>Education</Text>

      {/* Display education list */}
      {educationData.length === 0 ? (
        <Text style={{marginVertical: 10}}>No education entries available.</Text>
      ) : (
        educationData.map((item, index) => (
          <View key={index} style={styles.educationItem}>
            <Image
              source={require('../../assets/images/Education.png')}
              style={{height: 25, width: 25, marginTop: 7.5}}
            />
            <View style={{width: '70%'}}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text style={{fontSize: 18, color: 'black'}}>
                  {item.degree} -{' '}
                </Text>
                <Text style={{fontSize: 16}}>{item.year}</Text>
              </View>
              <Text style={{fontSize: 14}}>{item.institution}</Text>
            </View>
            <View style={styles.educationActions}>
              <TouchableOpacity
                onPress={() => editEducation(index)}
                style={[styles.actionButton, {backgroundColor: 'blue'}]}>
                <Image
                  source={require('../../assets/images/edit.png')}
                  style={styles.icon}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => removeEducation(index)}
                style={[styles.actionButton, {backgroundColor: 'red'}]}>
                <Image
                  source={require('../../assets/images/delete.png')}
                  style={styles.icon}
                />
              </TouchableOpacity>
            </View>
          </View>
        ))
      )}

      <View
        style={{
          width: '100%',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <TouchableOpacity
          style={[
            styles.addButton,
            {width: '47.5%', backgroundColor: '#28a745'},
          ]}
          onPress={addEducation}>
          <Image
            source={require('../../assets/images/edit.png')}
            style={styles.icon}
          />
          <Text style={styles.addButtonText}>Add Education</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={updateUserInfo}
          style={[styles.addButton, {width: '47.5%', backgroundColor: 'blue'}]}>
          <Text style={styles.addButtonText}>Update</Text>
        </TouchableOpacity>
      </View>

      {/* Education Modal */}
      <Modal
        transparent={true}
        visible={showEducationModal}
        animationType="slide"
        onRequestClose={() => setShowEducationModal(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeading}>
              {currentIndex !== null ? 'Edit Education' : 'Add Education'}
            </Text>
            <TextInput
              style={styles.modalInput}
              value={currentEducation.degree}
              onChangeText={text =>
                setCurrentEducation({...currentEducation, degree: text})
              }
              placeholder="Degree"
            />
            <TextInput
              style={styles.modalInput}
              value={currentEducation.institution}
              onChangeText={text =>
                setCurrentEducation({...currentEducation, institution: text})
              }
              placeholder="Institution"
            />
            <TextInput
              style={styles.modalInput}
              value={currentEducation.year}
              onChangeText={text =>
                setCurrentEducation({...currentEducation, year: text})
              }
              placeholder="Year"
              keyboardType="numeric"
              maxLength={4}
            />
            <TouchableOpacity onPress={saveEducation} style={styles.saveButton}>
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setShowEducationModal(false)}
              style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 15,
    backgroundColor: '#fff',
    width: width * 0.9,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 0,
  },
  educationItem: {
    padding: 15,
    flexDirection: 'row',
    marginBottom: 15,
    borderRadius: 8,
    alignItems: 'flex-start',
    gap: 15,
  },
  educationActions: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    gap: 10,
  },
  actionButton: {
    paddingVertical: 7.5,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderRadius: 5,
  },
  addButtonText: {
    color: 'white',
    marginLeft: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  },
  modalHeading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  modalInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 15,
    paddingLeft: 10,
    borderRadius: 5,
  },
  saveButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
  },
  closeButton: {
    marginTop: 10,
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'gray',
  },
  icon: {
    height: 15,
    width: 15,
  },
});

export default Education;
