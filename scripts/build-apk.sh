#!/usr/bin/env bash
set -e

echo "=========================================="
echo "  Ratnakuhuk (রত্নকুহক) Android APK Builder"
echo "=========================================="

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$PROJECT_ROOT"

echo "1. Building Web Production Assets..."
npm run build

echo "2. Syncing Capacitor Android Assets..."
if command -v npx &> /dev/null; then
  npx cap sync android
fi

echo "3. Checking Keystore for Release Signing..."
KEYSTORE_PATH="$PROJECT_ROOT/android/app/release.keystore"
if [ ! -f "$KEYSTORE_PATH" ] && [ -z "$RELEASE_KEYSTORE_PATH" ]; then
  echo "Generating signing key for installable release APK..."
  keytool -genkey -v -keystore "$KEYSTORE_PATH" \
    -alias ratnakuhuk \
    -keyalg RSA -keysize 2048 -validity 10000 \
    -storepass "${RELEASE_KEYSTORE_PASSWORD:-ratnakuhuk123}" \
    -keypass "${RELEASE_KEY_PASSWORD:-ratnakuhuk123}" \
    -dname "CN=Ratnakuhuk, OU=Clothing, O=Ratnakuhuk, L=Dhaka, S=Dhaka, C=BD"
fi

echo "4. Running Gradle Release Build..."
cd "$PROJECT_ROOT/android"
if [ -f "./gradlew" ]; then
  chmod +x ./gradlew
  ./gradlew assembleRelease
elif command -v gradle &> /dev/null; then
  gradle assembleRelease
else
  echo "Error: Neither ./gradlew nor gradle found!"
  exit 1
fi

echo "5. Moving Output APK to 'release apk/Ratnakuhuk-release.apk'..."
cd "$PROJECT_ROOT"
mkdir -p "release apk"

APK_SOURCE=$(find "$PROJECT_ROOT/android/app/build/outputs/apk" -name "*.apk" | grep -i "release" | head -n 1)
if [ -z "$APK_SOURCE" ]; then
  APK_SOURCE=$(find "$PROJECT_ROOT/android/app/build/outputs/apk" -name "*.apk" | head -n 1)
fi

if [ -f "$APK_SOURCE" ]; then
  cp "$APK_SOURCE" "release apk/Ratnakuhuk-release.apk"
  echo "=========================================="
  echo "BUILD SUCCESSFUL!"
  echo "Release APK generated at:"
  echo "$PROJECT_ROOT/release apk/Ratnakuhuk-release.apk"
  ls -lh "$PROJECT_ROOT/release apk/Ratnakuhuk-release.apk"
  echo "=========================================="
else
  echo "Error: Could not locate generated APK in android/app/build/outputs/apk!"
  exit 1
fi
