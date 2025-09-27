import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from '@/components/theme-provider';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'MailDrop',
  description: 'A temporary email service with AI-powered spam filtering.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased h-full bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="relative flex flex-col h-full">
            {children}
          </div>
          <Toaster />
        </ThemeProvider>
         <div className="fixed bottom-4 right-4 z-50">
            <Image 
                src="https://i.postimg.cc/L85HPsYz/shozonroyimage.png" 
                alt="Shozon Roy" 
                width={60} 
                height={60} 
                className="rounded-full"
            />
        </div>
      </body>
    </html>
  );
}
