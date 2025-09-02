export const metadata = {
  title: 'Human Migration Simulator',
  description: 'Evidence-driven globe — 500,000 BCE → 2025 CE'
};

import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

