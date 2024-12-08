// App.tsx
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './src/screens/LoginScreen';
import SignUpScreen from './src/screens/SignUpScreen';
import StudentHomeScreen from './src/screens/StudentHomeScreen';
import MoodAssessment from './src/screens/MoodAssessment';
import JournalEntry from './src/screens/JournalEntry';
import RelaxationExercises from './src/screens/RelaxationExercises';
import TherapistBooking from './src/screens/TherapistBooking';
import ProfileScreen from './src/screens/ProfileScreen';
import Appointments from './src/screens/Appointments';
import MoodTrackerScreen from './src/screens/MoodTrackerScreen';
import MoodQuestionsScreen from './src/screens/MoodQuestionsScreen';
import AssessmentSummary from './src/screens/AssessmentSummary';
import EntriesScreen from './src/screens/EntriesScreen';
import TherapistHomeScreen from './src/screens/TherapistHomeScreen';
import TherapistProfile from './src/screens/TherapistProfile';
import AppointmentsScreen from './src/screens/AppointmentsScreen';
import ChatScreen from './src/screens/ChatScreen';
import CommunityListScreen from './src/screens/CommunityListScreen';
import CommunityPostsScreen from './src/screens/CommunityPostsScreen';
const Stack = createStackNavigator();

const App = () => {

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="StudentHomeScreen" component={StudentHomeScreen} />
        <Stack.Screen name="TherapistHomeScreen" component={TherapistHomeScreen} />
        <Stack.Screen name="MoodAssessment" component={MoodAssessment} />
        <Stack.Screen name="JournalEntry" component={JournalEntry} />
        <Stack.Screen name="RelaxationExercises" component={RelaxationExercises} />
        <Stack.Screen name="TherapistBooking" component={TherapistBooking} />
        <Stack.Screen name="TherapistProfile" component={TherapistProfile} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="Appointments" component={Appointments} />
        <Stack.Screen name="AppointmentsScreen" component={AppointmentsScreen} />
        <Stack.Screen name="MoodTracker" component={MoodTrackerScreen} />
        <Stack.Screen name="MoodQuestionsScreen" component={MoodQuestionsScreen} />
        <Stack.Screen name="AssessmentSummary" component={AssessmentSummary} />
        <Stack.Screen name="Entries" component={EntriesScreen} />
        <Stack.Screen name="ChatScreen" component={ChatScreen} />
        <Stack.Screen name="Community" component={CommunityListScreen} />
        <Stack.Screen name="PostDetails" component={CommunityPostsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
