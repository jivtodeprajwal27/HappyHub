import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Card } from 'react-native-paper';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import  { StackParamList }  from './list/StackParamList';

type MoodAssessmentScreenNavigationProp = StackNavigationProp<StackParamList, 'MoodAssessment'>;

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

export default function MoodAssessmentScreen() {
  const navigation = useNavigation<MoodAssessmentScreenNavigationProp>();
  
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

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>How are you feeling?</Text>
      <Text style={styles.subtitle}>Select a mood to start your assessment</Text>
      <View style={styles.moodGrid}>
        {moods.map((mood, index) => (
          <TouchableOpacity
            key={index}
            style={styles.moodItem}
            onPress={() => handleMoodSelection(mood.name)}
          >
            <Card style={styles.moodCard}>
              <Image source={mood.icon} style={styles.moodIcon} />
              <Text style={styles.moodText}>{mood.name}</Text>
            </Card>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F4F8',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2D3748',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#4A5568',
    marginBottom: 24,
  },
  moodGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  moodItem: {
    width: '30%',
    marginBottom: 16,
  },
  moodCard: {
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
  },
  moodIcon: {
    width: 60,
    height: 60,
    marginBottom: 8,
  },
  moodText: {
    fontSize: 12,
    textAlign: 'center',
    color: '#4A5568',
  },
});