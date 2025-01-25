import React, {useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import axios from 'axios';
import CoachDp from '../../assets/images/Rishav.jpg';
import {Images} from '../../config/Appurl';
import Verifyed from '../../assets/images/Verifyed.png';
import Star from '../../assets/images/Star.png';
import Exp from '../../assets/images/Exp.png';
import Lang from '../../assets/images/Lang.png';
import styles from '../../styles/CoachProfilecss';
import Coaches from '../../components/Coaches';
import ReviewList from '../../components/ReviewList';

import {Baseurl} from '../../config/Appurl';

const {width, height} = Dimensions.get('window');

const CoachProfile = ({route}) => {
  const navigation = useNavigation();
  const [projectsData, setProjectsData] = useState([]);
  const [aboutText, setAboutText] = useState('');
  const [skills, setSkills] = useState([]);
  const [educationData, setEducationData] = useState([]);
  const [UserDetails, setUserDetails] = useState([]);
  const [Loading, setLoading] = useState([]);

  const {coach} = route.params;

  // console.log('this is Freelancer Data', coach);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${Baseurl}/user`);
        const userData = response.data.find(user => user.id === coach.id);
        setUserDetails(userData);
        if (userData) {
          setAboutText(userData.about);
          setSkills(userData.skills || []);
          setEducationData(userData.education || []);
          setProjectsData(userData.projects || []);
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

  return (
    <ScrollView style={styles.container}>
      <View style={styles.maincontainer}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButtonContainer}
            onPress={navigation.goBack}>
            <Image
              source={require('../../assets/images/LeftArrow.png')}
              style={styles.backButtonIcon}
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Profile</Text>
        </View>

        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#fff',
            paddingTop: 15,
          }}>
          <View style={styles.CoachCards}>
            <View style={styles.CoachDetails}>
              <View style={styles.CoachImgSection}>
                <Image
                  source={{uri: `${Images}${coach.image}`}}
                  style={styles.CoachImage}
                />

                {/* <View style={styles.Coachrating}>
                  <Image source={Star} style={styles.RatingStar} />

                  <Text style={styles.RatingNumber}>-0.1</Text>
                </View> */}
              </View>

              <View style={{flex: 0, gap: 10}}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    width: width * 0.5,
                    marginTop: 5,
                  }}>
                  <Text
                    style={{color: 'black', fontSize: 18, fontWeight: '600'}}>
                    {coach.Full_Name}
                  </Text>

                  <Image source={Verifyed} style={{width: 25, height: 25}} />
                </View>

                <View style={{flex: 0, gap: 7.5}}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 10,
                    }}>
                    <Image
                      source={require('../../assets/images/Education.png')}
                      style={{width: 20, height: 20}}
                    />
                    <Text
                      style={{
                        color: '#616161',
                        width: width * 0.4,
                        fontSize: 16,
                      }}>
                      Tennis
                    </Text>
                  </View>

                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 10,
                    }}>
                    <Image source={Lang} style={{width: 20, height: 20}} />
                    <Text
                      style={{
                        color: '#616161',
                        width: width * 0.5,
                        fontSize: 16,
                      }}>
                      Hindi, English
                    </Text>
                  </View>

                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 10,
                    }}>
                    <Image source={Exp} style={{width: 20, height: 20}} />
                    <Text
                      style={{
                        color: '#616161',
                        width: width * 0.5,
                        fontSize: 16,
                      }}>
                      5 Years
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            <View style={{marginTop: 15, flexDirection: 'row'}}>
              <TouchableOpacity style={styles.CoachButtons} activeOpacity={0.7}>
                <Image
                  source={require('../../assets/images/Chat.png')}
                  style={styles.CoachButtIcon}
                />
                <Text style={styles.buttTextCoach}>Chat Now</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.CoachButtons} activeOpacity={0.7}>
                <Image
                  source={require('../../assets/images/Call-Icon.png')}
                  style={styles.CoachButtIcon}
                />
                <Text style={styles.buttTextCoach}>Call Now</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.containerDetails}>
          <Text style={{color: '#000', marginBottom: 10, fontSize: 20}}>
            About Me
          </Text>
          <Text style={{margin: 0}}>{aboutText}</Text>

          <Text
            style={{
              color: '#000',
              fontSize: 20,
              marginTop: 10,
              marginBottom: 10,
            }}>
            Skills
          </Text>

          {skills.map((item, index) => (
            <View key={index} style={styles.skillItem}>
              <Text style={styles.skillName}>{item.SkillName}</Text>
              <Text style={styles.skillDescription}>{item.description}</Text>
            </View>
          ))}

          <Text style={{color: '#000', marginBottom: 10, fontSize: 20}}>
            Education
          </Text>
          {educationData.length === 0 ? (
            <></>
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
                      {item.degree}-{item.year}
                    </Text>
                  </View>
                  <Text style={{fontSize: 14}}>{item.institution}</Text>
                </View>
              </View>
            ))
          )}
          <>
            <Text style={{color: '#000', marginBottom: 10, fontSize: 20}}>
              Projects
            </Text>
            <View
              style={{
                width: width * 0.95,
                marginLeft: -10,
                flexDirection: 'row',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
              }}>
              {projectsData.length === 0 ? (
                <></>
              ) : (
                projectsData.map((item, index) => (
                  <View key={index} style={styles.projectItem}>
                    <View style={{width: '70%'}}>
                      <Text
                        style={{fontSize: 18, color: 'black', width: '100%'}}>
                        {item.name}
                      </Text>
                      <Text style={{fontSize: 14, width: '100%'}}>
                        {item.description}
                      </Text>
                      {item.linkType === 'image' ? (
                        <Image
                          source={{uri: item.link}}
                          style={styles.projectImage}
                        />
                      ) : (
                        <TouchableOpacity
                          onPress={() => openLink(item.link)}
                          style={styles.linkButton}>
                          <Text style={styles.linkButtonText}>
                            Open Website
                          </Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                ))
              )}
            </View>
          </>
        </View>

        <ReviewList />
        {/* <Coaches /> */}
      </View>
    </ScrollView>
  );
};

export default CoachProfile;
