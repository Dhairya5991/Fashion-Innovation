"""# AR Virtual Try-On & Shopping Android App

This project provides a comprehensive solution for an AR virtual-try-on and shopping application, featuring a React Native Android frontend, a Node.js Express backend with PostgreSQL, and Python Flask microservices for AI-powered body scanning, avatar generation, and garment mapping.

## Table of Contents

1.  [Features](#features)
2.  [System Architecture](#system-architecture)
3.  [Prerequisites](#prerequisites)
4.  [Project Setup](#project-setup)
    *   [Backend & AI Microservices (Docker)](#backend--ai-microservices-docker)
    *   [Frontend (React Native Android)](#frontend-react-native-android)
5.  [Running the Application](#running-the-application)
    *   [Start Docker Services](#start-docker-services)
    *   [Run React Native App](#run-react-native-app)
6.  [Generating a Release APK](#generating-a-release-apk)
7.  [Usage Instructions](#usage-instructions)
8.  [Testing](#testing)
9.  [Troubleshooting](#troubleshooting)
10. [Contributing](#contributing)
11. [License](#license)

## Features

*   **User Authentication:** Register and log in.
*   **Product Catalog:** Browse products with details, images, and 3D models.
*   **Shopping Cart:** Add, update, and remove items from the cart.
*   **Order Management:** Place orders and view order history.
*   **UPI Payment Integration:** (Mock Razorpay integration)
*   **AI Body Scanner:** Upload images to get body measurements.
*   **3D Avatar Generation:** Generate a personalized 3D avatar from measurements.
*   **AR Virtual Try-On:** Superimpose virtual garments on your 3D avatar or live camera feed.
*   **Sustainability Dashboard:** View sustainability metrics for products.
*   **User Profile:** Manage personal information, measurements, and avatar.

## System Architecture

The application follows a microservices architecture:

*   **Frontend:** React Native Android app for the user interface.
*   **Backend (Node.js/Express):** Handles API requests, user management, product catalog, shopping cart, orders, and payment integration. Communicates with AI microservices.
*   **Database (PostgreSQL):** Stores all application data.
*   **AI Body Scanner (Python/Flask):** Processes user images to extract body measurements.
*   **AI Avatar Generator (Python/Flask):** Generates a 3D avatar model based on body measurements.
*   **AI Garment Mapper (Python/Flask):** Maps 3D garment models onto an avatar for virtual try-on.

Communication between services is primarily via HTTP/REST APIs.

## Prerequisites

Before you begin, ensure you have the following installed:

*   **Git:** For cloning the repository.
*   **Docker & Docker Compose:** For running the backend and AI microservices.
    *   [Install Docker](https://docs.docker.com/get-docker/)
*   **Node.js (LTS recommended) & npm/yarn:** For the React Native frontend and backend development (if not using Docker for backend development).
    *   [Install Node.js](https://nodejs.org/en/download/)
*   **Python 3.x & pip:** For AI microservices development (if not using Docker).
*   **React Native Development Environment:** For Android development.
    *   [React Native CLI Quickstart](https://reactnative.dev/docs/environment-setup) - Follow the "React Native CLI Quickstart" guide for Android. This includes:
        *   Java Development Kit (JDK)
        *   Android Studio (with Android SDK, Android SDK Platform, Google Play services, and appropriate SDK tools)
        *   Android Emulator or a physical Android device with USB debugging enabled.
        *   Environment variables set for `ANDROID_HOME`.

## Project Setup

### Backend & AI Microservices (Docker)

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/ar-virtual-try-on.git
    cd ar-virtual-try-on
    ```
2.  **Start the services using Docker Compose:**
    ```bash
    docker-compose up -d --build
    ```
    This will build and start the Node.js backend, PostgreSQL database, and Python AI microservices in detached mode.

### Frontend (React Native Android)

1.  **Navigate to the frontend directory:**
    ```bash
    cd app
    ```
2.  **Install npm dependencies:**
    ```bash
    npm install
    ```

## Running the Application

### Start Docker Services

Ensure the Docker services (backend, database, AI microservices) are running:

```bash
docker-compose up -d
```

### Run React Native App

**Method 1: Using Command Line (Recommended)**

1.  Make sure you have an Android emulator running or a physical device connected.
2.  Start the Metro server:
    ```bash
    npx react-native start
    ```
3.  In a **new terminal**, navigate to the `app` directory and run:
    ```bash
    npx react-native run-android
    ```

**Method 2: Using Android Studio**

1.  Open the `android` directory (`ar-virtual-try-on/app/android`) in Android Studio.
2.  Let the project sync and build.
3.  Select the **`app`** configuration from the dropdown menu in the toolbar.
4.  Click the green **Run** button (▶) to build and launch the app on your emulator or device.

## Generating a Release APK

To generate a release APK, you need to sign it with a private key. **Note:** The current `release` build is configured to use the debug key for simplicity. For a true production release, you must use your own private key.

**1. Generate a Private Signing Key**

If you don't have one, you need to generate a private key using the `keytool` command that comes with the JDK.

*   [Official Android Documentation: Generate an upload key and keystore](https://developer.android.com/studio/publish/app-signing#generate-key)

**2. Configure Gradle for Signing**

It is highly recommended to store your keystore and credentials securely and not check them into version control. You can configure this in your project's `gradle.properties` file.

**3. Build the APK**

Once your signing configuration is set up, you can build the release APK.

1.  **Open a terminal** in your project's `android` directory (`ar-virtual-try-on/app/android`).
2.  **Run the following Gradle command:**

    *   On macOS or Linux:
        ```bash
        ./gradlew assembleRelease
        ```
    *   On Windows:
        ```batch
        ./gradlew.bat assembleRelease
        ```

**4. Locate the APK**

After the build is complete, you can find your signed APK in the following directory:

`app/android/app/build/outputs/apk/release/app-release.apk`


## Usage Instructions

### Authentication

*   Open the app and navigate to the login/register screen.
*   Create a new account or log in with existing credentials.

### Virtual Try-On

1.  Navigate to the "AI Body Scan" section and upload your photos to get measurements.
2.  Generate your 3D avatar from the measurements.
3.  Browse the product catalog and select a garment with a 3D model.
4.  Tap the "Try On" button to view the garment on your avatar or in AR.

### Shopping

*   Add items to your cart from the product details screen.
*   View and manage your cart.
*   Proceed to checkout, enter your shipping details, and place the order.
*   A mock payment flow is initiated.

### Profile & Measurements

*   View and update your personal information.
*   See your saved body measurements and regenerate your avatar if needed.

## Testing

(To be implemented: details on how to run unit and integration tests for frontend and backend.)

## Troubleshooting

*   **`adb: command not found`:** Make sure `ANDROID_HOME/platform-tools` is in your system's `PATH`.
*   **Build failures:** Clean the Gradle build cache: `cd android && ./gradlew clean`.
*   **App not connecting to backend:** Ensure your Docker services are running and that your device/emulator can access the host machine's `localhost`. You may need to use `adb reverse tcp:3000 tcp:3000` to forward the port.
*   **Error: `Could not find or load main class ...` in Android Studio:**
    This error occurs when you try to run a single Java file instead of the whole Android application.
    1.  Go to **Run > Edit Configurations...**.
    2.  Find the incorrect configuration (likely named `MainActivity`) and remove it using the **-** (minus) button.
    3.  In the toolbar, ensure the **`app`** configuration is selected.
    4.  Run the app again using the green play button (▶).

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT](https://choosealicense.com/licenses/mit/)
""