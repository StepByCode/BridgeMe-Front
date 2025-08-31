# EAS コマンド操作手順

このドキュメントでは、Expo Application Services (EAS) を使ったビルド・提出の基本的な手順をまとめています。

---

## 1. 依存関係のインストール
```sh
npm install
```

## 2. ビルドの実行
```sh
eas build
```

## 3. ビルド成果物の確認
EAS Build 完了後、ダッシュボードやコマンドラインにダウンロードリンクが表示されます。

## 4. App Store Connect への提出（iOS）
```sh
eas submit --platform ios
```
初回は Apple API Key などの認証情報の入力が必要です。

## 5. Google Play への提出（Android）
```sh
eas submit --platform android
```

## 6. 注意事項
- 提出後は各ストアで審査申請・公開設定を手動で行う必要があります。
- 認証情報（API Keyなど）は一度設定すれば、以降は再利用できます。
- .env ファイルや app.config.js の設定も適切に管理してください。

---

## 参考リンク
- [Expo EAS Build 公式ドキュメント](https://docs.expo.dev/build/introduction/)
- [Expo EAS Submit 公式ドキュメント](https://docs.expo.dev/submit/introduction/)
