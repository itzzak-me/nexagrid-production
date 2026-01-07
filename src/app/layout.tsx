import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/context/ToastContext";
import { ConfigProvider } from "@/context/ConfigContext";
import SplashScreen from "@/components/SplashScreen"; // <--- NEW IMPORT

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

// 1. PWA Viewport Settings (Prevents zooming, sets color)
export const viewport: Viewport = {
  themeColor: "#050505",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false, // Prevents pinch-zoom like a native app
};

// 2. PWA Metadata
export const metadata: Metadata = {
  title: "NexGen OS",
  description: "Advanced Academic Management System",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "NexGen OS",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${mono.variable} font-sans bg-[#050505] text-white antialiased selection:bg-indigo-500 selection:text-white overscroll-none`}>
        <ConfigProvider>
          <ToastProvider>
            <SplashScreen /> {/* <--- ADDED HERE: Runs first on load */}
            {children}
          </ToastProvider>
        </ConfigProvider>
      </body>
    </html>
  );
}