#!/bin/bash
echo "========================================="
echo "📊 COMPLETE VERSION VERIFICATION REPORT"
echo "========================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Function to check version
check_version() {
    local name=$1
    local command=$2
    local required=$3
    local current=$($command 2>/dev/null | head -1)
    
    if [ $? -eq 0 ] && [ ! -z "$current" ]; then
        echo -e "${GREEN}✅ $name:${NC} $current"
        if [ ! -z "$required" ]; then
            echo "   Required: $required"
        fi
    else
        echo -e "${RED}❌ $name: NOT FOUND${NC}"
    fi
}

echo "1. SYSTEM TOOLS"
echo "---------------"
check_version "Node.js" "node --version" ">= 18.x"
check_version "npm" "npm --version" ">= 8.x"
check_version "pnpm" "pnpm --version" ">= 8.x"
check_version "Git" "git --version" ">= 2.x"
check_version "Watchman" "watchman --version" "Optional"
echo ""

echo "2. EXPO & EAS TOOLS"
echo "--------------------"
check_version "Expo CLI" "npx expo --version" ">= 6.x"
check_version "EAS CLI" "eas --version" ">= 16.x"
echo ""

echo "3. PROJECT DEPENDENCIES (from package.json)"
echo "-------------------------------------------"
EXPO_VERSION=$(node -p "require('./package.json').dependencies.expo || 'not found'")
echo -e "Expo SDK: ${GREEN}$EXPO_VERSION${NC}"

REACT_VERSION=$(node -p "require('./package.json').dependencies.react || 'not found'")
echo -e "React: ${GREEN}$REACT_VERSION${NC}"

REACT_NATIVE_VERSION=$(node -p "require('./package.json').dependencies['react-native'] || 'not found'")
echo -e "React Native: ${GREEN}$REACT_NATIVE_VERSION${NC}"
echo ""

echo "4. EXPO CONFIGURATION"
echo "---------------------"
SDK_VERSION=$(grep -o '"sdkVersion": "[^"]*"' app.config.ts 2>/dev/null | cut -d'"' -f4 || echo "Not found")
if [ -z "$SDK_VERSION" ]; then
    SDK_VERSION=$(grep -o "sdkVersion: '[^']*'" app.config.ts | cut -d"'" -f2)
fi
echo -e "SDK Version: ${GREEN}$SDK_VERSION${NC} (Expected: 54.0.0)"

PLATFORMS=$(grep -o "platforms: \[[^]]*\]" app.config.ts)
echo -e "Platforms: ${GREEN}$PLATFORMS${NC} (Should be Android only)"

NEW_ARCH=$(grep -o "newArchEnabled: [a-z]*" app.config.ts)
echo -e "New Architecture: ${GREEN}$NEW_ARCH${NC} (Should be false)"

PERMISSIONS=$(grep -o "permissions: \[[^]]*\]" app.config.ts)
echo -e "Permissions: ${GREEN}$PERMISSIONS${NC} (Should be empty [])"
echo ""

echo "5. JAVA & ANDROID ENVIRONMENT"
echo "-----------------------------"
check_version "Java" "java -version 2>&1 | grep version" ">= 17"
check_version "Javac" "javac -version 2>&1" ">= 17"

if [ -n "$ANDROID_HOME" ]; then
    echo -e "${GREEN}✅ ANDROID_HOME:${NC} $ANDROID_HOME"
else
    echo -e "${YELLOW}⚠️ ANDROID_HOME not set (only needed for local builds)${NC}"
fi
echo ""

echo "6. GRADLE CHECK (if android folder exists)"
echo "------------------------------------------"
if [ -f "android/gradle/wrapper/gradle-wrapper.properties" ]; then
    GRADLE_VERSION=$(grep "distributionUrl" android/gradle/wrapper/gradle-wrapper.properties | grep -o "gradle-[0-9.]*-" | cut -d'-' -f2)
    echo -e "Gradle Wrapper: ${GREEN}$GRADLE_VERSION${NC}"
else
    echo -e "${YELLOW}⚠️ No android folder - clean build will download Gradle${NC}"
fi
echo ""

echo "7. PACKAGE MANAGER LOCK FILE"
echo "-----------------------------"
if [ -f "package-lock.json" ]; then
    echo -e "${GREEN}✅ npm lock file exists${NC}"
elif [ -f "yarn.lock" ]; then
    echo -e "${GREEN}✅ yarn lock file exists${NC}"
elif [ -f "pnpm-lock.yaml" ]; then
    echo -e "${GREEN}✅ pnpm lock file exists${NC}"
else
    echo -e "${RED}❌ No lock file found! Run npm install${NC}"
fi
echo ""

echo "8. NODE MODULES CHECK"
echo "---------------------"
if [ -d "node_modules" ]; then
    NODE_MODULES_SIZE=$(du -sh node_modules 2>/dev/null | cut -f1)
    echo -e "${GREEN}✅ node_modules exists${NC} (Size: $NODE_MODULES_SIZE)"
else
    echo -e "${YELLOW}⚠️ node_modules not found - will be installed during build${NC}"
fi
echo ""

echo "9. RECENT BUILD HISTORY"
echo "-----------------------"
eas build:list --platform android --limit 3 --non-interactive 2>/dev/null | grep -E "ID|Version code|Status" | head -9 || echo "No recent builds found"
echo ""

echo "10. CRITICAL VERSION MATCHING"
echo "-----------------------------"
echo "Checking Expo SDK compatibility:"
EXPO_DEP=$(node -p "require('./package.json').dependencies.expo || ''" | tr -d '~^')
if [[ $EXPO_DEP == *"54"* ]]; then
    echo -e "${GREEN}✅ Expo SDK 54.x matches requirement${NC}"
else
    echo -e "${RED}❌ Expo SDK version mismatch: $EXPO_DEP (should be 54.x)${NC}"
fi
echo ""

echo "========================================="
echo "📋 VERSION VERIFICATION SUMMARY"
echo "========================================="

# Final summary
ERRORS=0
WARNINGS=0

if ! command -v node &> /dev/null; then ERRORS=$((ERRORS+1)); fi
if ! command -v npm &> /dev/null; then ERRORS=$((ERRORS+1)); fi
if ! command -v eas &> /dev/null; then ERRORS=$((ERRORS+1)); fi
if [ ! -f "package-lock.json" ] && [ ! -f "yarn.lock" ] && [ ! -f "pnpm-lock.yaml" ]; then WARNINGS=$((WARNINGS+1)); fi

echo -e "✅ Errors: $ERRORS"
echo -e "⚠️  Warnings: $WARNINGS"
echo "========================================="

if [ $ERRORS -eq 0 ]; then
    echo -e "${GREEN}✅ ALL CRITICAL TOOLS FOUND! Ready to build.${NC}"
else
    echo -e "${RED}❌ Missing critical tools. Please install required dependencies.${NC}"
fi
