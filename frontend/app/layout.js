import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "./provider/provider";
import Aiwrapper from "./aiwrapper/page";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "FashFiesta",
  description: "Your E-commerce site",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <body>
        <Providers>
          {children}
          <Aiwrapper />
        </Providers>
      </body>
    </html>
  );
}
