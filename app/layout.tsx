import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Speed Without Tomorrow",
  description: "A map for living after the collapse of shared meaning",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
