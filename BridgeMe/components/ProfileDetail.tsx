import React, { useEffect } from 'react';
import { Linking } from 'react-native';
import { FontAwesome, FontAwesome6 } from '@expo/vector-icons';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
} from 'react-native';

interface Profile {
  id?: string;
  name: string;
  affiliation: string;
  bio: string;
  instagram_id?: string;
  twitter_id?: string;
  created_at?: string;
}

interface ProfileDetailProps {
  profile?: Profile | null;
  visible: boolean;
  onClose: () => void;
}

export default function ProfileDetail({ profile: profileProp, visible, onClose }: ProfileDetailProps) {


  useEffect(() => {
    if (profileProp && visible) {
      console.log('ProfileDetail: displaying profile:', profileProp);
    }
  }, [profileProp, visible]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>プロフィール詳細</Text>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        </View>

        {profileProp ? (
          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            <View style={styles.profileHeader}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>👤</Text>
              </View>
              <Text style={styles.profileName}>{profileProp.name}</Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>基本情報</Text>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>所属</Text>
                <Text style={styles.infoValue}>{profileProp.affiliation}</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>一言</Text>
                <Text style={styles.infoValue}>{profileProp.bio}</Text>
              </View>
            </View>

            {(profileProp.instagram_id || profileProp.twitter_id) && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>ソーシャルメディア</Text>
                {profileProp.instagram_id && (
                  <View style={styles.socialItem}>
                    <View style={{ marginRight: 8 }}><FontAwesome name="instagram" size={20} color="#E4405F" /></View>
                    <TouchableOpacity
                      onPress={() => Linking.openURL(`https://instagram.com/${profileProp.instagram_id}`)}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.socialText}>@{profileProp.instagram_id}</Text>
                    </TouchableOpacity>
                  </View>
                )}
                {profileProp.twitter_id && (
                  <View style={styles.socialItem}>
                    <View style={{ marginRight: 8 }}><FontAwesome6 name="x-twitter" size={20} color="#000" /></View>
                    <TouchableOpacity
                      onPress={() => Linking.openURL(`https://x.com/${profileProp.twitter_id}`)}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.socialText}>@{profileProp.twitter_id}</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            )}

            {profileProp.created_at && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>作成日時</Text>
                <Text style={styles.dateText}>{formatDate(profileProp.created_at)}</Text>
              </View>
            )}
          </ScrollView>
        ) : (
          <View style={styles.centerContainer}>
            <Text style={styles.errorText}>プロフィールデータがありません</Text>
          </View>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    color: '#666',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 30,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 32,
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  section: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  infoItem: {
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
  socialItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  socialIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  socialText: {
    fontSize: 16,
    color: '#007AFF',
  },
  dateText: {
    fontSize: 16,
    color: '#333',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});