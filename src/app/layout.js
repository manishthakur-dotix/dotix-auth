import Provider from "@/utils/Provider";
import "./globals.css";
import { GeistSans } from "geist/font/sans";
import ThemeProvider from "@/utils/Provider";

export const metadata = {
  title: "Dotix - Auth",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/images/dotix.ico" />
      </head>
      <body className={GeistSans.className}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
