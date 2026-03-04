import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'LinkedPro — LinkedIn Profile Optimizer',
  description: 'Optimize your LinkedIn profile and generate viral posts with AI',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
      <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body style={{ margin: 0, padding: 0 }}>
      {children}
      </body>
      </html>
  );
}