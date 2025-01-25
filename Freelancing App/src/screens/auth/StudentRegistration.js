import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  Alert,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Image,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import {useNavigation, useRoute} from '@react-navigation/native';
import * as ImagePicker from 'react-native-image-picker';
import {useDispatch, useSelector} from 'react-redux';
import {postData} from '../../slices/dataSlice';
import {Baseurl} from '../../config/Appurl';

const StudentRegistration = () => {
  const navigation = useNavigation();

  const dispatch = useDispatch();

  const route = useRoute();
  const [UserName, setUserName] = useState('');
  const [FullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [profession, setprofession] = useState('');


  // profession

  const [rate_per_hour, setrate_per_hour] = useState('');



  const [Phnumber, setPhnumber] = useState(60);
  const [dob, setDob] = useState(new Date());
  const [RegAs, setRegAs] = useState('Student');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [gender, setGender] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [image, setImage] = useState(null);
  const [contact, setContact] = useState('');
  const [token, setToken] = useState(null);
  const [responseMessage, setResponseMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const contactMethod = route.params.logmethod;

  useEffect(() => {
    if (route.params?.Phnumber) {
      setPhnumber(route.params.Phnumber);
    }
  }, [route.params]);

  useEffect(() => {
    if (route.params?.Emails) {
      setEmail(route.params.Emails);
    }
  }, [route.params]);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const fiveYearsAgo = new Date();
  fiveYearsAgo.setFullYear(fiveYearsAgo.getFullYear() - 5);

  const validateEmail = email => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDob(selectedDate);
    }
  };

  const handleChooseImage = () => {
    ImagePicker.launchImageLibrary(
      {mediaType: 'photo', includeBase64: false},
      response => {
        if (response.didCancel) {
          Alert.alert('Cancelled image selection');
        } else if (response.errorMessage) {
          Alert.alert('Error: ' + response.errorMessage);
        } else {
          setImage(response.assets[0]);
        }
      },
    );
  };

  const handleRegister = async () => {
    setLoading(true)
    if (
      !image ||
      !UserName ||
      !FullName ||
      !email ||
      !Phnumber ||
      !password ||
      !gender ||
      !termsAccepted
    ) {
      setLoading(false)
      Alert.alert('Please fill all fields and choose an image');
      return;
    }

    const formData = new FormData();
    formData.append('image', {
      uri: image.uri,
      type: image.type,
      name: image.fileName,
    });
    formData.append('User_Name', UserName);
    formData.append('Full_Name', FullName);
    formData.append('Email', email);

    formData.append('rate_per_hour', rate_per_hour);
    formData.append('profession', profession);


    formData.append('Contact', Phnumber);
    formData.append('Dob', dob.toISOString().split('T')[0]);
    formData.append('role', RegAs);
    formData.append('gender', gender);
    formData.append('password', password);

    try {
      const response = await axios.post(`${Baseurl}/user`, formData, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Response token:', response.data.token);
      await AsyncStorage.setItem('authToken', response.data.token);

      setLoading(false)
      if (response.status === 200) {
        alert('Registration Error');
      } else {
        // Alert.alert('Registration Error');
        navigation.navigate('LoginSuccess');
        setResponseMessage('Error: ' + JSON.stringify(response.data));
      }
    } catch (error) {
      if (error.response) {
        setLoading(false)
        console.error('Error Response:', error.response.data);
        const errorMessage =
          error.response.data.message || 'Please check the form inputs.';
        Alert.alert('Registration Error', errorMessage);
      } else {
        setLoading(false)
        Alert.alert('Network Error', error.message);
      }
    }
  };

  // const handleRegister = async () => {
  //   // Check for missing fields
  //   if (
  //     !image ||
  //     !UserName ||
  //     !FullName ||
  //     !email ||
  //     !Phnumber ||
  //     !password ||
  //     !gender ||
  //     !termsAccepted
  //   ) {
  //     Alert.alert('Please fill all fields and choose an image');
  //     return;
  //   }

  //   const formData = new FormData();
  //   formData.append('image', {
  //     uri: image.uri,
  //     type: image.type || 'image/jpeg',
  //     name: image.fileName || 'profile.jpg',
  //   });
  //   formData.append('User_Name', UserName);
  //   formData.append('Full_Name', FullName);
  //   formData.append('Email', email);
  //   formData.append('Contact', Phnumber);
  //   formData.append('Dob', dob.toISOString().split('T')[0]);
  //   formData.append('role', RegAs);
  //   formData.append('gender', gender);
  //   formData.append('password', password);

  //   const payload = {
  //     User_Name:UserName,
  //     Full_Name:FullName,
  //     Email:email,
  //     Contact:Phnumber,
  //     Dob: dob.toISOString().split('T')[0],
  //     role:RegAs,
  //     gender,
  //     password,
  //   };

  //   try {
  //     const result = await dispatch(postData(formData)).unwrap();
  //     console.log(result,'this is from dataslices');
  //     console.log('Registration successful:', result.token);

  //     navigation.navigate('LoginSuccess');
  //   } catch (error) {
  //     console.error('Registration error:', error);

  //     if (error?.response?.data?.errors) {
  //       console.error('Validation Errors:', error.response.data.errors);
  //       Alert.alert('Error', JSON.stringify(error.response.data.errors));
  //     } else {
  //       Alert.alert('Error', error.message || 'An unknown error occurred');
  //     }
  //   }

  // };

  const renderRoleOption = (label, value) => (
    <TouchableOpacity
      style={[styles.genderOption, RegAs === value && styles.selectedGender]}
      onPress={() => setRegAs(value)}
      activeOpacity={0.8}>
      <Text
        style={[
          styles.genderText,
          {color: RegAs === value ? '#FFFFFF' : '#808080'},
        ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  const renderGenderOption = (label, value) => (
    <TouchableOpacity
      style={[styles.genderOption, gender === value && styles.selectedGender]}
      onPress={() => setGender(value)}
      activeOpacity={0.8}>
      <Text
        style={[
          styles.genderText,
          {color: gender === value ? '#FFFFFF' : '#808080'},
        ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <KeyboardAvoidingView
      style={{flex: 1}}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Student Registration</Text>

        <TouchableOpacity
          style={styles.imagePicker}
          onPress={handleChooseImage}>
          {image ? (
            <View style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
              <Image source={{uri: image.uri}} style={styles.imagePre} />
              <Text style={styles.imagePickerText}>Change Profile Picture</Text>
            </View>
          ) : (
            <View style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
              <Image
                source={require('../../assets/images/icosnds.png')}
                style={styles.imagePre}
              />
              <Text style={styles.imagePickerText}>Select Profile Picture</Text>
            </View>
          )}
        </TouchableOpacity>

        <TextInput
          style={styles.input}
          placeholder="User Name"
          value={UserName}
          placeholderTextColor="#808080"
          onChangeText={setUserName}
        />
        <TextInput
          style={styles.input}
          placeholder="Full Name"
          value={FullName}
          placeholderTextColor="#808080"
          onChangeText={setFullName}
        />

        {contactMethod === 'Email' ? (
          <>
            <TextInput
              style={styles.input}
              value={contact}
              onChangeText={setContact}
              placeholder="Enter your Phone Number"
              placeholderTextColor="#808080"
              maxLength={10}
              keyboardType="phone-pad"
            />
          </>
        ) : (
          <>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your Email Address"
              placeholderTextColor="#808080"
              keyboardType="email-address"
            />
          </>
        )}
        <TextInput
              style={styles.input}
              value={rate_per_hour}
              onChangeText={setrate_per_hour}
              placeholder="Enter your Rate Per Hour "
              placeholderTextColor="#808080"
              keyboardType="rate_per_hour"
            />

<TextInput
              style={styles.input}
              value={profession}
              onChangeText={setprofession}
              placeholder="Enter your Profession "
              placeholderTextColor="#808080"
              keyboardType="rate_per_hour"
            />


        {/* <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={dob}
          onChangeText={setDob}
          placeholderTextColor="#808080"
          placeholder="Enter your Age"
          maxLength={2}
        /> */}
        <TouchableOpacity
          onPress={() => setShowDatePicker(true)}
          style={styles.input}>
          <Text style={{color: dob ? '#000' : '#808080'}}>
            {dob ? dob.toDateString() : 'Select Date of Birth'}
          </Text>
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={dob}
            mode="date"
            display="default"
            maximumDate={fiveYearsAgo}
            onChange={(event, selectedDate) => {
              setShowDatePicker(false);
              if (selectedDate) {
                setDob(selectedDate);
              }
            }}
          />
        )}

        <View style={[styles.inputContainer, {paddingRight: 15}]}>
          <Image
            source={require('../../assets/images/lock.png')}
            style={{width: 22.5, aspectRatio: 1}}
          />
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              width: '92.5%',
              justifyContent: 'space-between',
            }}>
            <TextInput
              placeholder="******"
              placeholderTextColor={'#808080'}
              secureTextEntry={!isPasswordVisible}
              style={{width: '92.5%', color: '#808080'}}
              value={password}
              onChangeText={setPassword}
            />

            
            <TouchableOpacity
              onPress={togglePasswordVisibility}
              style={styles.eyeButton}>
              <Image
                source={
                  isPasswordVisible
                    ? require('../../assets/images/eye.png')
                    : require('../../assets/images/eye-off.png')
                }
                style={{width: 20, height: 20}}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.genderContainer}>
          {renderRoleOption('Freelancer', 'Freelancer')}
          {renderRoleOption('Company', 'Company')}
        </View>

        <View style={styles.genderContainer}>
          {renderGenderOption('Male', 'male')}
          {renderGenderOption('Female', 'female')}
          {renderGenderOption('Other', 'other')}
        </View>

        <View style={{flexDirection: 'row', alignItems: 'flex-end', gap: 10}}>
          <TouchableOpacity
            style={styles.checkboxContainer}
            onPress={() => setTermsAccepted(!termsAccepted)}>
            <View
              style={[
                styles.checkbox,
                termsAccepted && styles.checkboxSelected,
              ]}
            />
          </TouchableOpacity>
          <Text style={[styles.checkboxLabel, {color: '#808080'}]}>
            I agree to the terms and conditions
          </Text>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#4CAF50" />
        ) : (
          <TouchableOpacity
            style={[
              styles.registerButton,
              !termsAccepted && styles.disabledButton,
            ]}
            onPress={handleRegister}
            disabled={!termsAccepted}>
            <Text style={styles.buttonText}>Register</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    color: '#808080',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  imagePicker: {alignItems: 'center', marginBottom: 15},
  imagePickerText: {fontSize: 16, color: 'rgba(126,88,199,1)'},
  imagePre: {width: 75, height: 75, borderRadius: 50},
  genderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  genderOption: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderWidth: 1,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  selectedGender: {backgroundColor: '#FFB900'},
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderRadius: 5,
  },
  checkboxSelected: {backgroundColor: '#4CAF50'},
  checkboxLabel: {fontSize: 16},
  registerButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {fontSize: 18, color: '#fff', fontWeight: 'bold'},
  disabledButton: {backgroundColor: '#ccc'},
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 15,
    borderRadius: 8,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 10,
  },
});

export default StudentRegistration;
