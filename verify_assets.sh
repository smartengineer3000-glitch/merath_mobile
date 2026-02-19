#!/bin/bash
echo "========================================="
echo "🔍 ASSET VERIFICATION REPORT"
echo "========================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Function to check file
check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✅ Found: $1${NC}"
        ls -lh "$1" | awk '{print "   Size: " $5}'
        file "$1" | cut -d: -f2-
    else
        echo -e "${RED}❌ MISSING: $1${NC}"
    fi
}

# 1. Check assets directory
echo "1. ASSETS DIRECTORY CONTENTS"
echo "----------------------------"
ls -la assets/
echo ""

# 2. Check all required asset files
echo "2. REQUIRED ASSET FILES"
echo "-----------------------"
check_file "assets/icon.png"
check_file "assets/adaptive-icon.png"
check_file "assets/splash.png"
check_file "assets/favicon.png"
echo ""

# 3. Check splash screen config
echo "3. SPLASH SCREEN CONFIGURATION"
echo "------------------------------"
grep -A 10 "splash:" app.config.ts
echo ""

# 4. Check icon config
echo "4. ICON CONFIGURATION"
echo "---------------------"
grep -A 10 "icon:" app.config.ts
echo ""

# 5. Check for any hardcoded paths
echo "5. PATH VERIFICATION"
echo "--------------------"
grep -E "\./assets/|\.assets" app.config.ts | grep -v "//"
echo ""

# 6. Summary
echo "========================================="
echo "📋 VERIFICATION SUMMARY"
echo "========================================="
MISSING=0
for img in assets/icon.png assets/adaptive-icon.png assets/splash.png assets/favicon.png; do
    if [ ! -f "$img" ]; then
        MISSING=$((MISSING+1))
    fi
done

if [ $MISSING -eq 0 ]; then
    echo -e "${GREEN}✅ ALL ASSETS FOUND! Ready to build.${NC}"
else
    echo -e "${RED}❌ MISSING $MISSING ASSETS - Fix before building${NC}"
fi
echo "========================================="
