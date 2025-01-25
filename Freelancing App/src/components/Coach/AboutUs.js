import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Alert,
  Image,
  Dimensions,
} from 'react-native';
import axios from 'axios';
import {Baseurl} from '../../config/Appurl';
import AsyncStorage from '@react-native-async-storage/async-storage';

const {width, height} = Dimensions.get('window');

const AboutUs = () => {
  const [aboutText, setAboutText] = useState('');
  const [skills, setSkills] = useState([]);
  const [languagies, setlanguagies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [LoginUserId, setLoginUserId] = useState(null);
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [showSkillModal, setShowSkillModal] = useState(false);
  const [currentSkillIndex, setCurrentSkillIndex] = useState(null);
  const [currentSkill, setCurrentSkill] = useState({
    SkillName: '',
    description: '',
  });


  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('loginUser');
        if (storedUser) {
          const useimg = JSON.parse(storedUser);
          setLoginUserId(useimg.id)
        }
      } catch (error) {
        console.error('Error fetching login user data:', error);
      }
    };

    fetchUserData();
  }, []);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${Baseurl}/user`);
        const userData = response.data.find(user => user.id === LoginUserId);

        if (userData) {
          setAboutText(userData.about);
          setSkills(userData.skills || []);
        } else {
          // Alert.alert('Error', 'User not found');
        }
      } catch (error) {
        console.error('Error fetching data', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const addSkill = () => {
    setShowSkillModal(true);
    setCurrentSkill({SkillName: '', description: ''});
  };

  const saveSkill = () => {
    if (!currentSkill.SkillName || !currentSkill.description) {
      Alert.alert('Error', 'Both Skill Name and Description are required.');
      return;
    }

    setSkills([...skills, currentSkill]);

    setCurrentSkill({SkillName: '', description: ''});

    setShowSkillModal(false);
  };

  const editSkill = index => {
    setCurrentSkill(skills[index]);
    setCurrentSkillIndex(index);
    setShowSkillModal(true);
  };

  const removeSkill = index => {
    const updatedSkills = skills.filter((_, i) => i !== index);
    setSkills(updatedSkills);
  };

  const updateAboutUs = async () => {
    const updatedData = {
      about: aboutText,
      languagies: languagies.map(skill => ({
        SkillName: skill.SkillName,
        description: skill.description,
      })),
      skills: skills.map(skill => ({
        SkillName: skill.SkillName,
        description: skill.description,
      })),
      // education,
    };

    try {
      await axios.put(`${Baseurl}/user/${LoginUserId}`, updatedData);
      alert('Data updated successfully');
    } catch (error) {
      console.error('Error updating data', error);
      alert('Failed to update data');
    }
  };

  const handleInputChange = (value, field) => {
    setCurrentSkill({
      ...currentSkill,
      [field]: value,
    });
  };

  const handleSaveSkill = () => {
    if (currentSkillIndex !== null) {
      const updatedSkills = [...skills];
      updatedSkills[currentSkillIndex] = currentSkill;
      setSkills(updatedSkills);
    } else {
      setSkills([...skills, currentSkill]);
    }
    setShowSkillModal(false);
  };

  const handleSaveAbout = () => {
    setAboutText(currentSkill.description);
    setShowAboutModal(false);
  };

  const confirmDeleteSkill = index => {
    Alert.alert(
      'Delete Skill',
      'Are you sure you want to delete this skill?',
      [
        {text: 'Cancel', style: 'cancel'},
        {text: 'Delete', onPress: () => removeSkill(index)},
      ],
      {cancelable: false},
    );
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
      <View style={styles.header}>
        <Text style={styles.title}>About Us</Text>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => {
            setCurrentSkill({description: aboutText});
            setShowAboutModal(true);
          }}>
          <Image
            source={require('../../assets/images/edit.png')}
            style={styles.icon}
          />
          <Text style={styles.editButtonText}>Edit About Me</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.aboutText}>{aboutText}</Text>

      <Text style={styles.heading}>Skills</Text>

      {languagies.map((item, index) => (
        <View key={index} style={styles.skillItem}>
          <Text style={styles.skillName}>{item.SkillName}</Text>
          <Text style={styles.skillDescription}>{item.description}</Text>
          <View style={styles.skillActions}>
            <TouchableOpacity
              onPress={() => editSkill(index)}
              style={styles.editAction}>
              <Image
                source={require('../../assets/images/edit.png')}
                style={styles.icon}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => confirmDeleteSkill(index)}
              style={styles.deleteAction}>
              <Image
                source={require('../../assets/images/delete.png')}
                style={styles.icon}
              />
            </TouchableOpacity>
          </View>
        </View>
      ))}

      
      {skills.map((item, index) => (
        <View key={index} style={styles.skillItem}>
          <Text style={styles.skillName}>{item.SkillName}</Text>
          <Text style={styles.skillDescription}>{item.description}</Text>
          <View style={styles.skillActions}>
            <TouchableOpacity
              onPress={() => editSkill(index)}
              style={styles.editAction}>
              <Image
                source={require('../../assets/images/edit.png')}
                style={styles.icon}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => confirmDeleteSkill(index)}
              style={styles.deleteAction}>
              <Image
                source={require('../../assets/images/delete.png')}
                style={styles.icon}
              />
            </TouchableOpacity>
          </View>
        </View>
      ))}

      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={[styles.addButton, {backgroundColor: '#28a745'}]}
          onPress={addSkill}>
          <Image
            source={require('../../assets/images/edit.png')}
            style={styles.icon}
          />
          <Text style={styles.addButtonText}>Add Skill</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.addButton, {backgroundColor: 'blue'}]}
          onPress={updateAboutUs}>
          <Text style={styles.addButtonText}>Update</Text>
        </TouchableOpacity>
      </View>

      {/* About Us Modal */}
      <Modal
        transparent={true}
        visible={showAboutModal}
        animationType="slide"
        onRequestClose={() => setShowAboutModal(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeading}>Update About Me</Text>
            <TextInput
              style={styles.modalInput}
              value={currentSkill.description}
              onChangeText={text => handleInputChange(text, 'description')}
              placeholder="Write about yourself"
              placeholderTextColor="#808080"
              multiline
            />
            <TouchableOpacity
              onPress={handleSaveAbout}
              style={styles.saveButton}>
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setShowAboutModal(false)}
              style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Skill Modal */}
      <Modal
        transparent={true}
        visible={showSkillModal}
        animationType="slide"
        onRequestClose={() => setShowSkillModal(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeading}>Edit Skill</Text>
            <TextInput
              style={styles.modalInput}
              value={currentSkill.SkillName}
              onChangeText={text => handleInputChange(text, 'SkillName')}
              placeholder="Skill Name"
              placeholderTextColor="#808080"
            />
            <TextInput
              style={styles.modalInput}
              value={currentSkill.description}
              onChangeText={text => handleInputChange(text, 'description')}
              placeholder="Skill Description"
              placeholderTextColor="#808080"
              multiline
            />
            <TouchableOpacity
              onPress={handleSaveSkill}
              style={styles.saveButton}>
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setShowSkillModal(false)}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: 'black',
  },
  editButton: {
    backgroundColor: 'blue',
    paddingHorizontal: 15,
    paddingVertical: 7.5,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  editButtonText: {
    color: 'white',
  },
  aboutText: {
    fontSize: 16,
    marginBottom: 10,
    marginTop: 7.5,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  skillItem: {
    marginBottom: 10,
    padding: 5,
    borderRadius: 5,
  },
  skillName: {
    fontSize: 20,
    color: 'black',
  },
  skillDescription: {
    fontSize: 16,
  },
  skillActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  editAction: {
    backgroundColor: 'blue',
    paddingHorizontal: 25,
    paddingVertical: 7.5,
    borderRadius: 5,
  },
  deleteAction: {
    backgroundColor: 'red',
    paddingHorizontal: 25,
    paddingVertical: 7.5,
    borderRadius: 5,
  },
  actionButtons: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: '25%',
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
    color: 'white',
  },
});

export default AboutUs;
