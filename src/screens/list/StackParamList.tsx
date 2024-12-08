import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';

// Define the available screens and their params
export type RootStackParamList = {
  StudentHomeScreen: undefined;
  TherapistHomeScreen: undefined;
  MoodAssessment: undefined;
  JournalEntry: undefined;
  RelaxationExercises: undefined;
  TherapistBooking: undefined;
  Profile: undefined;
  Appointments: undefined;
  MoodTracker: undefined;
  MoodQuestionsScreen: { 
    mood: string; 
  };
  AssessmentSummary: { 
    score: number; 
    mood: string; 
    suggestions: string[]; 
  };
  BookingConfirmation: {
    therapist: {
      name: string;
      specialization: string;
    };
    date: string;
  };
};

// Ensure `RootStackParamList` satisfies `ParamListBase` by adding an index signature
export interface StackParamList extends RootStackParamList {
  [key: string]: undefined | object; // Add index signature
}

// Props for navigation
export type StudentHomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'StudentHomeScreen'>;
export type StudentHomeScreenRouteProp = RouteProp<RootStackParamList, 'StudentHomeScreen'>;
