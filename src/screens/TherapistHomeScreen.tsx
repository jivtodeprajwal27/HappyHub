import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AppointmentsScreen from './AppointmentsScreen'; // Ensure these paths are correct
import TherapistProfileScreen from './TherapistProfileScreen';
import { View, Text } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons'; // Icons for Tab Navigation

const Tab = createBottomTabNavigator();

const TherapistHomeScreen = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'Appointments') {
            iconName = 'calendar-outline';
          } else if (route.name === 'Profile') {
            iconName = 'person-outline';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
      tabBarOptions={{
        activeTintColor: '#4299E1',
        inactiveTintColor: 'gray',
      }}
    >
      <Tab.Screen name="Appointments" component={AppointmentsScreen} />
      <Tab.Screen name="Profile" component={TherapistProfileScreen} />
    </Tab.Navigator>
  );
};

export default TherapistHomeScreen;
