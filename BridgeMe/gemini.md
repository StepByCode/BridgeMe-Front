フロントエンド（React Native + Expo）でのAuth0認証実装手順
1. 必要なライブラリのインストール
Expo環境でAuth0を使用するために、以下のライブラリをインストールします。

npx expo install expo-auth-session expo-web-browser
npm install react-native-auth0

expo-auth-session: Auth0への認証フローを処理するためのライブラリ

expo-web-browser: 認証ページをブラウザで開くためのライブラリ

react-native-auth0: Auth0 SDK

2. Auth0アプリケーションの設定
Auth0管理画面でアプリケーションを作成し、以下の設定を行います。

Allowed Callback URLs: https://auth.expo.io/@your-expo-username/your-app-slug

your-expo-username: Expoアカウントのユーザー名

your-app-slug: app.jsonファイルに記載されているslug

3. 環境変数の設定
app.jsonにAuth0のドメインとクライアントIDを設定します。

{
  "expo": {
    "extra": {
      "auth0Domain": "YOUR_AUTH0_DOMAIN",
      "auth0ClientId": "YOUR_AUTH0_CLIENT_ID"
    }
  }
}

これらの値はAuth0管理画面のアプリケーション設定から取得できます。

4. 認証フローの実装
App.js（または任意のコンポーネント）で認証フローを実装します。

import React, { useState } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import Auth0 from 'react-native-auth0';
import * as WebBrowser from 'expo-web-browser';

// ExpoのextraからAuth0情報を取得
const auth0Domain = 'YOUR_AUTH0_DOMAIN';
const auth0ClientId = 'YOUR_AUTH0_CLIENT_ID';

const auth0 = new Auth0({ domain: auth0Domain, clientId: auth0ClientId });

export default function App() {
  const [accessToken, setAccessToken] = useState(null);
  const [user, setUser] = useState(null);

  const authorize = async () => {
    try {
      WebBrowser.maybeCompleteAuthSession();
      const result = await auth0.webAuth.authorize({ scope: 'openid profile email' });
      setAccessToken(result.accessToken);
      const userProfile = await auth0.auth.userInfo({ token: result.accessToken });
      setUser(userProfile);
    } catch (e) {
      console.log('認証エラー:', e);
    }
  };

  const logout = () => {
    setAccessToken(null);
    setUser(null);
  };

  return (
    <View style={styles.container}>
      {accessToken ? (
        <View>
          <Text>認証成功！</Text>
          <Text>ユーザー名: {user?.name}</Text>
          <Button title="ログアウト" onPress={logout} />
        </View>
      ) : (
        <Button title="ログイン" onPress={authorize} />
      )}
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
});

このコードでは、ログインボタンを押すとAuth0の認証ページがブラウザで開き、認証成功後にアクセストークンとユーザー情報が取得されます。

5. APIリクエストへのアクセストークンの付与
認証が成功したら、取得したアクセストークンをHTTPリクエストのAuthorizationヘッダーに含めます。

const getProfiles = async (accessToken) => {
  try {
    const response = await fetch('[https://api.bridgeme.com/profiles](https://api.bridgeme.com/profiles)', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('APIリクエストエラー:', error);
  }
};

これにより、バックエンドはAuthorizationヘッダーに含まれるアクセストークンを検証できます。