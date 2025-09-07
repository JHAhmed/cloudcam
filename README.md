# CloudCam

CloudCam is a modern camera app built with SvelteKit and Capacitor, designed to save photos directly to the cloud. It features a Progressive Web App (PWA) experience, native Android support, and seamless integration with Supabase for cloud storage.

## Features

- **Take Photos**: Capture images using your device's camera via Capacitor.
- **Cloud Storage**: Instantly upload photos to Supabase Storage, ensuring you never run out of space.
- **Gallery**: View your saved photos in a dedicated gallery page.
- **Authentication**: Secure access to your content with AuthLock.
- **PWA Support**: Install CloudCam on your device for a native-like experience.
- **Responsive UI**: Clean, mobile-first design with Tailwind CSS.
- **Native Android**: Optimized for Android devices with custom status bar and theming.

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+ recommended)
- [pnpm](https://pnpm.io/) or npm
- [Capacitor](https://capacitorjs.com/)
- [Supabase](https://supabase.com/) project and bucket

### Installation

1. **Clone the repository & install dependencies:**
   ```sh
   git clone https://github.com/JHAhmed/cloudcam.git
   cd cloudcam
   pnpm install
   ```
2. **Configure Supabase:**
   - Update your Supabase credentials in `src/lib/supabaseClient.js`.
   - Ensure you have an `images` bucket in your Supabase project.

3. **Run the development server:**
   ```sh
   pnpm dev
   ```

### Android (Native)

1. **Sync Capacitor:**
   ```sh
   pnpm cap sync android
   # or
   npx cap sync android
   ```
2. **Open Android Studio:**
   ```sh
   pnpm cap open android
   # or
   npx cap open android
   ```
3. **Build and run on device/emulator.**

## Usage

- **Take a Photo:** Click the "Click Photo" button on the main page.
- **Save to Cloud:** After taking a photo, click "Save Photo" to upload to Supabase.
- **View Gallery:** Access your saved images via the "View Photos" button.
- **Install as PWA:** Use the install prompt or browser menu to add CloudCam to your device.

## Project Structure

- `src/routes/+layout.svelte`: Main app layout, navigation, authentication, and PWA logic.
- `src/routes/+page.svelte`: Main camera page, photo capture, and upload logic.
- `src/lib/`: Shared components, state management, and Supabase client.
- `android/`: Native Android project files for Capacitor.
- `build/`, `static/`, `resources/`: Assets and build outputs.

## Credits

Made with ♥️ by [Jamal Haneef](https://jamalhaneef.vercel.app/) & [Wurks](https://wurks.studio/).