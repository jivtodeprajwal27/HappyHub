import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { Card, Button, TextInput } from 'react-native-paper'; // Updated with TextInput from react-native-paper
import { Svg, Path } from 'react-native-svg';
import { GoogleSignin } from '@react-native-google-signin/google-signin'; // For Google Sign-In

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Initialize Google SignIn
  GoogleSignin.configure({
    webClientId: '772247878289-8aaoiussn2tsipihfbj4o03d7cvu9bgf.apps.googleusercontent.com', // Get this from Firebase console
    scopes: ['email'],
    offlineAccess: true,
  });

  const handleLogin = async () => {
    try {
      const userCredential = await auth().signInWithEmailAndPassword(email, password);
      const user = userCredential.user;

      // Check both 'Users' and 'Therapists' collections
      const userDoc = await firestore().collection('Users').doc(user.uid).get();
      const therapistDoc = await firestore().collection('Therapists').doc(user.uid).get();

      if (userDoc.exists) {
        const { userType } = userDoc.data();
        navigation.navigate(userType === 'Therapist' ? 'TherapistHomeScreen' : 'StudentHomeScreen');
      } else if (therapistDoc.exists) {
        navigation.navigate('TherapistHomeScreen');
      } else {
        setError('User not found');
      }
    } catch (e) {
      setError(e.message || 'An unexpected error occurred');
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      Alert.alert('Please enter your email address');
      return;
    }
    try {
      await auth().sendPasswordResetEmail(email);
      Alert.alert('Success', 'Password reset email sent');
    } catch (error) {
      Alert.alert('Error', 'Unable to send password reset email');
    }
  };

  const handleGoogleLogin = async () => {
    try {
      // First, sign in with Google
      const userInfo = await GoogleSignin.signIn();
  
      // Now get the ID token for Firebase authentication
      const { idToken } = await GoogleSignin.getTokens(); // Use getTokens() to retrieve idToken
  
      if (!idToken) {
        throw new Error('Google Sign-In failed. Please try again.');
      }
  
      // Create a Google credential with the token
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
  
      // Sign in the user with the credential
      await auth().signInWithCredential(googleCredential);
  
      // After successful login, navigate to home screen
      navigation.navigate('StudentHomeScreen');
    } catch (error) {
      console.error('Google Sign-In Error:', error);
      setError(error instanceof Error ? error.message : 'An unknown error occurred.');
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <Card style={styles.card}>
        {/* Application Icon */}
        <Svg height="60" width="60" viewBox="0 0 24 24" fill="none" stroke="#FF5722" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <Path d="M12 2l9 5-9 5-9-5z" />
          <Path d="M12 12l9 5-9 5-9-5z" />
        </Svg>

        <Text style={styles.title}>Happy Hub</Text>
        {error ? <Text style={styles.error}>{error}</Text> : null}
        
        <View style={styles.inputContainer}>
          <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#4A5568" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <Path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
            <Path d="M22 6l-10 7L2 6" />
          </Svg>
          <TextInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
          />
        </View>

        <View style={styles.inputContainer}>
          <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#4A5568" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <Path d="M19 11H5a2 2 0 00-2 2v7a2 2 0 002 2h14a2 2 0 002-2v-7a2 2 0 00-2-2z" />
            <Path d="M7 11V7a5 5 0 0110 0v4" />
          </Svg>
          <TextInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.input}
          />
        </View>

        <TouchableOpacity onPress={handleForgotPassword}>
          <Text style={styles.forgotPassword}>Forgot Password?</Text>
        </TouchableOpacity>

        <Button onPress={handleLogin} style={styles.button}>
          Login
        </Button>

        {/* Google Login Button */}
        <Button icon="google" onPress={handleGoogleLogin} style={styles.googleButton}>
          Continue with Google
        </Button>

        <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
          <Text style={styles.link}>Don't have an account? Sign up</Text>
        </TouchableOpacity>
      </Card>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#FDE68A', // Bright pastel background
  },
  card: {
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 10,
    backgroundColor: '#FFFDE7',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
    color: '#FF7043',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  input: {
    flex: 1,
    marginLeft: 10,
  },
  button: {
    marginTop: 8,
    backgroundColor: '#FF7043',
  },
  googleButton: {
    marginTop: 8,
    backgroundColor: '#FF5722',
  },
  forgotPassword: {
    color: '#FF7043',
    textAlign: 'right',
    marginBottom: 16,
  },
  error: {
    color: '#E53E3E',
    marginBottom: 16,
    textAlign: 'center',
  },
  link: {
    color: '#4299E1',
    marginTop: 16,
    textAlign: 'center',
  },
});

export default LoginScreen;
