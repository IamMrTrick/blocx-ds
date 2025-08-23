import type { Metadata } from "next";
import "../styles/_index.scss";

export const metadata: Metadata = {
  title: "Blocx - Next.js Project",
  description: "Next.js project with SCSS ready for development",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" dir="ltr">
      <body>
        {children}
      </body>
    </html>
  );
}
