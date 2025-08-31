import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  Modal,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { API_ENDPOINTS } from '../config/api';

interface ProfileInput {
  name: string;
  affiliation: string;
  bio: string;
  instagram_id: string;
  twitter_id: string;
}

interface ProfileCreateFormProps {
  visible: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function ProfileCreateForm({ visible, onClose, onSuccess }: ProfileCreateFormProps) {
  const [formData, setFormData] = useState<ProfileInput>({
    name: '',
    affiliation: '',
    bio: '',
    instagram_id: '',
    twitter_id: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<ProfileInput>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<ProfileInput> = {};

    if (!formData.name.trim()) {
      newErrors.name = '名前は必須です';
    }

    if (!formData.affiliation.trim()) {
      newErrors.affiliation = '所属は必須です';
    }

    if (!formData.bio.trim()) {
      newErrors.bio = '一言は必須です';
    }

    if (formData.bio.length > 200) {
      newErrors.bio = '一言は200文字以内で入力してください';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      
      // 空文字のSNS IDは除去
      const submitData = { ...formData };
      if (!submitData.instagram_id.trim()) {
        delete (submitData as any).instagram_id;
      }
      if (!submitData.twitter_id.trim()) {
        delete (submitData as any).twitter_id;
      }

      const response = await fetch(API_ENDPOINTS.PROFILES, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      });

      if (!response.ok) {
        throw new Error('プロフィールの作成に失敗しました');
      }

      await response.json();
      
      Alert.alert(
        '成功',
        'プロフィールが作成されました！',
        [
          {
            text: 'OK',
            onPress: () => {
              resetForm();
              onSuccess?.();
              onClose();
            },
          },
        ]
      );
    } catch (error) {
      Alert.alert(
        'エラー',
        error instanceof Error ? error.message : 'プロフィールの作成に失敗しました',
        [{ text: 'OK' }]
      );
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      affiliation: '',
      bio: '',
      instagram_id: '',
      twitter_id: '',
    });
    setErrors({});
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const updateFormData = (field: keyof ProfileInput, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // エラーをクリア
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView 
          style={styles.keyboardContainer}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View style={styles.header}>
            <TouchableOpacity style={styles.cancelButton} onPress={handleClose}>
              <Text style={styles.cancelButtonText}>キャンセル</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>プロフィール作成</Text>
            <TouchableOpacity 
              style={[styles.submitButton, loading && styles.submitButtonDisabled]} 
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Text style={styles.submitButtonText}>作成</Text>
              )}
            </TouchableOpacity>
          </View>

          <ScrollView 
            style={styles.content}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.form}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>
                  名前 <Text style={styles.required}>*</Text>
                </Text>
                <TextInput
                  style={[styles.input, errors.name && styles.inputError]}
                  value={formData.name}
                  onChangeText={(text) => updateFormData('name', text)}
                  placeholder="山田太郎"
                  placeholderTextColor="#999"
                  maxLength={50}
                />
                {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>
                  所属 <Text style={styles.required}>*</Text>
                </Text>
                <TextInput
                  style={[styles.input, errors.affiliation && styles.inputError]}
                  value={formData.affiliation}
                  onChangeText={(text) => updateFormData('affiliation', text)}
                  placeholder="株式会社サンプル"
                  placeholderTextColor="#999"
                  maxLength={100}
                />
                {errors.affiliation && <Text style={styles.errorText}>{errors.affiliation}</Text>}
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>
                  一言 <Text style={styles.required}>*</Text>
                </Text>
                <TextInput
                  style={[styles.textArea, errors.bio && styles.inputError]}
                  value={formData.bio}
                  onChangeText={(text) => updateFormData('bio', text)}
                  placeholder="自己紹介や趣味などを書いてください"
                  placeholderTextColor="#999"
                  multiline
                  numberOfLines={4}
                  maxLength={200}
                  textAlignVertical="top"
                />
                <Text style={styles.charCount}>{formData.bio.length}/200</Text>
                {errors.bio && <Text style={styles.errorText}>{errors.bio}</Text>}
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Instagram ID</Text>
                <View style={styles.socialInputContainer}>
                  <Text style={styles.socialPrefix}>@</Text>
                  <TextInput
                    style={styles.socialInput}
                    value={formData.instagram_id}
                    onChangeText={(text) => updateFormData('instagram_id', text)}
                    placeholder="username"
                    placeholderTextColor="#999"
                    maxLength={30}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Twitter (X) ID</Text>
                <View style={styles.socialInputContainer}>
                  <Text style={styles.socialPrefix}>@</Text>
                  <TextInput
                    style={styles.socialInput}
                    value={formData.twitter_id}
                    onChangeText={(text) => updateFormData('twitter_id', text)}
                    placeholder="username"
                    placeholderTextColor="#999"
                    maxLength={15}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>
              </View>

              <View style={styles.note}>
                <Text style={styles.noteText}>
                  <Text style={styles.required}>*</Text> は必須項目です
                </Text>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  keyboardContainer: {
    flex: 1,
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
  cancelButton: {
    paddingVertical: 8,
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#007AFF',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  submitButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    minWidth: 60,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#ccc',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  form: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  required: {
    color: '#ff3b30',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: 'white',
  },
  inputError: {
    borderColor: '#ff3b30',
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: 'white',
    minHeight: 100,
  },
  charCount: {
    textAlign: 'right',
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  socialInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: 'white',
    overflow: 'hidden',
  },
  socialPrefix: {
    fontSize: 16,
    color: '#666',
    paddingLeft: 12,
    paddingVertical: 12,
    backgroundColor: '#f8f8f8',
    borderRightWidth: 1,
    borderRightColor: '#ddd',
  },
  socialInput: {
    flex: 1,
    padding: 12,
    fontSize: 16,
  },
  errorText: {
    color: '#ff3b30',
    fontSize: 14,
    marginTop: 4,
  },
  note: {
    marginTop: 20,
    padding: 16,
    backgroundColor: '#e8f4ff',
    borderRadius: 8,
  },
  noteText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});