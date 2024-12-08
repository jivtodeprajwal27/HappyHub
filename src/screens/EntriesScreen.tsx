import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { Card } from 'react-native-paper';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { ProgressBar } from 'react-native-paper';

export default function EntriesScreen() {
  const [entries, setEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJournalEntries = async () => {
      try {
        const user = auth().currentUser;
        if (user) {
          const journalEntries = await firestore()
            .collection('JournalEntries')
            .where('userId', '==', user.uid) // Filter by current user
            .orderBy('timestamp', 'desc') // Order by latest first
            .get();
          
          const entriesList = journalEntries.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          
          setEntries(entriesList);
        } else {
          console.error('No user is signed in');
        }
      } catch (error) {
        console.error('Error fetching journal entries:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchJournalEntries();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4A5568" />
      </View>
    );
  }

  if (entries.length === 0) {
    return (
      <View style={styles.noEntriesContainer}>
        <Text style={styles.noEntriesText}>No journal entries found.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {entries.map((entry) => (
        <Card key={entry.id} style={styles.card}>
          <Text style={styles.entryTitle}>{entry.date}</Text>
          <Text style={styles.entryContent}>{entry.content}</Text>
          <Text style={styles.entrySentiment}>Sentiment Score: {entry.sentimentScore.toFixed(2)}</Text>
          <ProgressBar 
            progress={(entry.sentimentScore + 1) / 2} // Normalize score to 0-1 range
            color={getProgressBarColor(entry.sentimentScore)} // Get color based on sentiment score
            style={styles.progressBar}
          />
        </Card>
      ))}
    </ScrollView>
  );
}
const getProgressBarColor = (score: number): string => {
  if (score > 0.2) return '#4CAF50'; // Green for positive sentiment
  if (score < -0.2) return '#E53935'; // Red for negative sentiment
  return '#FFEB3B'; // Yellow for neutral sentiment
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F7FAFC',
  },
  progressBar: {
    height: 10,
    borderRadius: 5,
    marginTop: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noEntriesContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noEntriesText: {
    fontSize: 18,
    color: '#718096',
  },
  card: {
    marginBottom: 16,
    padding: 16,
  },
  entryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#2D3748',
  },
  entryContent: {
    fontSize: 16,
    color: '#4A5568',
  },
  entrySentiment: {
    marginTop: 8,
    fontSize: 14,
    color: '#718096',
  },
});
