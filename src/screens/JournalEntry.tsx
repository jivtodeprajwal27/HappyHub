import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { Card, Button, ProgressBar } from 'react-native-paper';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { SentimentIntensityAnalyzer } from 'vader-sentiment';

export default function JournalEntry({ navigation }) {
  const [content, setContent] = useState<string>('');
  const [sentimentScore, setSentimentScore] = useState<number | null>(null);
  const [entrySaved, setEntrySaved] = useState<boolean>(false);
  const currentDate = new Date().toLocaleDateString();

  const preprocessText = (text: string): string => {
    return text.toLowerCase().replace(/[^a-zA-Z\s]/g, '');
  };

  const getSentimentScore = (text: string): number => {
    const cleanedText = preprocessText(text);
    const sentiment = SentimentIntensityAnalyzer.polarity_scores(cleanedText);
    return sentiment.compound;
  };

  const saveJournalEntry = async () => {
    if (!content) {
      console.error('Content is empty');
      return;
    }

    try {
      const user = auth().currentUser;
      if (user) {
        const score = getSentimentScore(content);
        setSentimentScore(score);
        await firestore().collection('JournalEntries').add({
          userId: user.uid,
          content: content,
          sentimentScore: score,
          date: currentDate,
          timestamp: firestore.FieldValue.serverTimestamp(),
        });
        console.log('Journal entry saved successfully!');
        setContent('');
        setEntrySaved(true);
      } else {
        console.error('No user is signed in');
      }
    } catch (error) {
      console.error('Error saving journal entry:', error);
    }
  };

  const getProgressBarColor = (score: number): string => {
    if (score > 0.2) return '#4CAF50'; // Green for positive sentiment
    if (score < -0.2) return '#E53935'; // Red for negative sentiment
    return '#FFEB3B'; // Yellow for neutral sentiment
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Daily Journal</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Entries')} style={styles.viewEntriesButton}>
          <Text style={styles.viewEntriesText}>View Previous Entries</Text>
        </TouchableOpacity>
      </View>

      <Card style={styles.card}>
        <Text style={styles.cardTitle}>Today's Entry</Text>
        <Text style={styles.cardTitle}>{currentDate}</Text>
        <TextInput
          placeholder="Write down whatever is on your mind today you can explore why you felt the way you did? Or just simply acknowledge that something happened. Use this space to free your mind!"
          value={content}
          onChangeText={setContent}
          style={styles.textarea}
          multiline
        />
        <Button onPress={saveJournalEntry} mode="contained" style={styles.saveButton}>
          Save Entry
        </Button>

        {sentimentScore !== null && (
          <View style={styles.sentimentContainer}>
            <Text style={styles.sentimentText}>Sentiment Score: {sentimentScore.toFixed(2)}</Text>
            <ProgressBar
              progress={(sentimentScore + 1) / 2}
              color={getProgressBarColor(sentimentScore)}
              style={styles.progressBar}
            />
          </View>
        )}

        {entrySaved && (
          <Button 
            mode="contained" 
            onPress={() => navigation.navigate('Entries')}
            style={styles.viewEntriesButton}
          >
            View All Entries
          </Button>
        )}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2D3748',
  },
  viewEntriesButton: {
    backgroundColor: '#FFFAF0', // Use pastel color for the button
    padding: 8,
    borderRadius: 5,
  },
  viewEntriesText: {
    fontSize: 16,
    color: '#4299E1', // Color for the link
  },
  card: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#FFFAF0', // Pastel background
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#4A5568',
  },
  textarea: {
    height: 200,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 4,
    padding: 8,
    backgroundColor: '#FFFFFF',
  },
  sentimentContainer: {
    marginTop: 12,
  },
  sentimentText: {
    fontSize: 16,
    color: '#4A5568',
  },
  progressBar: {
    height: 10,
    borderRadius: 5,
    marginTop: 8,
  },
  saveButton: {
    marginTop: 8,
  },
});
