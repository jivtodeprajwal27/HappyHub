import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { Card, Button, TextInput } from 'react-native-paper';

const SignUpScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [age, setAge] = useState('');
  const [phone, setPhone] = useState('');
  const [userType, setUserType] = useState('Student'); // Default user type
  const [specialization, setSpecialization] = useState(''); // For therapists
  const [error, setError] = useState('');

  const handleSignUp = async () => {
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const userCredential = await auth().createUserWithEmailAndPassword(email, password);
      const userId = userCredential.user.uid;

      // Store user data in Firestore
      if (userType === 'Therapist') {
        await firestore().collection('Therapists').doc(userId).set({
          email,
          username,
          specialization, // Add specialization for therapists
          userType: 'Therapist',
          createdAt: firestore.FieldValue.serverTimestamp(),
        });
      } else {
        await firestore().collection('Users').doc(userId).set({
          email,
          username,
          age,
          phone,
          userType: 'Student',
          createdAt: firestore.FieldValue.serverTimestamp(),
        });
      }

      navigation.navigate('Login');
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An unexpected error occurred.');
      }
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <Card style={styles.card}>
        <Text style={styles.title}>Create Account</Text>
        {error ? <Text style={styles.error}>{error}</Text> : null}

        <TextInput
          label="Username"
          value={username}
          onChangeText={setUsername}
          style={styles.input}
        />
        <TextInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          style={styles.input}
        />
        <TextInput
          label="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
        />
        <TextInput
          label="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          style={styles.input}
        />
        
        {/* User Type Selector */}
        <Text style={styles.userTypeLabel}>User Type:</Text>
        <View style={styles.userTypeContainer}>
          <TouchableOpacity onPress={() => setUserType('Student')} style={styles.userTypeButton}>
            <Text style={userType === 'Student' ? styles.selected : styles.unselected}>Student</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setUserType('Therapist')} style={styles.userTypeButton}>
            <Text style={userType === 'Therapist' ? styles.selected : styles.unselected}>Therapist</Text>
          </TouchableOpacity>
        </View>

        {/* Specialization input for therapists */}
        {userType === 'Therapist' && (
          <TextInput
            label="Specialization"
            value={specialization}
            onChangeText={setSpecialization}
            style={styles.input}
          />
        )}

        <Button onPress={handleSignUp} style={styles.button}>
          Sign Up
        </Button>

        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.link}>Already have an account? Log in</Text>
        </TouchableOpacity>
      </Card>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', backgroundColor: '#F0F4F8' },
  card: { marginHorizontal: 20, padding: 20, borderRadius: 10, backgroundColor: '#FFFFFF', elevation: 5 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 24, textAlign: 'center', color: '#2D3748' },
  input: { marginBottom: 16 },
  button: { marginTop: 8, backgroundColor: '#FF7043' },
  error: { color: '#E53E3E', marginBottom: 16, textAlign: 'center' },
  link: { color: '#4299E1', marginTop: 16, textAlign: 'center' },
  selected: { fontWeight: 'bold', color: '#2D3748' },
  unselected: { color: '#718096' },
  userTypeLabel: { fontSize: 16, fontWeight: 'bold', marginTop: 10 },
  userTypeContainer: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 16 },
  userTypeButton: { padding: 10 },
});

export default SignUpScreen;
