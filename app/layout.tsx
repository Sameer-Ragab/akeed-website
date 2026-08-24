import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Akeed — Business Travel",
  description: "Book, approve, and manage every business trip from one platform."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
