import type { Metadata, Viewport } from "next";
import "./globals.css";

// This metadata configures the "Add to Home Screen" iPad experience
// so it looks and acts exactly like a native App Store app.
export const metadata: Metadata = {
  title: "Garden Dashboard",
  description: "Bedford Station Garden Tracker",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Garden Tracker",
  },
};

// This viewport configuration locks the scale. 
// It prevents iOS/iPadOS from auto-zooming when tapping text inputs.
export const viewport: Viewport = {
  themeColor: "#c4b396", // Blends perfectly with your Heritage Tan nav bar
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
