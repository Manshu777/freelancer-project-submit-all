import React, {useEffect, useState} from 'react';
import {View, Image, Text, FlatList, BackHandler, Alert} from 'react-native';
import styles from '../../styles/HomeStyle';
import Profile from '../../components/Profile';
import DailyGuide from '../../components/DailyGuide';
import HeroSection from '../../components/HeroSection';
import CoachCard from '../../components/CoachCard';
import Training from '../../components/Training';
import {ScrollView} from 'react-native-gesture-handler';
import axios from 'axios';
import {Baseurl} from '../../config/Appurl';
import AsyncStorage from '@react-native-async-storage/async-storage';

const trainingData = [
  {
    id: '1',
    backgroundColor: '#FAEADA',
    rodColor: '#BEBEBE',
    circleColor: '#CE853E',
    icon: require('../../assets/images/Clipboard.png'),
    heading: 'Onboarding & Profile Setup',
    paragraph:
      'Freelancers create a profile detailing their skills, expertise, and previous work experience.',
  },
  {
    id: '2',
    backgroundColor: '#DAF2F1',
    rodColor: '#BEBEBE',
    circleColor: '#32B2AD',
    icon: require('../../assets/images/Aim.png'),
    heading: 'Goal Setting & Job Matching',
    paragraph:
      'Clients and freelancers set clear project goals, and the app matches freelancers with suitable job opportunities.',
  },
  {
    id: '3',
    backgroundColor: '#F6DDDE',
    rodColor: '#BEBEBE',
    circleColor: '#B55457',
    icon: require('../../assets/images/Weight.png'),
    heading: 'Project Work & Milestones',
    paragraph:
      'Freelancers work on assigned projects, tracking milestones and deliverables to ensure timely progress.',
  },
  {
    id: '4',
    backgroundColor: '#F1E6F6',
    rodColor: '#BEBEBE',
    circleColor: '#A05BBD',
    icon: require('../../assets/images/Check.png'),
    heading: 'Feedback & Adjustments',
    paragraph:
      'Clients provide feedback on submitted work, and freelancers make revisions to meet client expectations.',
  },
  {
    id: '5',
    backgroundColor: '#E9FBEE',
    rodColor: '#BEBEBE',
    circleColor: '#6EBD84',
    icon: require('../../assets/images/Trophy.png'),
    heading: 'Completion & Ratings',
    paragraph:
      'Projects are marked as complete, and both clients and freelancers leave ratings and reviews to build credibility.',
  },
];

const Home = () => {
  const [Freelancers, setFreelancers] = useState([]);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${Baseurl}/user`);

        // Assuming response.data returns an array of users
        const freelancersData = response.data.filter(
          user => user.role === 'Freelancer',
        );

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

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('loginUser');
        if (storedUser) {
          
          const useimg = JSON.parse(storedUser)
          // console.log(useimg)
          setUserData(useimg); 
        }
      } catch (error) {
        console.error('Error fetching login user data:', error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <View style={styles.HomeContainer}>
      <ScrollView>
        <Profile userData={userData}/>
        <HeroSection />
        {/* <DailyGuide /> */}
        {/* <GetInTouch /> */}

        {/* <Coaches /> */}

        {/* <View style={styles.FinanceSection}>
          <View style={styles.FinanceHeading}>
            <Text style={styles.FinanceText}>
              Lets know About Our
              <Text style={styles.FinanceStu}> Profiles....</Text>
            </Text>
            <Text style={styles.FinancePara}>
              Our Coaches are there to Guide/ help you
            </Text>
          </View>
          <Image source={Finance} style={styles.FinanceImage} />
        </View> */}

        {/* <Students /> */}
        <View style={styles.CoachListSection}>
          <Text style={styles.CoachSectionHead}>Most Rated</Text>
          {Freelancers.slice(0, 10).map((item, index) => (
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
                marginTop: 0,
                marginLeft: 3,
                width: '97.5%',
                marginBottom: index === 2 ? 25 : 5,
                borderRadius: 15,
              }}>
              <CoachCard coach={item} />
            </View>
          ))}
        </View>
        <View style={styles.CoachListSection}>
          <Text style={styles.CoachSectionHead}>Training Journey</Text>
          {trainingData.map((item, index) => (
            <Training Trainning={item} key={item.id} index={index} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default Home;
