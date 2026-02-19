#!/bin/bash

echo "========================================="
echo "🚀 COMPREHENSIVE PROJECT AUDIT FOR ANDROID BUILD"
echo "========================================="
echo "Date: $(date)"
echo "Branch: $(git branch --show-current)"
echo "========================================="

# Create output file
AUDIT_FILE="project_audit_$(date +%Y%m%d_%H%M%S).txt"

{
echo "========================================="
echo "📋 PROJECT AUDIT REPORT"
echo "========================================="
echo ""

# 1. Check Git Status
echo "🔍 1. GIT STATUS"
echo "----------------"
git status
git log --oneline -5
echo ""

# 2. Check All Configuration Files
echo "🔍 2. CONFIGURATION FILES"
echo "-------------------------"
echo ""

echo "--- app.config.ts (FULL) ---"
cat app.config.ts
echo ""

echo "--- package.json (SCRIPTS & DEPENDENCIES) ---"
cat package.json | grep -A 20 '"scripts"' || echo "No scripts section"
echo ""
cat package.json | grep -A 50 '"dependencies"' | head -30
echo ""

echo "--- eas.json (FULL) ---"
cat eas.json
echo ""

echo "--- .easignore (FULL) ---"
cat .easignore
echo ""

echo "--- .gitignore (FULL) ---"
cat .gitignore
echo ""

echo "--- tsconfig.json (FULL) ---"
cat tsconfig.json
echo ""

echo "--- metro.config.cjs (FULL) ---"
cat metro.config.cjs 2>/dev/null || echo "metro.config.cjs not found"
echo ""

# 3. Check Android-specific configuration
echo "🔍 3. ANDROID-SPECIFIC CONFIG"
echo "----------------------------"
echo ""

# Check if android folder exists
if [ -d "android" ]; then
    echo "⚠️  WARNING: android folder still exists at $(pwd)/android"
    echo "Size: $(du -sh android/ 2>/dev/null)"
    echo "Contents:"
    ls -la android/
    echo ""
    echo "--- android/app/build.gradle ---"
    cat android/app/build.gradle 2>/dev/null || echo "build.gradle not found"
    echo ""
    echo "--- android/app/src/main/AndroidManifest.xml ---"
    cat android/app/src/main/AndroidManifest.xml 2>/dev/null || echo "AndroidManifest.xml not found"
else
    echo "✅ android folder is REMOVED (good for clean build)"
fi
echo ""

# 4. Check for iOS references (should be none)
echo "🔍 4. iOS REFERENCES (should be none)"
echo "-------------------------------------"
grep -r "ios" --include="*.{ts,tsx,json}" . | grep -v "node_modules" | head -20
echo ""

# 5. Check all native modules
echo "🔍 5. NATIVE MODULES IN PACKAGE.JSON"
echo "------------------------------------"
grep -E "@react-native-|react-native-|expo-" package.json | grep -v "expo-router" | sort | uniq
echo ""

# 6. Check for any network/permissions requirements
echo "🔍 6. NETWORK/PERMISSION USAGE IN CODE"
echo "--------------------------------------"
echo "--- Checking for fetch/axios/API calls ---"
grep -r "fetch\|axios\|api\.\|http:\|https:\|XMLHttpRequest" --include="*.{ts,tsx,js,jsx}" ./ 2>/dev/null || echo "✅ No network calls found"
echo ""
echo "--- Checking for external links/webviews ---"
grep -r "Linking\.\|WebView\|openURL" --include="*.{ts,tsx,js,jsx}" ./ 2>/dev/null || echo "✅ No external links found"
echo ""

# 7. Check for any hardcoded permissions
echo "🔍 7. HARDCODED PERMISSIONS IN CODE"
echo "-----------------------------------"
grep -r "WRITE_EXTERNAL_STORAGE\|READ_EXTERNAL_STORAGE\|POST_NOTIFICATIONS\|android.permission" --include="*.{ts,tsx,js,jsx}" ./ 2>/dev/null || echo "✅ No hardcoded permissions found"
echo ""

# 8. Check project structure
echo "🔍 8. PROJECT STRUCTURE (KEY DIRECTORIES)"
echo "----------------------------------------"
ls -la | grep -E "components|screens|lib|navigation|assets|__tests__" | sort
echo ""

# 9. Check for any errors in recent builds
echo "🔍 9. RECENT BUILD LOGS (if any)"
echo "--------------------------------"
ls -la ~/.expo/logs/ 2>/dev/null | tail -5
echo ""

# 10. Validate app.config.ts critical settings
echo "🔍 10. CRITICAL SETTINGS VALIDATION"
echo "-----------------------------------"
grep -E "package:|newArchEnabled:|permissions:|edgeToEdgeEnabled:|reactCompiler:|platforms:" app.config.ts
echo ""

echo "========================================="
echo "✅ AUDIT COMPLETE"
echo "========================================="

} > "$AUDIT_FILE"

echo "📄 Audit report saved to: $AUDIT_FILE"
echo "🔍 To view the report: cat $AUDIT_FILE"
echo "📋 Or download it from VS Code explorer"
