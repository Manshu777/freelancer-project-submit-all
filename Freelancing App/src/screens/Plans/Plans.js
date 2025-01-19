import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  TouchableOpacity,
} from 'react-native';

const { width } = Dimensions.get('window');

export default function Plans() {
  const [selectedRole, setSelectedRole] = useState('Freelancer');

  const freelancerPackages = [
    {
      id: '1',
      title: 'Scribe Pro Package',
      features: [
        'Credits: 50',
        'Services: 10',
        'Featured Services: 2',
        'Banner Options: 1',
        'Duration: 30 Days',
        'Skills: 5',
        'Private Quick Chat: Yes',
      ],
    },
    {
      id: '2',
      title: 'Wordsmith Warrior Package',
      features: [
        'Credits: 100',
        'Services: 20',
        'Featured Services: 5',
        'Banner Options: 3',
        'Duration: 60 Days',
        'Skills: 10',
        'Private Quick Chat: Yes',
      ],
    },
    {
      id: '3',
      title: 'Creative Catalyst Package',
      features: [
        'Credits: Unlimited',
        'Services: Unlimited',
        'Featured Services: 10',
        'Banner Options: 5',
        'Duration: 90 Days',
        'Skills: Unlimited',
        'Private Quick Chat: Yes',
      ],
    },
  ];

  const employerPackages = [
    {
      id: '1',
      title: 'Seeking Master Scribe Package',
      features: [
        'Jobs: 27',
        'Featured Jobs: 20',
        'Banner Options: 2',
        'Duration: 30 Days',
        'Private Quick Chat: Yes',
      ],
    },
    {
      id: '2',
      title: 'Seeking Word Wizardry Package',
      features: [
        'Jobs: 50',
        'Featured Jobs: 30',
        'Banner Options: 3',
        'Duration: 60 Days',
        'Private Quick Chat: Yes',
      ],
    },
    {
      id: '3',
      title: 'Seeking Prose Perfection Package',
      features: [
        'Jobs: Unlimited',
        'Featured Jobs: Unlimited',
        'Banner Options: 5',
        'Duration: 90 Days',
        'Private Quick Chat: Yes',
      ],
    },
  ];

  const plans = selectedRole === 'Freelancer' ? freelancerPackages : employerPackages;

  const renderPlan = ({ item }) => (
    <View style={styles.card}>
    <Text style={styles.cardTitle}>{item.title}</Text>
    <View>
      {item.features.map((feature, index) => (
        <Text key={index} style={styles.feature}>
          • {feature}
        </Text>
      ))}
    </View>
    <TouchableOpacity style={styles.button}>
      <Text style={styles.buttonText}>Choose {item.title}</Text>
    </TouchableOpacity>
  </View>
  );

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton}>

      </TouchableOpacity>

      <Text style={styles.header}>Membership Plans</Text>

      {/* Role Selection */}
      <View style={styles.radioContainer}>
        <TouchableOpacity
          style={styles.radioButton}
          onPress={() => setSelectedRole('Freelancer')}
        >
          <Text
            style={[
              styles.radioText,
              selectedRole === 'Freelancer' && styles.radioSelected,
            ]}
          >
            Freelancer
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.radioButton}
          onPress={() => setSelectedRole('Employer')}
        >
          <Text
            style={[
              styles.radioText,
              selectedRole === 'Employer' && styles.radioSelected,
            ]}
          >
            Employer
          </Text>
        </TouchableOpacity>
      </View>

      {/* Plans */}
      <FlatList
        data={plans}
        renderItem={renderPlan}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        contentContainerStyle={styles.slider}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: 20,
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 10,
    zIndex: 1,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 10,
    elevation: 5,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  radioContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  radioButton: {
    marginHorizontal: 10,
  },
  radioText: {
    fontSize: 16,
    color: '#666',
    padding: 10,
  },
  radioSelected: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  slider: {
    paddingHorizontal: 10,
  },
  card: {
    width: width * 0.8,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginHorizontal: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  feature: {
    fontSize: 14,
    color: '#555',
    marginBottom: 5,
  },
  button: {
    marginTop: 20,
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
