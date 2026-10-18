import React, { useState } from 'react';
import { X, Copy, Check, Code2, Smartphone, Terminal, Download, ShieldCheck, HelpCircle } from 'lucide-react';

interface KotlinCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const KotlinCodeModal: React.FC<KotlinCodeModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [selectedTab, setSelectedTab] = useState<
    'APK_Guide' | 'GitHub_Actions' | 'Capacitor' | 'Gradle_App' | 'MainActivity' | 'Database' | 'DashboardScreen' | 'SalesScreen'
  >('APK_Guide');

  if (!isOpen) return null;

  const CODE_SNIPPETS: Record<string, string> = {
    APK_Guide: `# রত্নকুহক (Ratnakuhuk) Android APK তৈরি ও ইন্সটলেশন নির্দেশিকা

এই প্রজেক্টটি Capacitor এবং Android Gradle দিয়ে একটি পূর্ণাঙ্গ নেটিভ Android অ্যাপ্লিকেশনে কনফিগার করা হয়েছে।

## ১. অ্যাপের মূল কনফিগারেশন:
- App Name: Ratnakuhuk (রত্নকুহক)
- Package ID / Application ID: com.ratnakuhuk.app
- Output Folder: release apk/
- Release APK Name: Ratnakuhuk-release.apk
- Min SDK: 24 (Android 7.0+)
- Target / Compile SDK: 34 (Android 14)

---

## ২. গিটহাব থেকে সরাসরি APK ডাউনলোড করার পদ্ধতি (সবচেয়ে সহজ):
প্রজেক্টটিতে ইতিমধ্যেই '.github/workflows/build-android-apk.yml' সেটআপ করা আছে।
১. এই কোডটি আপনার গিটহাব রিপোজিটরিতে পুশ (Push) করুন।
২. GitHub-এর "Actions" ট্যাবে যান।
৩. "Build Ratnakuhuk Android Release APK" ওয়ার্কফ্লোটি স্বয়ংক্রিয়ভাবে রান হবে।
৪. বিল্ড শেষ হলে "Artifacts" সেকশন থেকে সরাসরি "Ratnakuhuk-release-apk" জিপ ফাইলে থাকা 'Ratnakuhuk-release.apk' ডাউনলোড করে ফোনে ইন্সটল করতে পারবেন!

---

## ৩. আপনার লোকাল কম্পিউটারে APK তৈরি করার কমান্ড:
যদি আপনার কম্পিউটারে Node.js ও Android SDK / Android Studio ইনস্টল থাকে:

\`\`\`bash
# ধাপ ১: প্রজেক্ট ডিরেক্টরিতে যান
npm install

# ধাপ ২: ওয়েব বিল্ড ও ক্যাপাসিটর সিঙ্ক
npm run build:android

# ধাপ ৩: রিলিজ APK বিল্ড স্ক্রিপ্ট রান করুন
bash scripts/build-apk.sh
\`\`\`

বিল্ড সফল হওয়ার পর সরাসরি এই ফোল্ডারে APK তৈরি হবে:
\`release apk/Ratnakuhuk-release.apk\`

---

## ৪. রিলিজ সাইনিং (Signing Key Configuration):
- স্বয়ংক্রিয় টেস্ট ও ইনস্টলের জন্য স্ক্রিপ্টটিতে নিজস্ব সেলফ-সাইন্ড রিলিজ কি-স্টোর জেনারেট করার কমান্ড যুক্ত আছে।
- গুগল প্লে-স্টোরের জন্য নিজস্ব অফিসিয়াল কি-স্টোর ব্যবহার করতে চাইলে নিচের এনভায়রনমেন্ট ভ্যারিয়েবল সেট করতে পারেন:
  export RELEASE_KEYSTORE_PATH="/path/to/my-release-key.jks"
  export RELEASE_KEYSTORE_PASSWORD="your-password"
  export RELEASE_KEY_ALIAS="your-alias"
  export RELEASE_KEY_PASSWORD="your-alias-password"`,

    GitHub_Actions: `name: Build Ratnakuhuk Android Release APK

on:
  push:
    branches: [ "main", "master" ]
  workflow_dispatch:

jobs:
  build-apk:
    name: Build & Package Android APK
    runs-on: ubuntu-latest

    steps:
      - name: Checkout Repository
        uses: actions/checkout@v4

      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Install Node Dependencies
        run: |
          if [ -f package-lock.json ]; then
            npm ci || npm install
          else
            npm install
          fi

      - name: Build Web Application
        run: npm run build

      - name: Set up Java JDK 17
        uses: actions/setup-java@v4
        with:
          distribution: 'temurin'
          java-version: '17'

      - name: Set up Android SDK
        uses: android-actions/setup-android@v3

      - name: Sync Capacitor Android
        run: npx cap sync android

      - name: Generate Release Keystore
        run: |
          keytool -genkey -v -keystore android/app/release.keystore \\
            -alias ratnakuhuk \\
            -keyalg RSA -keysize 2048 -validity 10000 \\
            -storepass ratnakuhuk123 -keypass ratnakuhuk123 \\
            -dname "CN=Ratnakuhuk, OU=App, O=Ratnakuhuk, L=Dhaka, S=Dhaka, C=BD"

      - name: Build Android Release APK with Gradle
        env:
          RELEASE_KEYSTORE_PASSWORD: 'ratnakuhuk123'
          RELEASE_KEY_ALIAS: 'ratnakuhuk'
          RELEASE_KEY_PASSWORD: 'ratnakuhuk123'
        run: |
          cd android
          if [ -f "./gradlew" ]; then
            chmod +x ./gradlew
            ./gradlew assembleRelease
          else
            gradle assembleRelease
          fi

      - name: Copy Release APK to Destination Folder
        run: |
          mkdir -p "release apk"
          APK_PATH=$(find android/app/build/outputs/apk -name "*.apk" | grep -i "release" | head -n 1)
          if [ -z "$APK_PATH" ]; then
            APK_PATH=$(find android/app/build/outputs/apk -name "*.apk" | head -n 1)
          fi
          cp "$APK_PATH" "release apk/Ratnakuhuk-release.apk"

      - name: Upload Release APK as Downloadable Artifact
        uses: actions/upload-artifact@v4
        with:
          name: Ratnakuhuk-release-apk
          path: release apk/Ratnakuhuk-release.apk`,

    Capacitor: `{
  "appId": "com.ratnakuhuk.app",
  "appName": "Ratnakuhuk",
  "webDir": "dist",
  "server": {
    "androidScheme": "https",
    "cleartext": true
  },
  "android": {
    "allowMixedContent": true,
    "captureInput": true,
    "webContentsDebuggingEnabled": false
  }
}`,

    Gradle_App: `apply plugin: 'com.android.application'

android {
    namespace "com.ratnakuhuk.app"
    compileSdkVersion rootProject.ext.compileSdkVersion

    defaultConfig {
        applicationId "com.ratnakuhuk.app"
        minSdkVersion rootProject.ext.minSdkVersion
        targetSdkVersion rootProject.ext.targetSdkVersion
        versionCode 1
        versionName "1.0.0"
        testInstrumentationRunner "androidx.test.runner.AndroidJUnitRunner"
    }

    signingConfigs {
        release {
            if (file('release.keystore').exists()) {
                storeFile file('release.keystore')
                storePassword System.getenv("RELEASE_KEYSTORE_PASSWORD") ?: "ratnakuhuk123"
                keyAlias System.getenv("RELEASE_KEY_ALIAS") ?: "ratnakuhuk"
                keyPassword System.getenv("RELEASE_KEY_PASSWORD") ?: "ratnakuhuk123"
            }
        }
    }

    buildTypes {
        release {
            minifyEnabled false
            proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
            if (signingConfigs.release.storeFile) {
                signingConfig signingConfigs.release
            }
        }
    }
}

// Custom Gradle task to automatically copy release APK to 'release apk/Ratnakuhuk-release.apk'
task copyReleaseApk(type: Copy) {
    def outputFolder = file("\${rootDir}/../release apk")
    from("\${buildDir}/outputs/apk/release")
    include("*.apk")
    into(outputFolder)
    rename { String fileName -> return "Ratnakuhuk-release.apk" }
    doLast {
        println "SUCCESS: Copied release APK to: \${outputFolder}/Ratnakuhuk-release.apk"
    }
}

tasks.whenTaskAdded { task ->
    if (task.name == 'assembleRelease') {
        task.finalizedBy(copyReleaseApk)
    }
}`,

    MainActivity: `package com.ratnakuhuk.app;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    // Initializes the Capacitor WebView bridge for Ratnakuhuk
}`,

    Database: `package com.ratnakuhuk.app.data

import androidx.room.*
import kotlinx.coroutines.flow.Flow

@Entity(tableName = "purchases")
data class PurchaseEntity(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val date: String,
    val shopName: String,
    val productName: String,
    val quantity: Int,
    val unitPrice: Double,
    val totalPrice: Double,
    val notes: String = ""
)

@Entity(tableName = "sales")
data class SaleEntity(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val itemNumber: Int,
    val itemName: String,
    val costPrice: Double,
    val sellingPrice: Double,
    val profit: Double,
    val loss: Double,
    val date: String,
    val notes: String = ""
)

@Dao
interface RatnakuhukDao {
    @Query("SELECT * FROM purchases ORDER BY date DESC")
    fun getAllPurchases(): Flow<List<PurchaseEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertPurchase(purchase: PurchaseEntity)

    @Query("SELECT * FROM sales ORDER BY itemNumber ASC")
    fun getAllSales(): Flow<List<SaleEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertSale(sale: SaleEntity)
}`,

    DashboardScreen: `package com.ratnakuhuk.app.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp

@Composable
fun DashboardScreen(viewModel: AppViewModel) {
    val kpi by viewModel.kpiState.collectAsState()
    val shops by viewModel.shopSummaries.collectAsState()

    LazyColumn(
        modifier = Modifier.fillMaxSize().padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        item {
            Text("ব্যবসায়িক সারাংশ (KPI)", style = MaterialTheme.typography.titleMedium, color = Color(0xFF1B365D))
        }
        // Top KPI Cards: মোট বিক্রি, মোট ক্রয়, নীট লাভ, মজুদ স্টক
        item {
            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                KpiCard("মোট বিক্রি", "৳ \${kpi.totalSales}", Modifier.weight(1f))
                KpiCard("মোট ক্রয়", "৳ \${kpi.totalPurchases}", Modifier.weight(1f))
            }
        }
        item {
            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                KpiCard("নীট লাভ", "৳ \${kpi.netProfit}", Modifier.weight(1f), Color(0xFF2E7D32))
                KpiCard("বর্তমান স্টক", "\${kpi.currentStock} পিস", Modifier.weight(1f))
            }
        }
    }
}`,

    SalesScreen: `package com.ratnakuhuk.app.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp

@Composable
fun SalesScreen(viewModel: AppViewModel) {
    val sales by viewModel.salesList.collectAsState()

    Scaffold(
        floatingActionButton = {
            FloatingActionButton(onClick = { /* Open Sale Entry */ }, containerColor = Color(0xFF1B365D)) {
                Text("+", color = Color.White, style = MaterialTheme.typography.headlineMedium)
            }
        }
    ) { padding ->
        LazyColumn(modifier = Modifier.padding(padding).padding(16.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
            items(sales) { sale ->
                Card(modifier = Modifier.fillMaxWidth()) {
                    Row(modifier = Modifier.padding(12.dp), horizontalArrangement = Arrangement.SpaceBetween) {
                        Column {
                            Text("\${sale.itemNumber}. \${sale.itemName}", style = MaterialTheme.typography.titleSmall)
                            Text("ক্রয়: ৳\${sale.costPrice} | বিক্রয়: ৳\${sale.sellingPrice}")
                        }
                        Column {
                            Text("লাভ: ৳\${sale.profit}", color = Color(0xFF2E7D32))
                        }
                    }
                }
            }
        }
    }
}`
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(CODE_SNIPPETS[selectedTab]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const tabLabels: Record<string, string> = {
    APK_Guide: '📱 APK নির্দেশিকা',
    GitHub_Actions: '⚙️ GitHub Actions CI/CD',
    Capacitor: 'capacitor.config.ts',
    Gradle_App: 'build.gradle (:app)',
    MainActivity: 'MainActivity.java',
    Database: 'Room Database',
    DashboardScreen: 'DashboardScreen.kt',
    SalesScreen: 'SalesScreen.kt',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/70 backdrop-blur-xs animate-in fade-in">
      <div 
        className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 bg-[#1B365D] text-white">
          <div className="flex items-center gap-2.5">
            <Smartphone className="w-5 h-5 text-amber-300" />
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>Android APK প্যাকেজিং ও সোর্স ফাইলস</span>
                <span className="text-[10px] bg-emerald-600 px-2 py-0.5 rounded-full font-medium">
                  com.ratnakuhuk.app
                </span>
              </h3>
              <p className="text-xs text-blue-200">
                Ratnakuhuk অ্যাপের রিলিজ APK বিল্ড কনফিগারেশন ও গাইড
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center gap-1 px-4 py-2 bg-slate-100 border-b border-slate-200 overflow-x-auto text-xs">
          {Object.keys(CODE_SNIPPETS).map((tabKey) => (
            <button
              key={tabKey}
              onClick={() => setSelectedTab(tabKey as any)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer whitespace-nowrap ${
                selectedTab === tabKey
                  ? 'bg-white text-[#1B365D] shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tabLabels[tabKey] || tabKey}
            </button>
          ))}

          <div className="ml-auto">
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 rounded-lg bg-[#1B365D] text-white font-medium hover:bg-[#142845] transition-colors flex items-center gap-1 cursor-pointer shrink-0"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'কপি হয়েছে!' : 'কপি করুন'}</span>
            </button>
          </div>
        </div>

        {/* Code/Guide Content */}
        <div className="p-4 bg-slate-950 text-slate-100 font-mono text-xs overflow-y-auto flex-1 leading-relaxed">
          <pre className="overflow-x-auto selection:bg-blue-800 whitespace-pre-wrap">
            <code>{CODE_SNIPPETS[selectedTab]}</code>
          </pre>
        </div>

        {/* Footer info */}
        <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-600 gap-2">
          <span>
            লক্ষ্যস্থান ফোল্ডার: <strong className="font-mono text-slate-900">release apk/Ratnakuhuk-release.apk</strong>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 font-semibold text-slate-800 transition-colors cursor-pointer self-end sm:self-auto"
          >
            বন্ধ করুন
          </button>
        </div>
      </div>
    </div>
  );
};
