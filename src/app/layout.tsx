import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/lib/context/AuthContext';
import { FeatureFlagProvider } from '@/lib/context/FeatureFlagContext';
import { ToastProvider } from '@/lib/context/ToastContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Bimba - Convert Gift Cards to Cash',
  description: 'Nigeria\'s trusted platform for converting gift cards to cash',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <FeatureFlagProvider>
            <ToastProvider>
              {children}
            </ToastProvider>
          </FeatureFlagProvider>
        </AuthProvider>
      </body>
    </html>
  );
}