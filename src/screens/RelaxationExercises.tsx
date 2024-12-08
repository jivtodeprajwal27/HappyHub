import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { Card, Button, ProgressBar } from 'react-native-paper';
import { Svg, Path } from 'react-native-svg';
import { Audio } from 'expo-av';
import WebView from 'react-native-webview';

// Play Icon
const PlayIcon = () => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M5 3l14 9-14 9V3z" />
  </Svg>
);

// Pause Icon
const PauseIcon = () => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M6 4h4v16H6zM14 4h4v16h-4z" />
  </Svg>
);

// Skip Forward Icon
const SkipForwardIcon = () => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M5 4l10 8-10 8V4zM19 5v14" />
  </Svg>
);

export default function RelaxationExercises() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [sound, setSound] = useState<Audio.Sound | null>(null);

  // Play the sound
  const playSound = async () => {
    try {
      const { sound: newSound } = await Audio.Sound.createAsync(
        require('../assets/relaxation-music.mp3')  // Update path as needed
      );
      setSound(newSound);
      await newSound.playAsync();
      setIsPlaying(true);

      newSound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded) {
          if (status.didJustFinish) {
            setIsPlaying(false);
            setProgress(0);
          } else if (status.isPlaying) {
            setProgress(status.positionMillis / status.durationMillis);
          }
        }
      });
    } catch (error) {
      Alert.alert('Error', 'Unable to play sound. Please try again later.');
      console.error('Error loading sound:', error);
    }
  };

  // Pause the sound
  const pauseSound = async () => {
    if (sound) {
      await sound.pauseAsync();
      setIsPlaying(false);
    }
  };

  // Stop the sound
  const stopSound = async () => {
    if (sound) {
      await sound.stopAsync();
      await sound.unloadAsync(); // Unload the sound
      setIsPlaying(false);
      setSound(null);
      setProgress(0);
    }
  };

  // Cleanup when the component unmounts
  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync().catch(console.error);
      }
    };
  }, [sound]);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Relaxation Exercises</Text>

      {/* Breathing Exercise Section */}
      <Card style={styles.card}>
        <Text style={styles.cardTitle}>Breathing Exercise</Text>
        <Text style={styles.instructions}>
          1. Sit comfortably and close your eyes{"\n"}
          2. Breathe in slowly through your nose for 4 seconds{"\n"}
          3. Hold your breath for 4 seconds{"\n"}
          4. Exhale slowly through your mouth for 6 seconds{"\n"}
          5. Repeat for 5 minutes
        </Text>

        {/* YouTube Video Embedding */}
        <View style={styles.videoContainer}>
          <WebView
            style={styles.video}
            source={{ uri: "https://www.youtube.com/embed/lPJAtHWq08k?si=xnHFjQ2MyAcsYGOG" }}
          />
        </View>

        {/* Music Player Controls */}
        <View style={styles.playerControls}>
          <Button onPress={isPlaying ? pauseSound : playSound} style={styles.controlButton}>
            {isPlaying ? <PauseIcon /> : <PlayIcon />}
          </Button>
          <Button onPress={stopSound} style={styles.controlButton}>
            <SkipForwardIcon />
          </Button>
        </View>
        <ProgressBar progress={progress} color="#4299E1" style={styles.progressBar} />
      </Card>

      {/* Progressive Muscle Relaxation Section */}
      <Card style={styles.card}>
        <Text style={styles.cardTitle}>Progressive Muscle Relaxation</Text>
        <Text style={styles.instructions}>
          1. Start with your feet and toes{"\n"}
          2. Tense the muscles for 5 seconds{"\n"}
          3. Relax the muscles and notice the difference{"\n"}
          4. Move up to your calves, thighs, and so on{"\n"}
          5. Continue until you've tensed and relaxed all major muscle groups
        </Text>
        {/* YouTube Video Embedding */}
        <View style={styles.videoContainer}>
          <WebView
            style={styles.video}
            source={{ uri: "https://www.youtube.com/embed/_1h-zizAGsc?si=sO0llI_M1C9blJIa" }}
          />
        </View>
        <Button onPress={() => {/* Navigate to guided PMR exercise */}} mode="contained">
          Start Guided Exercise
        </Button>
      </Card>

      {/* Mindfulness Meditation Section */}
      <Card style={styles.card}>
        <Text style={styles.cardTitle}>Mindfulness Meditation</Text>
        <Text style={styles.instructions}>
          1. Find a quiet, comfortable place to sit{"\n"}
          2. Close your eyes and focus on your breath{"\n"}
          3. Notice the sensation of breathing without trying to change it{"\n"}
          4. When your mind wanders, gently bring your attention back to your breath{"\n"}
          5. Practice for 5-10 minutes daily
        </Text>
        {/* YouTube Video Embedding */}
        <View style={styles.videoContainer}>
          <WebView
            style={styles.video}
            source={{ uri: "https://www.youtube.com/embed/ssss7V1_eyA?si=WZ7_UzxuoG3qbaac" }}
          />
        </View>
        <Button onPress={() => {/* Navigate to guided meditation */}} mode="contained">
          Start Guided Meditation
        </Button>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F7FAFC',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#2D3748',
  },
  card: {
    marginBottom: 16,
    padding: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#4A5568',
  },
  instructions: {
    marginBottom: 16,
    color: '#4A5568',
  },
  playerControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
  },
  controlButton: {
    marginHorizontal: 10,
  },
  progressBar: {
    height: 10,
    borderRadius: 5,
    marginTop: 16,
  },
  videoContainer: {
    height: 200,
    marginBottom: 16,
  },
  video: {
    height: '100%',
    width: '100%',
  },
});
