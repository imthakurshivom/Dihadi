# Dihadi — Google Play Store Release & TWA Packaging Guide

Because Dihadi is built as a standards-compliant **Progressive Web App (PWA)**, publishing it to the Google Play Store as an official Android App (.aab / APK) is done via **Trusted Web Activities (TWA)** using Google's official **Bubblewrap CLI** or **PWABuilder**.

---

### App Store Listing Assets (Ready in Project)

- **App Name:** `Dihadi — Kaam bhi, Majdoor bhi`
- **Short Name:** `Dihadi`
- **Package ID:** `in.dihadi.app`
- **Category:** `Business / Local Services`
- **PWA Manifest:** Active and verified at `/manifest.webmanifest`
- **Icons Included:**
  - High-res icon: `512x512 PNG` (`/public/pwa-512x512.png`)
  - Maskable icon: `512x512 PNG` (`/public/pwa-maskable-512x512.png`)
  - Standard icon: `192x192 PNG` (`/public/pwa-192x192.png`)
  - Vector icon: `SVG` (`/public/icon.svg`)
- **Theme Color:** `#EA580C` (Indian saffron/terracotta orange)
- **Live Production URL:** `https://ais-dev-cu76msermmqjedghfm7cwr-58305786231.asia-southeast1.run.app`

---

## Method 1: Automatic GitHub Actions APK & AAB Workflow (Zero Local Setup)

This repository includes a pre-configured CI/CD workflow at `.github/workflows/build-apk.yml`.

### How to Push and Get Your APK:

1. **Create a new repository** on [GitHub.com](https://github.com/new) (e.g. `dihadi-android`).
2. **Add remote and push from terminal:**
   ```bash
   git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/<YOUR_REPO_NAME>.git
   git branch -M main
   git push -u origin main
   ```
3. **Download your APK:**
   - Go to your repository on GitHub.
   - Click the **Actions** tab at the top.
   - Click the running or completed **"Build Dihadi Android APK & Release Bundle"** workflow.
   - Scroll down to **Artifacts** and download:
     - `dihadi-release.apk` (Install directly on any Android phone)
     - `dihadi-playstore-bundle.aab` (Upload to Google Play Console)

4. **Automatic Releases:**
   - To create an official GitHub Release with downloadable APK:
     ```bash
     git tag v1.0.0
     git push origin v1.0.0
     ```
   - GitHub Actions will build and attach the APK file to the **Releases** tab automatically.

---

## Method 2: Instant No-Code Packaging via PWABuilder (Alternative)

1. Open [PWABuilder.com](https://www.pwabuilder.com).
2. Enter your live URL:
   ```
   https://ais-dev-cu76msermmqjedghfm7cwr-58305786231.asia-southeast1.run.app
   ```
3. Click **Start** — PWABuilder automatically validates the manifest, service worker, and high-res icons.
4. Click **Package for Store** ➔ Select **Google Play**.
5. Configure package settings:
   - **Package ID:** `in.dihadi.app`
   - **App Name:** `Dihadi`
   - **Signing key:** Choose *Create New Key* (or upload existing keystore).
6. Click **Generate Package**.
7. Download the signed `.aab` (Android App Bundle) and your `assetlinks.json`.

---

## Method 2: Command-Line Generation using Google's Official Bubblewrap CLI

If you have Node.js and the Android SDK / Java JDK installed on your machine:

```bash
# 1. Install Bubblewrap CLI
npm install -g @bubblewrap/cli

# 2. Initialize the Android TWA project from Dihadi's manifest
bubblewrap init --manifest="https://ais-dev-cu76msermmqjedghfm7cwr-58305786231.asia-southeast1.run.app/manifest.webmanifest"

# 3. Follow the prompts for Package ID: in.dihadi.app
# Bubblewrap will generate keystore and Android project

# 4. Build the production Android App Bundle (.aab)
bubblewrap build
```

This creates `app-release-bundle.aab`.

---

## Step 3: Google Play Console Submission Checklist

1. Log into your [Google Play Console](https://play.google.com/console).
2. Click **Create App**:
   - **App name:** `Dihadi: Kaam Aur Majdoor`
   - **Default language:** `Hindi (India) - hi-IN` or `English (India) - en-IN`
   - **App or game:** `App`
   - **Free or paid:** `Free`
3. In **Dashboard ➔ Set up your app**:
   - **Privacy Policy:** Link to privacy policy.
   - **App access:** All functionality is available without special credentials (OTP login demo is provided).
   - **Target audience:** Ages 18 and up.
   - **Category:** Business / Productivity.
4. In **Store Presence ➔ Main store listing**:
   - **Short description:**
     *Kaam bhi, Majdoor bhi — Apne Aas-Paas. Hyperlocal daily-wage & skilled worker marketplace.*
   - **Full description:**
     *Dihadi connects local workers, mistri, helpers, carpenters, electricians, plumbers, and contractors within 1 to 25 km without any middleman fees.*
   - **App icon:** Upload `/public/pwa-512x512.png`.
5. In **Release ➔ Production / Internal Testing**:
   - Upload the generated `app-release-bundle.aab`.
   - Complete digital asset links verification (`/.well-known/assetlinks.json`) to hide the browser URL bar.
6. Click **Review and Roll out Release**.
