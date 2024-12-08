import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, ImageBackground, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { StackNavigationProp } from '@react-navigation/stack';
import { StackParamList } from './list/StackParamList';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const moods = [
  { name: 'Angry', icon: require('../assets/angry-brain.png') },
  { name: 'Stressed', icon: require('../assets/stressed-brain.png') },
  { name: 'Sad', icon: require('../assets/sad-brain.png') },
  { name: 'Empty', icon: require('../assets/empty-brain.png') },
  { name: 'Overwhelmed', icon: require('../assets/overwhelmed-brain.png') },
  { name: 'Lonely', icon: require('../assets/lonely-brain.png') },
  { name: 'Panic Attack', icon: require('../assets/panic-brain.png') },
  { name: 'Insomnia', icon: require('../assets/insomnia-brain.png') },
  { name: 'Depression', icon: require('../assets/depression-brain.png') },
  { name: 'Anxiety', icon: require('../assets/anxiety-brain.png') },
];

export default function StudentHomeScreen() {
  const navigation = useNavigation<StackNavigationProp<StackParamList>>();
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserData = async () => {
    const user = auth().currentUser;
    if (!user) {
      console.error('No user is signed in');
      return;
    }

    try {
      const userDoc = await firestore().collection('Users').doc(user.uid).get();
      if (userDoc.exists) {
        setUserData({ ...userDoc.data(), email: user.email });
      } else {
        setUserData({ username: user.displayName || 'Anonymous', email: user.email });
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const navigateToScreen = (screenName: keyof StackParamList) => {
    navigation.navigate(screenName);
  };

  const handleMoodSelection = async (mood: string) => {
    try {
      const user = auth().currentUser;
      if (user) {
        await firestore().collection('moodAssessments').add({
          userId: user.uid,
          mood: mood,
          timestamp: firestore.FieldValue.serverTimestamp(),
        });
        navigation.navigate('MoodQuestionsScreen', { mood });
      } else {
        console.error('No user is signed in');
      }
    } catch (error) {
      console.error('Error saving mood assessment:', error);
    }
  };

  if (loading) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        <Text style={styles.welcomeText}>
          {userData ? `Welcome, ${userData.username}!` : 'Welcome!'}
        </Text>

        {/* Mood Assessment Section */}
        <View style={styles.moodSection}>
          <Text style={styles.moodTitle}>Help!! I feel??</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.moodScroll}>
            {moods.map((mood, index) => (
              <TouchableOpacity
                key={index}
                style={styles.moodCard}
                onPress={() => handleMoodSelection(mood.name)}
              >
                <Image source={mood.icon} style={styles.moodIcon} />
                <Text style={styles.moodText}>{mood.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Other sections */}
        {[
          {
            title: 'Daily Journal',
            description: 'Record your thoughts and experiences for the day.',
            image: require('../assets/journal.jpg'),
            screen: 'JournalEntry',
          },
          {
            title: 'Relaxation Exercises',
            description: 'Practice exercises to help you relax and unwind.',
            image: require('../assets/relaxation.jpg'),
            screen: 'RelaxationExercises',
          },
          {
            title: 'Join a Community',
            description: 'Share your experiences and make connections.',
            image: require('../assets/community.jpg'),
            screen: 'Community',
          },
          {
            title: 'Book a Therapist',
            description: 'Schedule an appointment with a therapist.',
            image: require('../assets/therapist.jpg'),
            screen: 'TherapistBooking',
          },
        ].map((section, index) => (
          <TouchableOpacity
            key={index}
            style={styles.cardContainer}
            onPress={() => navigateToScreen(section.screen as keyof StackParamList)}
          >
            <ImageBackground source={section.image} style={styles.cardImage} imageStyle={styles.image}>
              <View style={styles.textOverlay}>
                <Text style={styles.cardTitle}>{section.title}</Text>
                <Text style={styles.cardDescription}>{section.description}</Text>
              </View>
            </ImageBackground>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Bottom Navigation Bar */}
      <View style={styles.navigationBar}>
        <TouchableOpacity onPress={() => navigateToScreen('StudentHomeScreen')}>
          <Icon name="home" size={30} color="#ff6347" />
          <Text style={styles.iconText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigateToScreen('Appointments')}>
          <Icon name="event" size={30} color="#4CAF50" />
          <Text style={styles.iconText}>Appointments</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigateToScreen('MoodTracker')}>
          <Icon name="mood" size={30} color="#FFD700" />
          <Text style={styles.iconText}>Mood Tracker</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigateToScreen('Profile')}>
          <Icon name="person" size={30} color="#1E90FF" />
          <Text style={styles.iconText}>Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F4F8' },
  content: { padding: 16 },
  welcomeText: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#333' },
  moodSection: {
    marginBottom: 20,
  },
  moodTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#FF6347',
  },
  moodScroll: {
    paddingHorizontal: 10,
  },
  moodCard: {
    alignItems: 'center',
    marginRight: 16,
    padding: 10,
    backgroundColor: '#FFF',
    borderRadius: 12,
    elevation: 3,
    width: 100,
    height: 120,
    justifyContent: 'center',
  },
  moodIcon: {
    width: 50,
    height: 50,
    marginBottom: 8,
  },
  moodText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4A5568',
  },
  cardContainer: {
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 5,
  },
  cardImage: {
    height: 150,
    justifyContent: 'flex-end',
  },
  image: {
    borderRadius: 12,
    opacity: 0.8,
  },
  textOverlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 10,
  },
  cardTitle: { fontSize: 18, fontWeight: 'bold', color: '#FFF', marginBottom: 5 },
  cardDescription: { fontSize: 14, color: '#E0E0E0' },
  navigationBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    backgroundColor: '#fff',
  },
  iconText: {
    fontSize: 12,
    color: '#333',
    marginTop: 4,
    textAlign: 'center',
  },
});
