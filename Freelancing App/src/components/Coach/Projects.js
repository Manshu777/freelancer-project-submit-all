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
import {Linking} from 'react-native'; // Import Linking for opening URLs
import AsyncStorage from '@react-native-async-storage/async-storage';

const {width} = Dimensions.get('window');

const Projects = () => {
  const [projectsData, setProjectsData] = useState([]);
  const [LoginUserId, setLoginUserId] = useState(null);
  const [currentProject, setCurrentProject] = useState({
    name: '',
    description: '',
    link: '',
    linkType: 'image', // Default to image
  });
  const [loading, setLoading] = useState(true);
  const [showProjectsModal, setShowProjectsModal] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('loginUser');
        if (storedUser) {
          const useimg = JSON.parse(storedUser);
          setLoginUserId(useimg.id);
        }
      } catch (error) {
        console.error('Error fetching login user data:', error);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchProjectsData = async () => {
      try {
        const response = await axios.get(`${Baseurl}/user`);
        const userData = response.data.find(user => user.id === LoginUserId);
        if (userData) {
          setProjectsData(userData.projects || []);
        }
      } catch (error) {
        console.error('Error fetching projects data', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjectsData();
  }, []);

  const addProject = () => {
    setShowProjectsModal(true);
    setCurrentProject({name: '', description: '', link: '', linkType: 'image'});
    setCurrentIndex(null);
  };

  const editProject = index => {
    setCurrentProject(projectsData[index]);
    setCurrentIndex(index);
    setShowProjectsModal(true);
  };

  const removeProject = async index => {
    if (index < 0 || index >= projectsData.length) {
      console.error('Invalid index');
      return;
    }

    const updatedProjectsData = [...projectsData];
    updatedProjectsData.splice(index, 1);
    setProjectsData(updatedProjectsData);
  };

  const saveProject = async () => {
    const {name, description, link, linkType} = currentProject;

    if (!name || !description || !link) {
      Alert.alert('Error', 'All fields are required.');
      return;
    }

    const updatedData = {name, description, link, linkType};

    try {
      if (currentIndex !== null) {
        const updatedProjects = [...projectsData];
        updatedProjects[currentIndex] = updatedData;
        setProjectsData(updatedProjects);
        await axios.put(`${Baseurl}/user/${LoginUserId}`, updatedProjects);
      } else {
        const newProjectsData = [...projectsData, updatedData];
        setProjectsData(newProjectsData);
        await axios.post(`${Baseurl}/user/${LoginUserId}`, newProjectsData);
      }

      setShowProjectsModal(false);
    } catch (error) {
      // console.error('Error saving project data', error);
      // Alert.alert('Error', 'Failed to save project data');
    }
  };

  const updateUserInfo = async () => {
    const updatedUserData = {
      projects:
        projectsData.map(project => ({
          name: project.name,
          description: project.description,
          link: project.link,
          linkType: project.linkType,
        })) || [],
    };

    try {
      await axios.put(`${Baseurl}/user/12`, updatedUserData);
      Alert.alert('Success', 'User data updated successfully');
    } catch (error) {
      console.error('Error updating user data', error);
      Alert.alert('Error', 'Failed to update user data');
    }
  };

  const openLink = link => {
    Linking.openURL(link).catch(err => {
      console.error('Error opening URL', err);
      Alert.alert('Error', 'Failed to open link');
    });
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
      <Text style={styles.heading}>Projects</Text>

      {projectsData.length === 0 ? (
        <Text style={{marginVertical: 10}}>No projects entries available.</Text>
      ) : (
        projectsData.map((item, index) => (
          <View key={index} style={styles.projectItem}>
            <View style={{width: '70%'}}>
              <Text style={{fontSize: 18, color: 'black', width: '100%'}}>
                {item.name}
              </Text>
              <Text style={{fontSize: 14, width: '100%'}}>
                {item.description}
              </Text>
              {item.linkType === 'image' ? (
                <Image source={{uri: item.link}} style={styles.projectImage} />
              ) : (
                <TouchableOpacity
                  onPress={() => openLink(item.link)}
                  style={styles.linkButton}>
                  <Text style={styles.linkButtonText}>Open Website</Text>
                </TouchableOpacity>
              )}
            </View>
            <View style={styles.projectActions}>
              <TouchableOpacity
                onPress={() => editProject(index)}
                style={[styles.actionButton, {backgroundColor: 'blue'}]}>
                <Image
                  source={require('../../assets/images/edit.png')}
                  style={styles.icon}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => removeProject(index)}
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

      <View style={styles.addButtonContainer}>
        <TouchableOpacity
          style={[styles.addButton, {backgroundColor: '#28a745'}]}
          onPress={addProject}>
          <Image
            source={require('../../assets/images/plus.png')}
            style={styles.icon}
          />
          <Text style={styles.addButtonText}>Add Project</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={updateUserInfo}
          style={[styles.addButton, {backgroundColor: 'blue'}]}>
          <Text style={styles.addButtonText}>Update</Text>
        </TouchableOpacity>
      </View>

      {/* Projects Modal */}
      <Modal
        transparent={true}
        visible={showProjectsModal}
        animationType="slide"
        onRequestClose={() => setShowProjectsModal(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeading}>
              {currentIndex !== null ? 'Edit Project' : 'Add Project'}
            </Text>
            <TextInput
              style={styles.modalInput}
              value={currentProject.name}
              onChangeText={text =>
                setCurrentProject({...currentProject, name: text})
              }
              placeholder="Project Name"
            />
            <TextInput
              style={styles.modalInput}
              value={currentProject.description}
              onChangeText={text =>
                setCurrentProject({...currentProject, description: text})
              }
              placeholder="Project Description"
            />
            <TextInput
              style={styles.modalInput}
              value={currentProject.link}
              onChangeText={text =>
                setCurrentProject({...currentProject, link: text})
              }
              placeholder="Link (Image or Website)"
            />
            <View style={styles.linkTypeContainer}>
              <Text>Select Link Type:</Text>
              <View style={{flexDirection: 'row', gap: 10, marginTop: 10}}>
                <TouchableOpacity
                  style={
                    currentProject.linkType === 'image'
                      ? styles.linkTypeButtonn
                      : styles.linkTypeButton
                  }
                  onPress={() =>
                    setCurrentProject({...currentProject, linkType: 'image'})
                  }>
                  <Text
                    style={
                      currentProject.linkType === 'image'
                        ? styles.selectedLinkType
                        : styles.linkTypeText
                    }>
                    Image
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={
                    currentProject.linkType === 'website'
                      ? styles.linkTypeButtonn
                      : styles.linkTypeButton
                  }
                  onPress={() =>
                    setCurrentProject({...currentProject, linkType: 'website'})
                  }>
                  <Text
                    style={
                      currentProject.linkType === 'website'
                        ? styles.selectedLinkType
                        : styles.linkTypeText
                    }>
                    Website
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <TouchableOpacity onPress={saveProject} style={styles.saveButton}>
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setShowProjectsModal(false)}
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
    // marginBottom: 15,
  },
  projectItem: {
    padding: 15,
    width: '100%',
    flexDirection: 'column',
    marginBottom: 15,
    borderRadius: 8,
    alignItems: 'flex-start',
    gap: 15,
    // backgroundColor:'red'
  },
  projectImage: {
    width: 250,
    height: 250,
    marginTop: 10,
    borderRadius: 5,
  },
  projectActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  actionButton: {
    paddingVertical: 7.5,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  addButtonContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  linkTypeContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  linkTypeButton: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#007BFF',
    backgroundColor: 'white',
    borderRadius: 5,
    width: '48%',
    alignItems: 'center',
  },
  linkTypeButtonn: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#007BFF',
    backgroundColor: 'blue',
    borderRadius: 5,
    width: '48%',
    alignItems: 'center',
  },
  selectedLinkType: {
    color: '#fff',
    fontWeight: 'bold',
  },
  linkTypeText: {
    color: 'black',
  },
  linkButton: {
    marginTop: 10,
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  linkButtonText: {
    color: 'white',
  },
  icon: {
    height: 15,
    width: 15,
  },
});

export default Projects;
