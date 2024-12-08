import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Button, TextInput, Modal, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface Community {
  id: string;
  name: string;
  description: string;
  creatorId: string;
  members: string[];
}

export default function CommunityListScreen({ navigation }) {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [newCommunityName, setNewCommunityName] = useState('');
  const [newCommunityDescription, setNewCommunityDescription] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const unsubscribe = firestore().collection('Communities').onSnapshot(snapshot => {
      const communityData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Community[];
      setCommunities(communityData);
    });
    return () => unsubscribe();
  }, []);

  const handleCreateCommunity = async () => {
    const user = auth().currentUser;
    if (!user || !newCommunityName.trim() || !newCommunityDescription.trim()) {
      Alert.alert('Error', 'Please provide a community name and description.');
      return;
    }

    await firestore().collection('Communities').add({
      name: newCommunityName,
      description: newCommunityDescription,
      creatorId: user.uid,
      members: [user.uid],
    });
    setNewCommunityName('');
    setNewCommunityDescription('');
    setModalVisible(false);
  };

  const joinCommunity = async (communityId: string) => {
    const user = auth().currentUser;
    if (!user) {
      Alert.alert('Error', 'You need to be logged in to join a community.');
      return;
    }

    try {
      await firestore().collection('Communities').doc(communityId).update({
        members: firestore.FieldValue.arrayUnion(user.uid),
      });
      Alert.alert('Success', 'You have successfully joined the community!');
    } catch (error) {
      console.error('Error joining community:', error);
      Alert.alert('Error', 'Unable to join the community. Please try again later.');
    }
  };

  const viewCommunityPosts = (communityId: string, members: string[]) => {
    const user = auth().currentUser;
    if (!user) {
      Alert.alert('Error', 'You need to be logged in to view posts.');
      return;
    }

    if (!members.includes(user.uid)) {
      Alert.alert(
        'Join Community',
        'You need to join this community to view posts. Do you want to join?',
        [
          { text: 'Cancel' },
          { text: 'Join', onPress: () => joinCommunity(communityId) },
        ]
      );
    } else {
      navigation.navigate('CommunityPosts', { communityId });
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Create New Community" onPress={() => setModalVisible(true)} />
      <FlatList
        data={communities}
        renderItem={({ item }) => (
          <View style={styles.communityCard}>
            <Text style={styles.communityName}>{item.name}</Text>
            <Text style={styles.communityDescription}>{item.description}</Text>
            <Text style={styles.memberCount}>Members: {item.members.length}</Text>

            <View style={styles.buttonContainer}>
              {!item.members.includes(auth().currentUser?.uid || '') && (
                <Button title="Join Community" onPress={() => joinCommunity(item.id)} />
              )}
              <Button title="View Community Posts" onPress={() => viewCommunityPosts(item.id, item.members)} />

              {/* Show Add Post button only for members */}
              {item.members.includes(auth().currentUser?.uid || '') && (
                <TouchableOpacity
                  style={styles.addPostButton}
                  onPress={() => navigation.navigate('AddCommunityPost', { communityId: item.id })}
                >
                  <Ionicons name="add-circle-outline" size={24} color="#4299E1" />
                  <Text style={styles.addPostText}>Add Post</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}
        keyExtractor={item => item.id}
      />

      {/* Create Community Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Create a Community</Text>
          <TextInput
            placeholder="Community Name"
            value={newCommunityName}
            onChangeText={setNewCommunityName}
            style={styles.input}
          />
          <TextInput
            placeholder="Description"
            value={newCommunityDescription}
            onChangeText={setNewCommunityDescription}
            style={styles.input}
          />
          <Button title="Create" onPress={handleCreateCommunity} />
          <Button title="Cancel" onPress={() => setModalVisible(false)} />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f7f7f7' },
  communityCard: { padding: 16, backgroundColor: '#FFF', borderRadius: 8, marginVertical: 8 },
  communityName: { fontSize: 18, fontWeight: 'bold' },
  communityDescription: { fontSize: 14, color: '#666' },
  memberCount: { fontSize: 12, color: '#888', marginTop: 4 },
  buttonContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 },
  addPostButton: { flexDirection: 'row', alignItems: 'center' },
  addPostText: { marginLeft: 4, color: '#4299E1', fontSize: 14 },
  modalContainer: { flex: 1, justifyContent: 'center', padding: 16, backgroundColor: 'rgba(0, 0, 0, 0.5)' },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 16, color: '#FFF' },
  input: { padding: 8, backgroundColor: '#FFF', borderRadius: 8, marginBottom: 8 },
});
