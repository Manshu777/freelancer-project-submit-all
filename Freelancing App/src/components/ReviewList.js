import React, {useState} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
const {width, height} = Dimensions.get('window');

const reviews = [
  {
    id: '1',
    image: require('../assets/images/My.png'),
    name: 'John Doe',
    rating: 5,
    review: 'This coach has completely transformed my game! Highly recommend.',
  },
  {
    id: '2',
    image: require('../assets/images/My.png'),
    name: 'Jane Smith',
    rating: 4,
    review: 'Great experience overall, learned a lot in just a few sessions.',
  },
  {
    id: '3',
    image: require('../assets/images/My.png'),
    name: 'Mike Johnson',
    rating: 5,
    review: 'An amazing coach! Very supportive and knowledgeable.',
  },
  {
    id: '4',
    image: require('../assets/images/My.png'),
    name: 'Emily Davis',
    rating: 3,
    review: 'Good coach but sessions were a bit too fast-paced for my level.',
  },
  {
    id: '5',
    image: require('../assets/images/My.png'),
    name: 'Sarah Lee',
    rating: 4,
    review: 'Fantastic coaching style and very engaging!',
  },
  {
    id: '6',
    image: require('../assets/images/My.png'),
    name: 'Chris Brown',
    rating: 5,
    review:
      'I’ve seen significant improvement in my skills since training here!',
  },
  {
    id: '7',
    image: require('../assets/images/My.png'),
    name: 'Ashley Taylor',
    rating: 4,
    review: 'Very informative sessions with practical tips.',
  },
  {
    id: '8',
    image: require('../assets/images/My.png'),
    name: 'David Wilson',
    rating: 2,
    review:
      'Did not meet my expectations, coaching style was not suitable for me.',
  },
  {
    id: '9',
    image: require('../assets/images/My.png'),
    name: 'Sophia Martinez',
    rating: 5,
    review: 'Incredible experience! The coach made learning fun and engaging.',
  },
  {
    id: '10',
    image: require('../assets/images/My.png'),
    name: 'Liam Smith',
    rating: 2,
    review: 'Decent coaching but could improve on the feedback given.',
  },
];

// Log the counts to the console

const ReviewList = () => {
  const [newReview, setNewReview] = useState('');
  const [newRating, setNewRating] = useState(0); // Rating (1-5)

  const handleReviewChange = text => {
    setNewReview(text);
  };

  const handleRatingChange = rating => {
    setNewRating(rating);
  };

  const ratingCounts = Array(5).fill(0);

  reviews.forEach(review => {
    if (review.rating >= 1 && review.rating <= 5) {
      ratingCounts[review.rating - 1] += 1;
    }
  });

  const totalStars = reviews.reduce((sum, review) => sum + review.rating, 0);
  const avgRating = (totalStars / reviews.length).toFixed(1);
  const totalReviews = reviews.length;

  return (
    <View style={styles.mainContainer}>
      <Text style={styles.title}>Rating Overview</Text>

      <View style={styles.reviewInputContainer}>
        <TextInput
          style={styles.reviewInput}
          placeholder="Write your review here..."
          placeholderTextColor={'#808080'}
          value={newReview}
          onChangeText={handleReviewChange}
          multiline
        />

        <View style={styles.ratingContainer}>
          {[1, 2, 3, 4, 5].map(rating => (
            <TouchableOpacity
              key={rating}
              onPress={() => handleRatingChange(rating)}>
              <Text
                style={[
                  styles.ratingStar,
                  newRating >= rating
                    ? styles.selectedRating
                    : styles.defaultRating,
                ]}>
                ★
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Submit Button */}
        <TouchableOpacity style={styles.submitButton}>
          <Text style={styles.submitButtonText}>Submit Review</Text>
        </TouchableOpacity>
      </View>
      <View
        style={{
          flexDirection: 'row',
          gap: 10,
          alignItems: 'center',
          justifyContent: 'flex-start',
        }}>
        <View style={styles.infoContainer}>
          <Text style={{fontSize: 42, fontWeight: '600', color: 'black'}}>
            {avgRating}/
            <Text style={{fontSize: 24, fontWeight: '600', color: 'black'}}>
              5
            </Text>
          </Text>
          <Text style={{fontSize: 18}}>⭐⭐⭐⭐⭐</Text>
          <Text style={{fontSize: 18, fontWeight: '600', color: '#808080'}}>
            {totalReviews}
          </Text>
        </View>
      </View>
      {reviews.slice(0, 7).map(item => (
        <View key={item.id} style={styles.reviewContainer}>
          <Image source={item.image} style={styles.reviewImage} />
          <View style={styles.reviewContent}>
            <Text style={styles.reviewerName}>{item.name}</Text>
            <View style={styles.reviewerRating}>
              {Array.from({length: item.rating}, (_, index) => (
                <Text key={index} style={{fontSize:24,color:'#f7a825'}}>
                  ★
                </Text>
              ))}
            </View>
            <Text style={styles.reviewerText}>{item.review}</Text>
          </View>
        </View>
      ))}
    </View>
  );
};

export default ReviewList;

const styles = StyleSheet.create({
  mainContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    marginBottom: 20,
  },
  title: {
    color: 'black',
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 10,
    width: width * 0.9,
  },
  infoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  infoText: {
    color: 'black',
    fontSize: 16,
    marginVertical: 2,
  },
  chartContainer: {
    width: width * 0.6,
    alignItems: 'center',
    marginBottom: 20,
  },
  chart: {
    borderRadius: 16,
  },
  reviewContainer: {
    flexDirection: 'row',
    marginBottom: 15,
    width: width * 0.9,
    padding: 10,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 1.5,
    elevation: 2,
  },
  reviewImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  reviewContent: {
    flex: 1,
  },
  reviewerName: {
    fontWeight: 'bold',
    fontSize: 16,
    color: 'black',
  },
  reviewerRating: {
    flexDirection: 'row',
    color: '#666',
    marginVertical: 2,
  },
  reviewerText: {
    marginTop: 5,
    color: 'black',
  },
  reviewInputContainer: {
    marginTop: 20,
    width: width * 0.9,
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 1.5,
    elevation: 2,
  },
  reviewInput: {
    height: 80,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    fontSize: 16,
  },
  ratingContainer: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  ratingStar: {
    fontSize: 40,
    marginRight: 5,
  },
  defaultRating: {
    color: '#ddd', // White stars before selection
  },
  selectedRating: {
    color: '#f7a825', // Yellow stars when selected
  },
  submitButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
