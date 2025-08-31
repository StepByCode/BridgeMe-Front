export default {
  expo: {
    name: "BridgeMe",
    slug: "BridgeMe",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    newArchEnabled: true,
    extra: {
    "eas": {
      "projectId": "653cc93b-e161-41a6-951a-2884ab7ef218"
    },
      "apiBaseUrl": process.env.EXPO_PUBLIC_API_BASE_URL
    },
    splash: {
      image: "./assets/splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.stepbycode.bridgeme'
    },
    android: {
      package: "com.stepbycode.bridgeme",
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff"
      },
      edgeToEdgeEnabled: true
    },
    web: {
      favicon: "./assets/favicon.png"
    }
  }
};