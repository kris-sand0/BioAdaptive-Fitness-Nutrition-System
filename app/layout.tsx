import type {Metadata} from 'next';
import './globals.css'; // Global styles
import { AppProvider } from '@/lib/store';

export const metadata: Metadata = {
  title: 'BioAdaptive Fitness & Nutrition System',
  description: 'A "Gold Standard" adaptive intervention platform using ACSM guidelines and Reinforcement Learning to personalize health journeys.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
