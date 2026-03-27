import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'CaseFlow Operations',
  description: 'Modern case management platform',
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  themeColor: '#14b8a6',
  width: 'device-width',
  initialScale: 1,
};

import { ThemeProvider } from '@/context/ThemeContext';
import { AuthSessionProvider } from '@/components/AuthSessionProvider';
import { ConvexClientProvider } from '@/components/ConvexClientProvider';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
      </head>
      <body className={inter.className}>
        <AuthSessionProvider>
          <ConvexClientProvider>
            <ThemeProvider>
              {children}
            </ThemeProvider>
          </ConvexClientProvider>
        </AuthSessionProvider>
        <Analytics />
      </body>
    </html>
  );
}
