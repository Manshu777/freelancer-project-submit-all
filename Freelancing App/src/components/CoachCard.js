import React from 'react';
import {
  Image,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  Dimensions,
} from 'react-native';
import Education from '../assets/images/Education.png';
// import Verifyed from '../assets/images/Verifyed.png';
import Star from '../assets/images/Star.png';
import Exp from '../assets/images/Exp.png';
import Dollar from '../assets/images/dollar.png';
// import Lang from '../assets/images/Lclsang.png';
import styles from '../styles/HomeStyle';
import {useNavigation} from '@react-navigation/native';


import {Images} from '../config/Appurl';

const {width} = Dimensions.get('window');

const CoachCard = ({coach}) => {

  const navigation = useNavigation();
  
  const {
    Full_Name: name,
    rating = 'N/A',
    role,
    image: coachImage,
    skills = [],
    languages = [],
    experience = 'N/A',
    buttons = [],
  } = coach;

  const renderButton = ({item}) => (
    <TouchableOpacity style={styles.CoachButtons} activeOpacity={0.7}>
      <Image source={item.image} style={styles.CoachButtIcon} />
      <Text style={styles.buttTextCoach}>{item.title}</Text>
    </TouchableOpacity>
  );

  const renderLimitedList = (items, maxCount, isSports = false) => {
    if (items.length > maxCount) {
      const displayedItems = items.slice(0, maxCount);
      const remainingCount = items.length - maxCount;
      return (
        <>
          {displayedItems.join(', ')}
          {isSports ? ' and ' : ', '}
          <Text style={{color: '#00A9C0'}}>+{remainingCount} More</Text>
        </>
      );
    } else {
      return items.join(', ');
    }
  };

  // Navigate to Profile with coach data
  const handlePress = () => {
    navigation.navigate('Profile', {coach});
  };

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.9}>
      <View style={styles.CoachCards}>
        <View style={styles.CoachDetails}>
          <View style={styles.CoachImgSection}>
            <Image
              source={{uri: `${Images}${coach.image}`}}
              style={styles.CoachImage}
            />
            <View style={styles.Coachrating}>
              <Image source={Star} style={styles.RatingStar} />
              <Text style={styles.RatingNumber}>{rating}</Text>
            </View>
          </View>

          <View style={{flex: 0, gap: 10}}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                width: width * 0.54,
                marginTop: 5,
              }}>
              <Text style={{color: 'black', fontSize: 18, fontWeight: '600'}}>
                {coach.Full_Name}
              </Text>
            </View>

            <View style={{flex: 0, gap: 7.5}}>
              <View
                style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
                <Image source={Education} style={{width: 20, height: 20}} />
              </View>

              <View
                style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
                <Image source={Exp} style={{width: 20, height: 20}} />
                <Text
                  style={{color: '#616161', width: width * 0.5, fontSize: 16}}>
                  {experience}
                </Text>
              </View>
              <View
                style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
                <Image source={Dollar} style={{width: 20, height: 20}} />
                <Text
                  style={{color: '#616161', width: width * 0.5, fontSize: 16}}>
                  {experience}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={{marginTop: 15}}>
          <FlatList
            data={buttons}
            renderItem={renderButton}
            keyExtractor={item => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default CoachCard;
