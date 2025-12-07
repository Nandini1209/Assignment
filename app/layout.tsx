import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Loan Products",
  description: "Browse and filter loan products",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 antialiased">
        <div className="min-h-full">
          {children}
        </div>
      </body>
    </html>
  );
}

