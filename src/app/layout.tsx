import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Magic Music",
  description: "Your Event Partner.",
  icons: {
    icon: "/magic-music-Icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className={`antialiased`} style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        {children}
        <Toaster richColors position="bottom-right" />
      </body>
    </html>
  );
}
