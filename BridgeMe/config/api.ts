import Constants from 'expo-constants';

// 環境変数からAPIベースURLを取得
const getApiBaseUrl = (): string => {
  const apiBaseUrl = Constants.expoConfig?.extra?.apiBaseUrl || 
                     process.env.EXPO_PUBLIC_API_BASE_URL || 
                     'https://bridgeme-api.dokkiitech.dev';
  
  console.log('API Base URL:', apiBaseUrl);
  return apiBaseUrl;
};

export const API_BASE_URL = getApiBaseUrl();

// API エンドポイント
export const API_ENDPOINTS = {
  PROFILES: `${API_BASE_URL}/profiles`,
  PROFILE_BY_ID: (id: string) => `${API_BASE_URL}/profiles/${id}`,
} as const;

// API 呼び出しヘルパー関数
export const apiRequest = async (url: string, options?: RequestInit) => {
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};