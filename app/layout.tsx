import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "KuickArt - Authentic South Asian Groceries in Europe",
  description: "Best prices on Shan, National, Mehran, Ahmed masalas • Free shipping over €35 • Fresh delivery across EU",
  keywords: ["indian groceries", "pakistani spices", "shan masala", "basmati rice", "europe delivery"],
  openGraph: {
    title: "KuickArt - South Asian Groceries Delivered",
    description: "Shop authentic Indian & Pakistani groceries with the best prices in Europe. Free shipping over €35.",
    url: "https://www.kuickart.eu",
    siteName: "KuickArt",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "KuickArt homepage",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "KuickArt - Authentic Groceries",
    description: "Best prices on masalas, rice, ghee • Free shipping over €35",
    images: ["/og-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Optional: Add any analytics scripts here later (GA, FB Pixel, etc.) */}
      </head>
      <body className={cn(
        "min-h-screen bg-background font-sans antialiased",
        inter.className
      )}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <TooltipProvider>
            {children}
            <Toaster position="top-right" richColors closeButton />
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
