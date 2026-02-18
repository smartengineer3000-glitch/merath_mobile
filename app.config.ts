import type { ExpoConfig } from "expo/config";

// Bundle ID format: com.<company>.<app>
// Standard Android/iOS package naming convention
const bundleId = "com.merath.mobile";
const appScheme = "merath";

const env = {
  // App branding
  appName: 'حاسبة المواريث الشرعية (تطبيق جوال)',
  appSlug: 'merath_mobile',
  logoUrl: '',
  scheme: appScheme,
  iosBundleId: bundleId,
  androidPackage: bundleId,
};

const config: ExpoConfig = {
  name: env.appName,
  slug: env.appSlug,
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/icon.png",
  scheme: env.scheme,
  userInterfaceStyle: "automatic",
  newArchEnabled: true,
  
  description: 'تطبيق شامل لحساب المواريث الشرعية بدعم المذاهب الفقهية الأربعة',
  platforms: ["ios", "android"],

  splash: {
    image: "./assets/splash.png",
    resizeMode: "contain",
    backgroundColor: "#ffffff"
  },

  // <<< Phase 6: Enhanced EAS Configuration >>>
  extra: {
    eas: {
      projectId: "9fce94bd-7eee-4453-9707-f4bcc74246f6"
    },
    // App metadata for deep linking and sharing
    appMetadata: {
      version: "1.0.0",
      buildNumber: 1,
      releaseDate: new Date().toISOString(),
      phase: 6,
      status: "production",
    }
  },

  ios: {
    supportsTablet: true,
    bundleIdentifier: env.iosBundleId,
  },
  android: {
    icon: "./assets/icon.png",
    adaptiveIcon: {
      foregroundImage: "./assets/adaptive-icon.png",
      backgroundColor: "#FFFFFF"
    },
    edgeToEdgeEnabled: true,
    predictiveBackGestureEnabled: false,
    package: env.androidPackage,
    permissions: ["POST_NOTIFICATIONS", "INTERNET", "WRITE_EXTERNAL_STORAGE", "READ_EXTERNAL_STORAGE"],
    intentFilters: [
      {
        action: "VIEW",
        autoVerify: true,
        data: [
          {
            scheme: env.scheme,
            host: "*",
          },
          {
            scheme: "merath",
            host: "*",
          },
          {
            scheme: "https",
            host: "merath.app",
            pathPrefix: "/*",
          },
        ],
        category: ["BROWSABLE", "DEFAULT"],
      },
    ],
  },
  web: {
    output: "static",
    favicon: "./assets/favicon.png",
  },
  plugins: [
    "expo-router",
  ],
  experiments: {
    typedRoutes: true,
    reactCompiler: true,
  },
};

export default config;
