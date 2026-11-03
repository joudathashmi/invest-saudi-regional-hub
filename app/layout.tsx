import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Invest Saudi',
  description: 'Invest Saudi: your gateway to investment opportunities in Saudi Arabia.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // The design system draws every page dark by default (bg-primary #0c0e12);
  // the Digital Stamp, SubHeader and CookiesPopup set data-theme="light" themselves.
  return (
    <html lang="en" dir="ltr" data-theme="dark">
      <body className="is-root">{children}</body>
    </html>
  );
}
