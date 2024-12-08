import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, Alert } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const screenWidth = Dimensions.get('window').width;

export default function MoodTrackerScreen() {
  const [sentimentData, setSentimentData] = useState<{ date: string; score: number }[]>([]);
  const [averageSentiment, setAverageSentiment] = useState<number | null>(null);

  useEffect(() => {
    const fetchSentimentData = async () => {
      const user = auth().currentUser;
      if (!user) return;

      try {
        // Fetch sentiment scores from journal entries
        const journalSnapshot = await firestore()
          .collection('JournalEntries')
          .where('userId', '==', user.uid)
          .orderBy('timestamp')
          .get();

        const sentimentScores: { date: string; score: number }[] = [];

        journalSnapshot.forEach(doc => {
          const data = doc.data();
          sentimentScores.push({
            date: data.timestamp.toDate().toLocaleDateString(),
            score: data.sentimentScore,
          });
        });

        setSentimentData(sentimentScores);

        // Calculate average sentiment score
        const average = sentimentScores.reduce((acc, curr) => acc + curr.score, 0) / sentimentScores.length;
        setAverageSentiment(average);

      } catch (error) {
        console.error('Error fetching sentiment data:', error);
        Alert.alert('Error', 'Failed to fetch sentiment data.');
      }
    };

    fetchSentimentData();
  }, []);

  const getSentimentLabel = (avgSentiment: number) => {
    if (avgSentiment > 0.6) return 'Positive';
    if (avgSentiment > 0.3) return 'Neutral';
    return 'Negative';
  };

  const getSentimentColor = (avgSentiment: number) => {
    if (avgSentiment > 0.6) return '#4CAF50'; // Green for positive
    if (avgSentiment > 0.3) return '#FFD700'; // Yellow for neutral
    return '#E53935'; // Red for negative
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Sentiment Score Pattern</Text>

      {sentimentData.length > 0 ? (
        <LineChart
          data={{
            labels: sentimentData.map(item => item.date), // Use date for labels
            datasets: [{ data: sentimentData.map(item => item.score) }], // Use score for the chart
          }}
          width={screenWidth - 32}
          height={220}
          chartConfig={{
            backgroundColor: '#FFFFFF',
            backgroundGradientFrom: '#E3F2FD',
            backgroundGradientTo: '#BBDEFB',
            color: (opacity = 1) => `rgba(66, 135, 245, ${opacity})`,
            labelColor: () => '#4A5568',
            strokeWidth: 2,
          }}
          bezier
          style={styles.chart}
        />
      ) : (
        <Text>No sentiment data available</Text>
      )}

      <View style={[styles.overallSentimentContainer, { backgroundColor: getSentimentColor(averageSentiment ?? 0) }]}>
        <Text style={styles.overallSentimentText}>
          Overall Sentiment: {averageSentiment !== null ? getSentimentLabel(averageSentiment) : 'No data'}
        </Text>
        <Text style={styles.avgScore}>Average Sentiment Score: {(averageSentiment ?? 0).toFixed(2)}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: '#F7FAFC',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#2D3748',
  },
  chart: {
    marginVertical: 20,
    borderRadius: 16,
  },
  overallSentimentContainer: {
    marginTop: 20,
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    width: screenWidth - 32,
  },
  overallSentimentText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  avgScore: {
    fontSize: 16,
    color: '#FFFFFF',
    marginTop: 8,
  },
});
