import React, {useRef, useState, useMemo, useCallback, useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import {
  Animated,
  FlatList,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
} from 'react-native';
import styles from '../../styles/OurCoaches';
import CoachCard from '../../components/CoachCard';

import {Baseurl, Images} from '../../config/Appurl';
import axios from 'axios';
import {fetchData} from '../../slices/dataSlice';

const OurCoaches = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSport, setSelectedSport] = useState('');
  const [Freelancers, setFreelancers] = useState([]);
  const [fetchedData, setfetchedData] = useState([]);
  const navigation = useNavigation();
  const flatListRef = useRef(null);
  const filterAnim = useRef(new Animated.Value(1)).current;

  const handleSearch = useCallback(text => {
    setSearchTerm(text);
  }, []);

  const handleFilterBySport = useCallback(sport => {
    setSelectedSport(sport);
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${Baseurl}/user`);

        // Assuming response.data returns an array of users
        const freelancersData = response.data.filter(
          user => user.role === 'Freelancer',
        );
        // console.log(freelancersData.Email)

        if (freelancersData.length > 0) {
          setFreelancers(freelancersData); // Set all freelancers
        } else {
          Alert.alert('No freelancers found');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        Alert.alert('Error', 'Failed to fetch user data');
      }
    };

    fetchUserData();
  }, []);

  const clearSearch = () => {
    setSearchTerm('');
    setSelectedSport('');
  };

  const handleScroll = event => {
    const offsetY = event.nativeEvent.contentOffset.y;
    if (offsetY === 0) {
      Animated.timing(filterAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(filterAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };

  return (
    <View style={{backgroundColor: 'white', flex: 2}}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButtonContainer}
          onPress={navigation.goBack}>
          <Image
            source={require('../../assets/images/LeftArrow.png')}
            style={styles.backButtonIcon}
          />
          <Text style={styles.headerTitle}>Freelncer</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Image
            source={require('../../assets/images/Filter.png')}
            style={styles.filterIcon}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.searchContainer}>
        <TouchableOpacity>
          <Image
            source={require('../../assets/images/back-arrow.png')}
            style={styles.backarrowimg}
          />
        </TouchableOpacity>
        <TextInput
          style={styles.Searchinput}
          placeholder="Search Coach"
          value={searchTerm}
          onChangeText={handleSearch}
          clearButtonMode="always"
          placeholderTextColor={'#808080'}
        />
        <TouchableOpacity onPress={clearSearch}>
          <Image
            source={require('../../assets/images/close.png')}
            style={{height: 20, width: 20}}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.chessButtonContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {[
            'Football',
            'Basketball',
            'Tennis',
            'Baseball',
            'Volleyball',
            'Hockey',
            'Cricket',
          ].map(sport => (
            <TouchableOpacity
              key={sport}
              style={[
                styles.chessButtons,
                selectedSport === sport && {backgroundColor: '#ccc'},
              ]}
              onPress={() => handleFilterBySport(sport)}>
              <Text style={styles.chessButtonText}>{sport}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView style={{paddingHorizontal: 10}}>
        {Freelancers.map((item, index) => (
          <View
            key={item.id}
            style={{
              backgroundColor: 'white',
              shadowColor: '#000',
              shadowOffset: {width: 0, height: 1},
              shadowOpacity: 0.3,
              shadowRadius: 4,
              elevation: 4,
              padding: 10,
              marginHorizontal: 10,
              marginTop: 10,
              marginLeft: 3,
              width: '100%',
              marginBottom: index === 2 ? 25 : 5,
              borderRadius: 15,
            }}>
            <CoachCard coach={item} />
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default OurCoaches;
