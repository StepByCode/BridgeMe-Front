import React, { useState, useEffect } from 'react';
import { FontAwesome, FontAwesome6 } from '@expo/vector-icons';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import { API_ENDPOINTS } from '../config/api';

interface Profile {
  id?: string;
  name: string;
  affiliation: string;
  bio: string;
  instagram_id?: string;
  twitter_id?: string;
  created_at?: string;
}

interface ProfileListProps {
  onProfileSelect?: (profile: Profile) => void;
}

export default function ProfileList({ onProfileSelect }: ProfileListProps) {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchProfiles = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_ENDPOINTS.PROFILES);
      if (!response.ok) {
        throw new Error('プロフィールの取得に失敗しました');
      }
      const data = await response.json();
      console.log('profiles API response:', data);
      setProfiles(Array.isArray(data) ? data : []);
    } catch (error) {
      Alert.alert(
        'エラー',
        error instanceof Error ? error.message : 'プロフィールの取得に失敗しました',
        [{ text: 'OK' }]
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchProfiles();
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  const renderProfileItem = ({ item }: { item: Profile }) => (
    <TouchableOpacity
      style={styles.profileCard}
      onPress={() => {
        console.log('Profile selected:', item);
        onProfileSelect?.(item);
      }}
    >
      <Text style={styles.profileName}>{item.name}</Text>
      <Text style={styles.profileAffiliation}>{item.affiliation}</Text>
      <Text style={styles.profileBio} numberOfLines={2}>
        {item.bio}
      </Text>
      <View style={styles.socialContainer}>
        {item.instagram_id && (
          <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 12 }}>
            <FontAwesome name="instagram" size={16} color="#E4405F" style={{ marginRight: 4 }} />
            <Text style={styles.socialText}>@{item.instagram_id}</Text>
          </View>
        )}
        {item.twitter_id && (
          <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 12 }}>
            <FontAwesome6 name="x-twitter" size={16} color="#000" style={{ marginRight: 4 }} />
            <Text style={styles.socialText}>@{item.twitter_id}</Text>
          </View>
        )}
      </View>
      {item.created_at && (
        <Text style={styles.dateText}>
          {new Date(item.created_at).toLocaleDateString('ja-JP')}
        </Text>
      )}
    </TouchableOpacity>
  );

  if (loading && profiles.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>プロフィールを読み込み中...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>プロフィール一覧</Text>
      
      {profiles.length === 0 ? (
        <View style={styles.centerContainer}>
          <Text style={styles.emptyText}>プロフィールがありません</Text>
          <TouchableOpacity style={styles.refreshButton} onPress={fetchProfiles}>
            <Text style={styles.refreshButtonText}>更新</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={profiles}
          keyExtractor={(item, index) => item.id || `profile-${index}-${item.name}`}
          renderItem={renderProfileItem}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    color: '#333',
  },
  listContainer: {
    padding: 16,
  },
  profileCard: {
    backgroundColor: 'white',
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  profileAffiliation: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  profileBio: {
    fontSize: 14,
    color: '#444',
    lineHeight: 20,
    marginBottom: 12,
  },
  socialContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  socialText: {
    fontSize: 12,
    color: '#007AFF',
    marginRight: 12,
  },
  dateText: {
    fontSize: 12,
    color: '#999',
    textAlign: 'right',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  refreshButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  refreshButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});