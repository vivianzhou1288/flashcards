import { Inter } from "next/font/google";
import "./globals.css";
import { AppProvider } from "./context/AppContext";
import { ClerkProvider } from "@clerk/nextjs";
import { createTheme, ThemeProvider } from "@mui/material";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "AI Flashcard App",
  description: "An AI Flashcard App created with next app",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <AppProvider>{children}</AppProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
