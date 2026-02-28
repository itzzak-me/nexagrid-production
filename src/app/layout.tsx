import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/context/ToastContext";
import { ConfigProvider } from "@/context/ConfigContext";
import SplashScreen from "@/components/SplashScreen";
import Script from "next/script";
import { BRAND_CONFIG } from "@/lib/branding"; // <--- IMPORT THIS

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const viewport: Viewport = {
  themeColor: "#050505",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

// --- DYNAMIC METADATA ENGINE ---
export const metadata: Metadata = {
  title: {
    default: BRAND_CONFIG.name,
    template: `%s | ${BRAND_CONFIG.shortName}`
  },
  description: BRAND_CONFIG.description,
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: BRAND_CONFIG.name,
  },
  icons: {
    icon: BRAND_CONFIG.faviconUrl,
    apple: BRAND_CONFIG.faviconUrl,
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${mono.variable} font-sans bg-[#050505] text-white antialiased selection:bg-indigo-500 selection:text-white overscroll-none`}>

        <Script
          src="https://js.puter.com/v2/"
          strategy="beforeInteractive"
        />

        <ConfigProvider>
          <ToastProvider>
            {/* The SplashScreen will now use BRAND_CONFIG internally */}
            <SplashScreen />
            {children}
          </ToastProvider>
        </ConfigProvider>
      </body>
    </html>
  );
}