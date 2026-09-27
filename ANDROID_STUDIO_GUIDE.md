# Dihadi — Android Studio Clone & Run Guide

यह प्रोजेक्ट अब एक **पूर्ण Native Android Studio प्रोजेक्ट (`app` मॉड्यूल और Gradle कॉन्फ़िगरेशन)** के रूप में तैयार है। आप सीधे GitHub से इसे Android Studio में क्लोन करके चला सकते हैं।

---

## 🚀 Step 1: Android Studio में Clone कैसे करें?

1. **Android Studio** खोलें।
2. Welcome स्क्रीन पर **"Get from VCS"** बटन पर क्लिक करें।  
   *(अगर पहले से कोई प्रोजेक्ट खुला है, तो मेनू में **File ➔ New ➔ Project from Version Control...** चुनें)*
3. **URL** बॉक्स में अपने GitHub रिपॉजिटरी का लिंक पेस्ट करें:
   ```text
   https://github.com/<AAPKA_USERNAME>/<AAPKA_REPO_NAME>.git
   ```
4. अपने कंप्यूटर में फ़ोल्डर लोकेशन चुनें और **Clone** पर क्लिक करें।

---

## ⚡ Step 2: Automatic Gradle Sync

1. क्लोन होते ही Android Studio अपने आप `settings.gradle` और `app/build.gradle` को डिटेक्ट कर लेगा।
2. नीचे स्टेटस बार में **"Gradle Build Model..."** और **"Syncing 'Dihadi'..."** शुरू हो जाएगा।
3. Gradle सिंक पूरा होने पर टॉप टूलबार में **`app`** का रन कॉन्फ़िगरेशन और हरा **Run (▶)** बटन एक्टिव हो जाएगा।

> **Note:** Android Studio में Java 17 (Temurin / JetBrains Runtime) डिफ़ॉल्ट रूप से आता है, इसलिए आपको अलग से कुछ भी इंस्टॉल करने की आवश्यकता नहीं है।

---

## 📱 Step 3: Phone या Emulator पर Run करें

1. **Physical Phone:** अपने Android फोन को USB केबल से कनेक्ट करें और **USB Debugging** ऑन करें (Settings ➔ Developer Options ➔ USB Debugging).
   - या **Emulator:** Android Studio के **Device Manager** से कोई भी Emulator (जैसे Pixel 7, Android 13/14) सेलेक्ट करें।
2. ऊपर टूलबार से अपने डिवाइस को सेलेक्ट करें।
3. हरा **Run (▶)** बटन दबाएँ (या `Shift + F10`).
4. Dihadi ऐप आपके फोन/एम्युलेटर पर बिल्ड होकर तुरंत ओपन हो जाएगा!

---

## 🛠️ Project Structure (Android Studio Views)

Android Studio के बाएं पैनल में जब आप **"Android"** व्यू चुनेंगे:

```text
Dihadi/
├── app/
│   ├── manifests/
│   │   └── AndroidManifest.xml          <-- Permissions (Internet, GPS, Call, Camera)
│   ├── java/
│   │   └── in.dihadi.app/
│   │       └── MainActivity.java        <-- Native WebView, Call/WhatsApp, GPS, File Upload
│   ├── assets/
│   │   └── web/                         <-- Offline bundled web application assets
│   └── res/
│       ├── drawable/                    <-- Icons & progress bars
│       ├── layout/activity_main.xml     <-- Main UI layout (SwipeRefresh + WebView)
│       ├── mipmap/                      <-- Official Dihadi App Launcher Icons
│       └── values/                      <-- Colors, Strings, Themes
├── Gradle Scripts/
│   ├── build.gradle (Project: Dihadi)
│   ├── build.gradle (Module: :app)
│   └── settings.gradle (Project Settings)
```

---

## 📦 Step 4: Android Studio से Signed APK या AAB बनाना

जब आप Play Store या दोस्तों को देने के लिए `.apk` फ़ाइल बनाना चाहें:

1. Android Studio मेनू में **Build ➔ Generate Signed Bundle / APK...** पर क्लिक करें।
2. **APK** (डायरेक्ट इंस्टॉल करने के लिए) या **Android App Bundle** (Play Store के लिए) चुनें।
3. **Next** पर क्लिक करें और कीस्टोर चुनें (या "Create new..." से नया कीस्टोर बनाएँ).
4. **release** वेरिएंट चुनें और **Finish** दबाएँ।
5. आपका साइन्ड APK `app/release/app-release.apk` में तैयार हो जाएगा!

---

## 🔄 Web Assets अपडेट करने के लिए:
अगर आप `src/` में कोई बदलाव करते हैं और Android Studio में अपडेट करना चाहते हैं:
```bash
npm run build
cp -r dist/* app/src/main/assets/web/
```
और Android Studio में फिर से **Run (▶)** दबा दें!
