import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/lib/AuthContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "The Future Classroom - AI Tools for K-12 Education",
  description: "Empowering K-12 teachers with AI-powered tools to transform education and create engaging, personalized learning experiences.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body style={{
        fontFamily: inter.style.fontFamily,
        background: 'rgb(0, 0, 0)',
        color: 'rgb(255, 255, 255)',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <AuthProvider>
          <Navbar />
          <main style={{ flexGrow: 1 }}>
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
