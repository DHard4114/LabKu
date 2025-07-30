import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./component/navBar";
import Footer from "./component/footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LabKu",
  description: "Platform web learning untuk siswa-siswi Bu Fitri",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Navbar /> {/* ⬅️ Navbar selalu muncul di setiap halaman */}
        <main className="w-full mx-auto">{children}</main>
        <Footer /> {/* ⬅️ Footer selalu muncul di setiap halaman */}
      </body>
    </html>
  );
}
