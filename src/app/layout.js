import "../assets/css/globals.css"; // CSS is now included here
import Providers from "@/store/Providers";
import Header from "@/components/header/Header";
import { AuthProvider } from "./sessionProvider";
import {Toaster} from "react-hot-toast"


export default function RootLayout({ children }) {
  return (
    <AuthProvider>
    <Providers>
      <html lang="en">
        <body className="antialiased">
          <Header />
          {children}
          <Toaster />
        </body>
      </html>
    </Providers>
  </AuthProvider>
  );
}
