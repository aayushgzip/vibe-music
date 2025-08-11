
import type { Metadata } from 'next';
import { Inter } from 'next/font/google'; // Changed from GeistSans to Inter
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/theme-provider';
import { AudioProvider } from '@/context/audio-provider';

const inter = Inter({ // Use Inter
  variable: '--font-inter', // Updated variable name
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'VibeTune - What’s Your Life Soundtrack?',
  description: 'Interactive quiz to discover your unique life soundtrack. Gen Z-friendly, quirky, and shareable!',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AudioProvider>
            {children}
            <Toaster />
          </AudioProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
