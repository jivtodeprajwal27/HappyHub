import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { Card, ProgressBar } from 'react-native-paper'; // Import Card and ProgressBar for better UI
import { StackParamList } from './list/StackParamList';

type AssessmentSummaryProps = {
  navigation: StackNavigationProp<StackParamList, 'AssessmentSummary'>;
  route: RouteProp<StackParamList, 'AssessmentSummary'>;
};

const AssessmentSummary: React.FC<AssessmentSummaryProps> = ({ route, navigation }) => {
  const { score, mood, suggestions } = route.params;

  // Function to get color based on mood intensity
  const getScoreColor = (score: number) => {
    if (score > 7) return '#4CAF50'; // Positive/Happy - Green
    if (score > 4) return '#FFEB3B'; // Neutral - Yellow
    return '#E53935'; // Negative/Anxious - Red
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Assessment Summary</Text>

      {/* Score Card */}
      <Card style={styles.card}>
        <Text style={styles.cardTitle}>Your Emotional Intensity</Text>
        <ProgressBar
          progress={score / 10}
          color={getScoreColor(score)}
          style={styles.progressBar}
        />
        <Text style={[styles.score, { color: getScoreColor(score) }]}>
          {score.toFixed(1)} / 10
        </Text>
        <Text style={styles.mood}>
          You are feeling: <Text style={{ fontWeight: 'bold' }}>{mood.charAt(0).toUpperCase() + mood.slice(1)}</Text>
        </Text>
      </Card>

      {/* Suggestions Card */}
      <Card style={styles.card}>
        <Text style={styles.cardTitle}>Suggestions</Text>
        <Text style={styles.suggestionTitle}>Here are some tips to manage your {mood}:</Text>
        {suggestions.length > 0 ? (
          suggestions.map((suggestion: string, index: number) => (
            <Text key={index} style={styles.suggestion}>• {suggestion}</Text>
          ))
        ) : (
          <Text style={styles.suggestion}>No suggestions available.</Text>
        )}
      </Card>

      <Button
        title=" Back to home"
        onPress={() => navigation.navigate('StudentHomeScreen')}
        color="#4299E1"
        style={styles.backButton}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F7FAFC',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#2D3748',
    textAlign: 'center',
  },
  card: {
    padding: 20,
    backgroundColor: '#FFF',
    borderRadius: 12,
    elevation: 3,
    marginVertical: 10,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#2D3748',
  },
  score: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
  },
  mood: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
    color: '#4A5568',
  },
  progressBar: {
    height: 10,
    borderRadius: 5,
    marginVertical: 10,
  },
  suggestionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#2D3748',
  },
  suggestion: {
    fontSize: 16,
    marginBottom: 5,
    color: '#4A5568',
  },
  backButton: {
    marginTop: 20,
  },
});

export default AssessmentSummary;
