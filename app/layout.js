import './globals.css';
import Navbar from './components/Navbar';
import { Analytics } from '@vercel/analytics/next';

export const metadata = {
  title: 'Saad Khan | Data Analyst',
  description: 'Personal portfolio of a Data Analyst',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body>
        <Navbar />
        {children}
        <Analytics />
      </body>
    </html>
  );
}