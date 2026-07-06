import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "@/providers/theme-provider";
import { AuthProvider } from "@/providers/auth-provider";
import { Toaster } from "sonner";
import { es } from "@/translations/es";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

const brand = es.nav.brand;

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8fafc" },
    { media: "(prefers-color-scheme: dark)", color: "#0b1121" },
  ],
};

export const metadata: Metadata = {
  title: {
    default: es.meta.title(brand),
    template: `%s | ${brand}`,
  },
  description: es.meta.description,
  keywords: ["crypto", "criptomonedas", "bitcoin", "ethereum", "portfolio", "inversiones"],
  authors: [{ name: brand }],
  creator: brand,
  robots: { index: true, follow: true },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.json",
  openGraph: {
    title: es.meta.ogTitle(brand),
    description: es.meta.ogDescription,
    type: "website",
    siteName: es.meta.ogSiteName,
    locale: "es_AR",
  },
  twitter: {
    card: "summary_large_image",
    title: es.meta.ogTitle(brand),
    description: es.meta.ogDescription,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <ThemeProvider>
          <AuthProvider>
            {children}
            <Toaster
              position="top-right"
              richColors
              closeButton
            />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
