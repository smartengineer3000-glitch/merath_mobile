import type { ExpoConfig } from "expo/config";

// IMPORTANT: Must match the package name in android/app/build.gradle
// Current build.gradle shows: space.manus.merath_mobile.t20260101172935
const bundleId = "space.manus.merath_mobile.t20260101172935";
const appScheme = "merath";

const env = {
  // App branding
  appName: 'حاسبة المواريث الشرعية (تطبيق جوال)',
  appSlug: 'merath_mobile',
  logoUrl: '',
  scheme: appScheme,
  androidPackage: bundleId,  // Only Android now
};

const config: ExpoConfig = {
  name: env.appName,
  slug: env.appSlug,
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/icon.png",
  scheme: env.scheme,
  userInterfaceStyle: "automatic",
  newArchEnabled: false,  // DISABLED for stability
  
  description: 'تطبيق شامل لحساب المواريث الشرعية بدعم المذاهب الفقهية الأربعة',
  platforms: ["android"],  // ANDROID ONLY

  splash: {
    image: "./assets/splash.png",
    resizeMode: "contain",
    backgroundColor: "#ffffff"
  },

  extra: {
    eas: {
      projectId: "9fce94bd-7eee-4453-9707-f4bcc74246f6"
    },
    appMetadata: {
      version: "1.0.0",
      buildNumber: 1,
      releaseDate: new Date().toISOString(),
      phase: 6,
      status: "production",
    }
  },

  // iOS section REMOVED - Android only

  android: {
    icon: "./assets/icon.png",
    adaptiveIcon: {
      foregroundImage: "./assets/adaptive-icon.png",
      backgroundColor: "#FFFFFF"
    },
    edgeToEdgeEnabled: false,  // DISABLED for compatibility
    predictiveBackGestureEnabled: false,
    package: env.androidPackage,  // Now matches build.gradle
    permissions: ["INTERNET"],  // MINIMAL permissions
    intentFilters: [
      {
        action: "VIEW",
        autoVerify: true,
        data: [
          {
            scheme: env.scheme,
            host: "*",
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
    reactCompiler: false,  // DISABLED
  },
};

export default config;
