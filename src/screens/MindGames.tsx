import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { Card, Button, Avatar } from 'react-native-paper';
import { Brain } from 'lucide-react'
import axios from 'axios'

interface Game {
  id: string
  name: string
  description: string
  difficulty: string
  category: string
}

export default function MindGames() {
  const [games, setGames] = useState<Game[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const navigation = useNavigation()

  useEffect(() => {
    fetchGames()
  }, [])

  const fetchGames = async () => {
    try {
      setLoading(true)
      // Replace 'YOUR_API_ENDPOINT' with the actual API endpoint
      const response = await axios.get('YOUR_API_ENDPOINT/games')
      setGames(response.data)
      setLoading(false)
    } catch (err) {
      setError('Failed to fetch games. Please try again later.')
      setLoading(false)
    }
  }

  const renderGameItem = ({ item }: { item: Game }) => (
    <Card style={styles.gameCard}>
      <Text style={styles.gameName}>{item.name}</Text>
      <Text style={styles.gameDescription}>{item.description}</Text>
      <View style={styles.gameMetadata}>
        <Text style={styles.gameDifficulty}>Difficulty: {item.difficulty}</Text>
        <Text style={styles.gameCategory}>Category: {item.category}</Text>
      </View>
      {/* <Button onPress={() => navigation.navigate('GamePlay', { gameId: item.id })}>
        Play Now
      </Button> */}
    </Card>
  )

  if (loading) {
    return (
      <View style={styles.centered}>
        <Text>Loading games...</Text>
      </View>
    )
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
        <Button onPress={fetchGames}>Retry</Button>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mind Games</Text>
      <FlatList
        data={games}
        renderItem={renderGameItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.gameList}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F7FAFC',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#2D3748',
  },
  gameList: {
    paddingBottom: 16,
  },
  gameCard: {
    marginBottom: 16,
    padding: 16,
  },
  gameName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#2D3748',
  },
  gameDescription: {
    fontSize: 14,
    marginBottom: 8,
    color: '#4A5568',
  },
  gameMetadata: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  gameDifficulty: {
    fontSize: 12,
    color: '#718096',
  },
  gameCategory: {
    fontSize: 12,
    color: '#718096',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#E53E3E',
    marginBottom: 16,
  },
})