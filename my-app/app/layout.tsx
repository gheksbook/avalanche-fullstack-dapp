import { Toaster } from 'sonner';
import './globals.css';
import { Providers } from './providers'; 

export default function RootLayout({ 
  children,
}: { 
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>  
        <Providers>{children}</Providers>
        <Toaster
  position="top-center"
  toastOptions={{
    style: {
      fontSize: '16px',
      padding: '14px 18px',
    }
  }}
/>

      </body>
    </html>
  );
}
     