import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Modal, TextInput, Button } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface Post {
  id: string;
  userId: string;
  content: string;
  timestamp: Date;
  likes: number;
  comments: string[];
}

export default function CommunityPostsScreen({ route }) {
  const { communityId } = route.params;
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newPostContent, setNewPostContent] = useState('');
  const userId = auth().currentUser?.uid;

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('Communities')
      .doc(communityId)
      .collection('Posts')
      .orderBy('timestamp', 'desc')
      .onSnapshot(snapshot => {
        const postData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as Post[];
        setPosts(postData);
        setLoading(false);
      });
    return () => unsubscribe();
  }, [communityId]);

  const handleAddPost = async () => {
    if (!userId || !newPostContent.trim()) {
      alert('Post content cannot be empty.');
      return;
    }
    try {
      await firestore()
        .collection('Communities')
        .doc(communityId)
        .collection('Posts')
        .add({
          userId,
          content: newPostContent,
          timestamp: firestore.FieldValue.serverTimestamp(),
          likes: 0,
          comments: [],
        });
      setNewPostContent('');
      setShowModal(false);
    } catch (error) {
      console.error('Error adding post:', error);
      alert('Failed to add post. Please try again later.');
    }
  };

  const renderPostItem = ({ item }: { item: Post }) => (
    <View style={styles.postCard}>
      <Text style={styles.postContent}>{item.content}</Text>
      <Text style={styles.postAuthor}>Posted by {item.userId}</Text>
      <View style={styles.postActions}>
        <TouchableOpacity onPress={() => handleLikePost(item.id)}>
          <Ionicons name="heart-outline" size={20} color="#E53E3E" />
          <Text style={styles.likeCount}>{item.likes}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Comments', { postId: item.id, communityId })}>
          <Ionicons name="chatbubble-outline" size={20} color="#4299E1" />
          <Text style={styles.commentCount}>{item.comments.length}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return <Text>Loading posts...</Text>;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={posts}
        renderItem={renderPostItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.contentContainer}
      />
      <TouchableOpacity style={styles.addButton} onPress={() => setShowModal(true)}>
        <Ionicons name="add-circle-outline" size={50} color="#4CAF50" />
      </TouchableOpacity>

      {/* Modal for Adding Post */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showModal}
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Add Post</Text>
            <TextInput
              placeholder="What's on your mind?"
              value={newPostContent}
              onChangeText={setNewPostContent}
              style={styles.input}
              multiline
            />
            <View style={styles.modalButtons}>
              <Button title="Submit" onPress={handleAddPost} />
              <Button title="Cancel" color="red" onPress={() => setShowModal(false)} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7FAFC' },
  contentContainer: { padding: 16 },
  postCard: { padding: 16, backgroundColor: '#FFF', borderRadius: 8, marginBottom: 16 },
  postContent: { fontSize: 16, color: '#333', marginBottom: 8 },
  postAuthor: { fontSize: 12, color: '#666', marginBottom: 8 },
  postActions: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  likeCount: { marginLeft: 4, color: '#E53E3E' },
  commentCount: { marginLeft: 4, color: '#4299E1' },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: 'transparent',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '80%',
    padding: 20,
    backgroundColor: '#FFF',
    borderRadius: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  input: {
    height: 100,
    borderColor: '#E2E8F0',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 16,
    backgroundColor: '#FFF',
    textAlignVertical: 'top',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});
