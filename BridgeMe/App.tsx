import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView } from 'react-native';
import { useState } from 'react';
import ProfileList from './components/ProfileList';
import ProfileDetail from './components/ProfileDetail';
import ProfileCreateForm from './components/ProfileCreateForm';

interface Profile {
  id?: string;
  name: string;
  affiliation: string;
  bio: string;
  instagram_id?: string;
  twitter_id?: string;
  created_at?: string;
}

export default function App() {
  const [showProfiles, setShowProfiles] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const handleProfileSelect = (profile: Profile) => {
    console.log('App: Profile selected for detail view:', profile);
    setSelectedProfile(profile);
    setShowDetail(true);
  };

  const handleCloseDetail = () => {
    setShowDetail(false);
    setSelectedProfile(null);
  };

  const handleCreateSuccess = () => {
    // プロフィール作成成功時にリストを更新するため、一度ホームに戻る
    setShowProfiles(false);
  };

  if (showProfiles) {
    return (
      <SafeAreaView style={styles.fullScreen}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => setShowProfiles(false)}
          >
            <Text style={styles.backButtonText}>← 戻る</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.addButton} 
            onPress={() => setShowCreateForm(true)}
          >
            <Text style={styles.addButtonText}>+ 新規作成</Text>
          </TouchableOpacity>
        </View>
        <ProfileList onProfileSelect={handleProfileSelect} />
        <ProfileDetail 
          profile={selectedProfile}
          visible={showDetail}
          onClose={handleCloseDetail}
        />
        <ProfileCreateForm 
          visible={showCreateForm}
          onClose={() => setShowCreateForm(false)}
          onSuccess={handleCreateSuccess}
        />
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bridge Me</Text>
      <StatusBar style="auto" />
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.button} 
          onPress={() => setShowProfiles(true)}
        >
          <Text style={styles.buttonText}>プロフィール一覧を見る</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.button, styles.createButton]} 
          onPress={() => setShowCreateForm(true)}
        >
          <Text style={styles.buttonText}>新しいプロフィールを作成</Text>
        </TouchableOpacity>
      </View>

      <ProfileCreateForm 
        visible={showCreateForm}
        onClose={() => setShowCreateForm(false)}
        onSuccess={handleCreateSuccess}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullScreen: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    paddingVertical: 8,
  },
  backButtonText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#34c759',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  addButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 40,
  },
  buttonContainer: {
    gap: 16,
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    minWidth: 250,
    alignItems: 'center',
  },
  createButton: {
    backgroundColor: '#34c759',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
