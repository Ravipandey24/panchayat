"use client";

import { ThemeProvider } from "./theme-provider";
import { SessionProvider } from "next-auth/react";


export const ThemeAuthProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <SessionProvider>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          {children}
      </ThemeProvider>
    </SessionProvider>
  );
};
