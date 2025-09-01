# EASコマンドと環境設定

このドキュメントは、BridgeMeアプリケーションの開発環境および本番環境のセットアップに関するコマンドと手順を概説します。

---

## 1. ローカル開発環境の設定

ローカルでの開発（`expo start` を介してシミュレータでアプリを実行する）では、環境変数は`.env`ファイルで管理されます。

**ファイルパス:** `./.env`

**内容:**
このファイルには、ローカル開発用APIのベースURLを記述します。

```
EXPO_PUBLIC_API_BASE_URL=http://localhost:8080/
```
*注1: URLは実際のローカルAPIエンドポイントに置き換えてください。*
*注2: 配布されているバックエンドサービスをdockerで立ち上げる場合のエンドポイントはhttp://localhost:8080/です*

---

## 2. 本番環境の設定 (EAS Secrets)

本番環境の環境変数（公開APIのURLなど）は、セキュリティのためEAS Secretsを使用して管理する必要があります。

### シークレットの追加・更新:
`eas secret:create`コマンドを使用します。これにより、変数がExpoのサーバーに安全に保存されます。

```bash
eas secret:create --scope project --name EXPO_PUBLIC_API_BASE_URL --value <your-production-api-url> --type string
```
*`<your-production-api-url>`は実際のURLに置き換えてください。*

### シークレットの一覧表示:
このコマンドは、保存されているシークレットの名前を表示しますが、その値は表示しません。

```bash
eas secret:list
```

---

## 3. 本番用アプリケーションのビルド

iOS向けの本番ビルドを作成するには、次のコマンドを実行します。このコマンドは`EXPO_PUBLIC_API_BASE_URL`のEAS Secretを利用します。

```bash
eas build --profile production --platform ios
```
*Apple Developerアカウントでのログインを求められます。*

---

## 4. App Store Connectへの提出

ビルドが正常に完了したら、TestFlightやApp Storeでのリリース用にApp Store Connectに提出できます。

```bash
eas submit --profile production --platform ios
```
*ビルドIDやURLを指定することも、最新のビルドから選択するよう促されることもあります。*