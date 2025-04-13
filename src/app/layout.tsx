import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
// import Navbar from "@/components/Navbar"; // No longer needed here
// import Footer from "@/components/Footer"; // No longer needed here
import { AuthProvider } from "@/lib/AuthContext";
import MainLayout from "@/components/layout/MainLayout"; // Import the new layout component

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
      {/* Apply flex direction to body or a wrapper if needed for footer positioning */}
      <body style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <AuthProvider>
          {/* Render MainLayout which handles Navbar, main, and conditional Footer */}
          <MainLayout>{children}</MainLayout>
        </AuthProvider>
      </body>
    </html>
  );
}
