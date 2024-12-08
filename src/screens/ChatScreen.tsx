import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TextInput, Button, StyleSheet } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: Date;
}

export default function ChatScreen({ route }) {
  const { appointmentId, therapistName, studentName } = route.params; // Both therapist and student can access
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    const messagesRef = firestore()
      .collection('ChatRooms')
      .doc(appointmentId)
      .collection('Messages')
      .orderBy('timestamp', 'asc');

    const unsubscribe = messagesRef.onSnapshot(snapshot => {
      const fetchedMessages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Message[];
      setMessages(fetchedMessages);
    });

    return () => unsubscribe();
  }, [appointmentId]);

  const handleSendMessage = async () => {
    const user = auth().currentUser;
    if (user && newMessage.trim()) {
      await firestore()
        .collection('ChatRooms')
        .doc(appointmentId)
        .set(
          {
            studentName,
            therapistName,
            appointmentId,  // Basic metadata to identify the chat session
          },
          { merge: true }
        ); 

      await firestore()
        .collection('ChatRooms')
        .doc(appointmentId)
        .collection('Messages')
        .add({
          senderId: user.uid,
          text: newMessage.trim(),
          timestamp: firestore.FieldValue.serverTimestamp(),
        });
      setNewMessage('');
    }
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isOwnMessage = item.senderId === auth().currentUser?.uid;
    return (
      <View style={[styles.messageContainer, isOwnMessage ? styles.myMessage : styles.theirMessage]}>
        <Text style={styles.messageText}>{item.text}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Chat with {therapistName || studentName}</Text>
      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messageList}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type your message..."
          value={newMessage}
          onChangeText={setNewMessage}
        />
        <Button title="Send" onPress={handleSendMessage} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 8,
    backgroundColor: '#F7FAFC',
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
  },
  messageList: {
    flexGrow: 1,
    padding: 8,
  },
  messageContainer: {
    padding: 10,
    borderRadius: 8,
    marginVertical: 4,
  },
  myMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#DCF8C6',
  },
  theirMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#E1E1E1',
  },
  messageText: {
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderTopWidth: 1,
    borderColor: '#DDD',
  },
  input: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#FFF',
    marginRight: 8,
  },
});
