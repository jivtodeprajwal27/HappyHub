import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, Alert, Image, ScrollView } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import CheckBox from '@react-native-community/checkbox'; // Import CheckBox
import { useNavigation } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
interface MoodQuestionsRouteParams {
  mood: string;
}

type MoodQuestionsScreenRouteProp = RouteProp<{ MoodQuestions: MoodQuestionsRouteParams }, 'MoodQuestions'>;

const MoodQuestionsScreen = () => {
  const route = useRoute<MoodQuestionsScreenRouteProp>();
  const { mood } = route.params;

  const quizQuestions: { [key: string]: { question: string; options: string[] }[] } = {
    Angry: [
      {
        question: "In the last month, I have felt angry.",
        options: [
          "Never (0 days a week)",
          "Almost Never (1 day a week)",
          "Sometimes (2 days a week)",
          "Fairly often (4 days a week)",
          "Very often (6 days a week)",
        ],
      },
      {
        question: "In the last month, I have felt angry about my future.",
        options: [
          "Never (0 days a week)",
          "Almost Never (1 day a week)",
          "Sometimes (2 days a week)",
          "Fairly often (4 days a week)",
          "Very often (6 days a week)",
        ],
      },
      {
        question: "In the last month, I have felt angry thinking about my past failures.",
        options: [
          "Never (0 days a week)",
          "Almost Never (1 day a week)",
          "Sometimes (2 days a week)",
          "Fairly often (4 days a week)",
          "Very often (6 days a week)",
        ],
      },
      {
        question: "In the last month, I have felt like I needed to scream at someone.",
        options: [
          "Never (0 days a week)",
          "Almost Never (1 day a week)",
          "Sometimes (2 days a week)",
          "Fairly often (4 days a week)",
          "Very often (6 days a week)",
        ],
      },
      {
        question: "In the last month, I have felt angry enough to want to hurt someone.",
        options: [
          "Never (0 days a week)",
          "Almost Never (1 day a week)",
          "Sometimes (2 days a week)",
          "Fairly often (4 days a week)",
          "Very often (6 days a week)",
        ],
      },
      {
        question: "In the last month, I have felt so angry that I did not pay attention to my health.",
        options: [
          "Never (0 days a week)",
          "Almost Never (1 day a week)",
          "Sometimes (2 days a week)",
          "Fairly often (4 days a week)",
          "Very often (6 days a week)",
        ],
      },
      {
        question: "In the last month, I have felt so angry that I did not want to be around people.",
        options: [
          "Never (0 days a week)",
          "Almost Never (1 day a week)",
          "Sometimes (2 days a week)",
          "Fairly often (4 days a week)",
          "Very often (6 days a week)",
        ],
      },
      {
        question: "In the last month, I have felt that others are intentionally trying to make me angry.",
        options: [
          "Never (0 days a week)",
          "Almost Never (1 day a week)",
          "Sometimes (2 days a week)",
          "Fairly often (4 days a week)",
          "Very often (6 days a week)",
        ],
      },
      {
        question: "In the last month, I have felt so angry that I have lost my appetite.",
        options: [
          "Never (0 days a week)",
          "Almost Never (1 day a week)",
          "Sometimes (2 days a week)",
          "Fairly often (4 days a week)",
          "Very often (6 days a week)",
        ],
      },
      {
        question: "In the last month, I have felt so angry that it interferes with my daily life.",
        options: [
          "Never (0 days a week)",
          "Almost Never (1 day a week)",
          "Sometimes (2 days a week)",
          "Fairly often (4 days a week)",
          "Very often (6 days a week)",
        ],
      },
    ],
    Stressed: [
      {
        question: "In the last month, how often have you been upset because of something that happened unexpectedly?",
        options: [
          "Never (0 days a week)",
          "Almost Never (1 day a week)",
          "Sometimes (2 days a week)",
          "Fairly often (4 days a week)",
          "Very often (6 days a week)",
        ],
      },
      {
        question: "In the last month, how often have you felt that you were not able to cope with all the things that you had to do?",
        options: [
          "Never (0 days a week)",
          "Almost Never (1 day a week)",
          "Sometimes (2 days a week)",
          "Fairly often (4 days a week)",
          "Very often (6 days a week)",
        ],
      },
      {
        question: "In the last month, how often have you felt overwhelmed by all you had to do?",
        options: [
          "Never (0 days a week)",
          "Almost Never (1 day a week)",
          "Sometimes (2 days a week)",
          "Fairly often (4 days a week)",
          "Very often (6 days a week)",
        ],
      },
      {
        question: "In the last month, how often have you felt that you were unable to control the important things in your life?",
        options: [
          "Never (0 days a week)",
          "Almost Never (1 day a week)",
          "Sometimes (2 days a week)",
          "Fairly often (4 days a week)",
          "Very often (6 days a week)",
        ],
      },
      {
        question: "In the last month, how often have you found that you were not able to control irritations in your life?",
        options: [
          "Never (0 days a week)",
          "Almost Never (1 day a week)",
          "Sometimes (2 days a week)",
          "Fairly often (4 days a week)",
          "Very often (6 days a week)",
        ],
      },
      {
        question: "In the last month, how often have you felt that you were on top of things?",
        options: [
          "Never (0 days a week)",
          "Almost Never (1 day a week)",
          "Sometimes (2 days a week)",
          "Fairly often (4 days a week)",
          "Very often (6 days a week)",
        ],
      },
      {
        question: "In the last month, how often have you felt that things were going too fast and you could not keep up?",
        options: [
          "Never (0 days a week)",
          "Almost Never (1 day a week)",
          "Sometimes (2 days a week)",
          "Fairly often (4 days a week)",
          "Very often (6 days a week)",
        ],
      },
      {
        question: "In the last month, how often have you felt that you were unable to cope with the demands of your life?",
        options: [
          "Never (0 days a week)",
          "Almost Never (1 day a week)",
          "Sometimes (2 days a week)",
          "Fairly often (4 days a week)",
          "Very often (6 days a week)",
        ],
      },
      {
        question: "In the last month, how often have you felt that you were under a lot of stress?",
        options: [
          "Never (0 days a week)",
          "Almost Never (1 day a week)",
          "Sometimes (2 days a week)",
          "Fairly often (4 days a week)",
          "Very often (6 days a week)",
        ],
      },
      {
        question: "In the last month, how often have you felt confident about your ability to handle your personal problems?",
        options: [
          "Never (0 days a week)",
          "Almost Never (1 day a week)",
          "Sometimes (2 days a week)",
          "Fairly often (4 days a week)",
          "Very often (6 days a week)",
        ],
      },
    ],
    Empty: [
      {
        question: "In the last 2 weeks, I have felt emotionally numb or detached.",
        options: [
          "Never (0 days a week)",
          "Almost Never (1 day a week)",
          "Sometimes (2 days a week)",
          "Fairly often (4 days a week)",
          "Very often (6 days a week)",
        ],
      },
      {
        question: "In the last 2 weeks, I no longer find pleasure or enjoyment in activities that once brought me happiness.",
        options: [
          "Never (0 days a week)",
          "Almost Never (1 day a week)",
          "Sometimes (2 days a week)",
          "Fairly often (4 days a week)",
          "Very often (6 days a week)",
        ],
      },
      {
        question: "In the last 2 weeks, I feel inadequate, worthless, or lacking in self-worth.",
        options: [
          "Never (0 days a week)",
          "Almost Never (1 day a week)",
          "Sometimes (2 days a week)",
          "Fairly often (4 days a week)",
          "Very often (6 days a week)",
        ],
      },
      {
        question: "In the last 2 weeks, I feel tired, run-down, or have a lack of energy.",
        options: [
          "Never (0 days a week)",
          "Almost Never (1 day a week)",
          "Sometimes (2 days a week)",
          "Fairly often (4 days a week)",
          "Very often (6 days a week)",
        ],
      },
      {
        question: "In the last 2 weeks, I have had trouble focusing or completing tasks.",
        options: [
          "Never (0 days a week)",
          "Almost Never (1 day a week)",
          "Sometimes (2 days a week)",
          "Fairly often (4 days a week)",
          "Very often (6 days a week)",
        ],
      },
      {
        question: "In the last 2 weeks, I have been indifferent to my personal appearance or hygiene.",
        options: [
          "Never (0 days a week)",
          "Almost Never (1 day a week)",
          "Sometimes (2 days a week)",
          "Fairly often (4 days a week)",
          "Very often (6 days a week)",
        ],
      },
      {
        question: "In the last 2 weeks, I have been reluctant to engage in social interactions.",
        options: [
          "Never (0 days a week)",
          "Almost Never (1 day a week)",
          "Sometimes (2 days a week)",
          "Fairly often (4 days a week)",
          "Very often (6 days a week)",
        ],
      },
      {
        question: "In the last 2 weeks, I have felt distant or detached from my own feelings.",
        options: [
          "Never (0 days a week)",
          "Almost Never (1 day a week)",
          "Sometimes (2 days a week)",
          "Fairly often (4 days a week)",
          "Very often (6 days a week)",
        ],
      },
      {
        question: "In the last 2 weeks, I have felt that life has lost its meaning.",
        options: [
          "Never (0 days a week)",
          "Almost Never (1 day a week)",
          "Sometimes (2 days a week)",
          "Fairly often (4 days a week)",
          "Very often (6 days a week)",
        ],
      },
      {
        question: "In the last 2 weeks, I have felt that I do not want to try new things or engage in new experiences.",
        options: [
          "Never (0 days a week)",
          "Almost Never (1 day a week)",
          "Sometimes (2 days a week)",
          "Fairly often (4 days a week)",
          "Very often (6 days a week)",
        ],
      },
    ],
    Sad: [
      {
        question: "In the last month, I have felt sad.",
        options: [
          "Never (0 days a week)",
          "Almost Never (1 day a week)",
          "Sometimes (2 days a week)",
          "Fairly often (4 days a week)",
          "Very often (6 days a week)",
        ],
      },
      {
        question: "In the last month, I have felt sad because I think of my past failures.",
        options: [
          "Never (0 days a week)",
          "Almost Never (1 day a week)",
          "Sometimes (2 days a week)",
          "Fairly often (4 days a week)",
          "Very often (6 days a week)",
        ],
      },
      {
        question: "In the last month, I have felt sad thinking about my future.",
        options: [
          "Never (0 days a week)",
          "Almost Never (1 day a week)",
          "Sometimes (2 days a week)",
          "Fairly often (4 days a week)",
          "Very often (6 days a week)",
        ],
      },
      {
        question: "In the last month, I have felt sad and lonely.",
        options: [
          "Never (0 days a week)",
          "Almost Never (1 day a week)",
          "Sometimes (2 days a week)",
          "Fairly often (4 days a week)",
          "Very often (6 days a week)",
        ],
      },
      {
        question: "In the last month, I have felt sad and did not want to see anyone.",
        options: [
          "Never (0 days a week)",
          "Almost Never (1 day a week)",
          "Sometimes (2 days a week)",
          "Fairly often (4 days a week)",
          "Very often (6 days a week)",
        ],
      },
      {
        question: "In the last month, I have felt sad and could not concentrate on anything.",
        options: [
          "Never (0 days a week)",
          "Almost Never (1 day a week)",
          "Sometimes (2 days a week)",
          "Fairly often (4 days a week)",
          "Very often (6 days a week)",
        ],
      },
      {
        question: "In the last month, I have felt sad and experienced mood swings.",
        options: [
          "Never (0 days a week)",
          "Almost Never (1 day a week)",
          "Sometimes (2 days a week)",
          "Fairly often (4 days a week)",
          "Very often (6 days a week)",
        ],
      },
      {
        question: "In the last month, I have felt so sad that I did not want to get out of bed.",
        options: [
          "Never (0 days a week)",
          "Almost Never (1 day a week)",
          "Sometimes (2 days a week)",
          "Fairly often (4 days a week)",
          "Very often (6 days a week)",
        ],
      },
      {
        question: "In the last month, I have felt sad and cried without reason.",
        options: [
          "Never (0 days a week)",
          "Almost Never (1 day a week)",
          "Sometimes (2 days a week)",
          "Fairly often (4 days a week)",
          "Very often (6 days a week)",
        ],
      },
      {
        question: "In the last month, I have felt sad and felt like giving up.",
        options: [
          "Never (0 days a week)",
          "Almost Never (1 day a week)",
          "Sometimes (2 days a week)",
          "Fairly often (4 days a week)",
          "Very often (6 days a week)",
        ],
      },
    ],
    Lonely: [
      {
        question: "In the last month, I have felt lonely.",
        options: [
          "Never (0 days a week)",
          "Almost Never (1 day a week)",
          "Sometimes (2 days a week)",
          "Fairly often (4 days a week)",
          "Very often (6 days a week)",
        ],
      },
      {
        question: "In the last month, I have felt like I had no one to talk to.",
        options: [
          "Never (0 days a week)",
          "Almost Never (1 day a week)",
          "Sometimes (2 days a week)",
          "Fairly often (4 days a week)",
          "Very often (6 days a week)",
        ],
      },
      {
        question: "In the last month, I have felt lonely and isolated.",
        options: [
          "Never (0 days a week)",
          "Almost Never (1 day a week)",
          "Sometimes (2 days a week)",
          "Fairly often (4 days a week)",
          "Very often (6 days a week)",
        ],
      },
      {
        question: "In the last month, I have felt that others do not understand me.",
        options: [
          "Never (0 days a week)",
          "Almost Never (1 day a week)",
          "Sometimes (2 days a week)",
          "Fairly often (4 days a week)",
          "Very often (6 days a week)",
        ],
      },
      {
        question: "In the last month, I have felt lonely even when I am with others.",
        options: [
          "Never (0 days a week)",
          "Almost Never (1 day a week)",
          "Sometimes (2 days a week)",
          "Fairly often (4 days a week)",
          "Very often (6 days a week)",
        ],
      },
      {
        question: "In the last month, I have felt rejected or excluded.",
        options: [
          "Never (0 days a week)",
          "Almost Never (1 day a week)",
          "Sometimes (2 days a week)",
          "Fairly often (4 days a week)",
          "Very often (6 days a week)",
        ],
      },
      {
        question: "In the last month, I have felt that my friends do not care about me.",
        options: [
          "Never (0 days a week)",
          "Almost Never (1 day a week)",
          "Sometimes (2 days a week)",
          "Fairly often (4 days a week)",
          "Very often (6 days a week)",
        ],
      },
      {
        question: "In the last month, I have felt sad about being alone.",
        options: [
          "Never (0 days a week)",
          "Almost Never (1 day a week)",
          "Sometimes (2 days a week)",
          "Fairly often (4 days a week)",
          "Very often (6 days a week)",
        ],
      },
      {
        question: "In the last month, I have felt that I am missing something in my life.",
        options: [
          "Never (0 days a week)",
          "Almost Never (1 day a week)",
          "Sometimes (2 days a week)",
          "Fairly often (4 days a week)",
          "Very often (6 days a week)",
        ],
      },
      {
        question: "In the last month, I have felt that I would like to have someone to share my feelings with.",
        options: [
          "Never (0 days a week)",
          "Almost Never (1 day a week)",
          "Sometimes (2 days a week)",
          "Fairly often (4 days a week)",
          "Very often (6 days a week)",
        ],
      },
    ],
  };

  const [selectedOptions, setSelectedOptions] = useState<{ [key: number]: string[] }>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // State to track the current question
  const questions = quizQuestions[mood] || [];
  const [score, setScore] = useState<number | null>(null);
  const navigation = useNavigation();
  

  const scoreMapping: { [key: string]: number } = {
    "Never (0 days a week)": 0,
    "Almost Never (1 day a week)": 1,
    "Sometimes (2 days a week)": 2,
    "Fairly often (4 days a week)": 4,
    "Very often (6 days a week)": 6,
  }; 
  const suggestions = [
    "Consider mindfulness exercises.",
    "Watch a YouTube video on positive thinking.",
    "Try a quick workout to boost your mood.",
    "Reach out to a friend or therapist."
  ];

  const handleCheckboxChange = (questionIndex: number, option: string) => {
    setSelectedOptions((prev) => {
      const currentOptions = prev[questionIndex] || [];
      if (currentOptions.includes(option)) {
        return {
          ...prev,
          [questionIndex]: currentOptions.filter((opt) => opt !== option),
        };
      } else {
        return {
          ...prev,
          [questionIndex]: [...currentOptions, option],
        };
      }
    });
  };
  const handleNext = () => {
    if (!(selectedOptions[currentQuestionIndex]?.length > 0)) {
      Alert.alert("Warning", "Please select at least one option before proceeding.");
      return;
    }
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      calculateAndStoreScore(); // Calculate and store the score when the last question is reached
    }
  };

  const calculateAndStoreScore = async () => {
    let totalScore = 0;

    Object.values(selectedOptions).forEach((selected) => {
      selected.forEach((option) => {
        totalScore += scoreMapping[option] || 0;
      });
    });


    // Normalize total score to a scale of 10
    const maxScore = questions.length * 6; // Assuming the highest score for each question is 6
    const normalizedScore = (totalScore / maxScore) * 10; // Normalize to a score out of 10

    setScore(normalizedScore);

    // Navigate to AssessmentSummary screen
    const user = auth().currentUser;
    if (user) {
      try {
        await firestore().collection('MoodAssessments').add({
          userId: user.uid,
          mood: mood,
          score: normalizedScore,
          timestamp: firestore.FieldValue.serverTimestamp(),
        });
        navigation.navigate('AssessmentSummary', {
          score: normalizedScore,
          mood: mood,
          suggestions: ["Practice mindfulness", "Take a short break", "Connect with friends or family"],
        });
      } catch (error) {
        console.error('Error storing assessment score:', error);
        Alert.alert('Error', 'Failed to save your assessment. Please try again.');
      }
    }
  };


  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/watermark.jpg')} // Replace with actual watermark icon
        style={styles.watermark}
      />
      <Text style={styles.title}>{mood.charAt(0).toUpperCase() + mood.slice(1)} Questions</Text>
      <ScrollView>
        {questions.length > 0 && (
          <View style={styles.container}>
            <Text style={styles.questionText}>{questions[currentQuestionIndex].question}</Text>
            {questions[currentQuestionIndex].options.map((option: string, optionIndex: number) => (
              <View key={optionIndex} style={styles.checkboxContainer}>
                <CheckBox
                  value={selectedOptions[currentQuestionIndex]?.includes(option)}
                  onValueChange={() => handleCheckboxChange(currentQuestionIndex, option)}
                />
                <Text style={styles.checkboxLabel}>{option}</Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
      <Button
        title={currentQuestionIndex === questions.length - 1 ? "Submit" : "Next"}
        // onPress={currentQuestionIndex === questions.length - 1 ? calculateScore : handleNext}
        onPress={handleNext}
      />
      {score !== null && (
        <Text>Your score for {mood.charAt(0).toUpperCase() + mood.slice(1)} is: {score} out of {questions.length * 6}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F0F4F8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  watermark: {
    position: 'absolute',
    top: '20%',
    width: '100%',
    height: '100%',
    opacity: 0.08,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#2D3748',
    textAlign: 'center',
    marginBottom: 20,
  },
  questionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    width: '90%',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    alignItems: 'center',
  },
  questionText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    width: '100%',
  },
  checkboxLabel: {
    fontSize: 16,
    color: '#4A5568',
    marginLeft: 8,
  },
});

export default MoodQuestionsScreen;