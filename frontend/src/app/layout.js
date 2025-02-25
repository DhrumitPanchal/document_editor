"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Toaster } from "sonner";
import Navbar from "./components/Navbar";
import "./globals.css";

export default function RootLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    const publicRoutes = ["/login", "/register"];

    if (!accessToken && !publicRoutes.includes(pathname)) {
      router.push("/login");
    } else {
      setCheckingAuth(false); // Stop loading when auth check is done
    }
  }, [pathname]);

  if (checkingAuth) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  } else {
    return (
      <html lang="en">
        <body>
          <Toaster position="top-right" />
          <Navbar />
          {children}
        </body>
      </html>
    );
  }
}
