import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import { site } from "@/lib/site";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "What does your GPU really earn? | noesisgym",
    template: "%s | noesisgym",
  },
  description: site.description,
  alternates: { canonical: "./" },
  openGraph: {
    type: "website",
    siteName: site.name,
    title: "What does your GPU really earn?",
    description: site.description,
    url: site.url,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <header className="border-b">
          <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
            <Link href="/" className="font-mono text-sm font-semibold tracking-tight">
              noesisgym
            </Link>
            <div className="flex gap-5 text-sm text-muted-foreground">
              <Link href="/" className="hover:text-foreground">
                Calculator
              </Link>
              <Link href="/methodology/" className="hover:text-foreground">
                Methodology
              </Link>
            </div>
          </nav>
        </header>
        <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-10 sm:px-6 sm:py-14">{children}</main>
        <footer className="border-t">
          <div className="mx-auto flex max-w-5xl flex-col gap-2 px-4 py-6 text-xs text-muted-foreground sm:flex-row sm:justify-between sm:px-6">
            <p>Estimates for information only, not financial advice. No affiliate links.</p>
            <p>
              Built by noesisgym.{" "}
              <a href={site.repo} className="underline underline-offset-4 hover:text-foreground" rel="noopener">
                Code and data are open
              </a>
              .
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
