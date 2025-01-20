import "../assets/css/globals.css"; // CSS is now included here
import Providers from "@/store/Providers";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";



export default function RootLayout({ children }) {
  return (
    <Providers>
      <html lang="en">
        <head>
        </head>
        <body className={` antialiased`}>
          <Header />
          {children}
          <Footer />
        </body>
      </html>
    </Providers>
  );
}
