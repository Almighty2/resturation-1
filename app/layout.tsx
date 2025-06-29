import type { Metadata } from "next";
import { inter } from "@/app/ui/fonts";
import "./globals.css";
import AuthProvider from "./components/SessionProvider";
import { Providers } from "./Provider/Provider";

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body
        className={`${inter.className} antialiased`}
      >
       <AuthProvider> 
        <Providers>
           {children} 
        </Providers>
        </AuthProvider> 
      </body>
    </html>
  );
}
