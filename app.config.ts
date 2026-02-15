import type { ExpoConfig } from "expo/config";

// Bundle ID format: space.manus.<project_name_dots>.<timestamp>
// e.g., "my-app" created at 2024-01-15 10:30:45 -> "space.manus.my.app.t20240115103045"
const bundleId = "space.manus.merath_mobile.t20260101172935";
// Extract timestamp from bundle ID and prefix with "manus" for deep link scheme
// e.g., "space.manus.my.app.t20240115103045" -> "manus20240115103045"
const timestamp = bundleId.split(".").pop()?.replace(/^t/, "") ?? "";
const schemeFromBundleId = `manus${timestamp}`;

const env = {
  // App branding - update these values directly (do not use env vars)
  appName: 'حاسبة المواريث الشرعية (تطبيق جوال)',
  appSlug: 'merath_mobile',
  // S3 URL of the app logo - set this to the URL returned by generate_image when creating custom logo
  // Leave empty to use the default icon from assets/images/icon.png
  logoUrl: '',
  scheme: schemeFromBundleId,
  iosBundleId: bundleId,
  androidPackage: bundleId,
};

const config: ExpoConfig = {
  name: env.appName,
  slug: env.appSlug,
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/images/icon.png",
  scheme: env.scheme,
  userInterfaceStyle: "automatic",
  newArchEnabled: true,
  
  description: 'تطبيق شامل لحساب المواريث الشرعية بدعم المذاهب الفقهية الأربعة',
  platforms: ["ios", "android"],

  // <<< Phase 6: Enhanced EAS Configuration >>>
  extra: {
    eas: {
      projectId: "2c2de43d-16e9-4c3f-88b6-be678d534494"
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
    infoPlist: {
      UIBackgroundModes: ["audio"],
    },
  },
  android: {
    icon: "./assets/images/icon.png",
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
