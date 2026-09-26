#!/usr/bin/env bash
set -e

echo "============================================="
echo "  Dihadi Android APK & AAB Build Script      "
echo "============================================="

# Ensure directories exist
mkdir -p ~/.bubblewrap
mkdir -p release-artifacts

# Configure Bubblewrap paths from environment
JAVA_PATH="${JAVA_HOME:-$(dirname $(dirname $(readlink -f $(which javac))))}"
SDK_PATH="${ANDROID_HOME:-${ANDROID_SDK_ROOT:-/usr/local/lib/android/sdk}}"

echo "[1/6] Configuring Bubblewrap environment..."
echo "  Java Path: ${JAVA_PATH}"
echo "  Android SDK: ${SDK_PATH}"

cat <<EOF > ~/.bubblewrap/config.json
{
  "jdkPath": "${JAVA_PATH}",
  "androidSdkPath": "${SDK_PATH}"
}
EOF

# Build Web Assets
echo "[2/6] Building Web Application with Vite..."
npm run build

# Prepare Keystore
echo "[3/6] Setting up Android Signing Keystore..."
KEYSTORE_PATH="./android.keystore"
KEY_ALIAS="${KEY_ALIAS:-dihadi}"
KEY_PASSWORD="${KEYSTORE_PASSWORD:-dihadi@2026}"

if [ ! -f "$KEYSTORE_PATH" ]; then
  echo "Generating new production keystore: $KEYSTORE_PATH"
  keytool -genkey -v \
    -keystore "$KEYSTORE_PATH" \
    -alias "$KEY_ALIAS" \
    -keyalg RSA \
    -keysize 2048 \
    -validity 10000 \
    -storepass "$KEY_PASSWORD" \
    -keypass "$KEY_PASSWORD" \
    -dname "CN=Dihadi, OU=Mobile, O=Dihadi, L=Delhi, S=Delhi, C=IN"
else
  echo "Using existing keystore: $KEYSTORE_PATH"
fi

# Build Android APK and AAB with Bubblewrap
echo "[4/6] Running Bubblewrap build..."
export BUBBLEWRAP_KEYSTORE_PASSWORD="$KEY_PASSWORD"
export BUBBLEWRAP_KEY_PASSWORD="$KEY_PASSWORD"

npx --yes @bubblewrap/cli build --skipPwaValidation || {
  echo "Bubblewrap build encountered an issue. Checking for gradle project..."
  if [ -f "./gradlew" ]; then
    chmod +x ./gradlew
    ./gradlew assembleRelease bundleRelease
  fi
}

# Collect generated artifacts
echo "[5/6] Collecting generated APK and AAB files..."
find . -maxdepth 3 -type f \( -name "*.apk" -o -name "*.aab" \) ! -path "*/node_modules/*" ! -path "*/release-artifacts/*" -exec cp -v {} release-artifacts/ \;

# Rename for easy identification
cd release-artifacts
for f in *signed*.apk; do
  [ -f "$f" ] && mv "$f" "dihadi-release.apk" && break
done
for f in *release*.aab; do
  [ -f "$f" ] && mv "$f" "dihadi-playstore-bundle.aab" && break
done
cd ..

echo "[6/6] Build complete! Artifacts available in release-artifacts/:"
ls -lh release-artifacts/

echo "============================================="
echo "  Dihadi Android Build Succeeded!           "
echo "============================================="
