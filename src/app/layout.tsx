import type { Metadata } from "next";
import { Mulish, Open_Sans, Volkhov, Poppins } from "next/font/google";
import "./globals.css";
import localFont from "next/font/local";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const mulish = Mulish({
  subsets: ["latin"],
  variable: "--font-mulish",
  display: "swap",
});
const openSans = Open_Sans({
  subsets: ["latin"],
  variable: "--font-open-sans",
  display: "swap",
});

const volkhov = Volkhov({
  subsets: ["latin"],
  variable: "--font-volkhov",
  display: "swap",
  weight: ["400", "700"], 
});
const nicoMoji = localFont({
  src: "../../public/fonts/NicoMoji-Regular.ttf",
  variable: "--font-nicomoji",
  display: "swap",
});
const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  display: "swap",
  weight: ["400", "700"], 
});

export const metadata: Metadata = {
  title: "Danang Culinary Atlas",
  description:
    "An interactive culinary atlas showcasing the rich food culture of Da Nang. Explore traditional dishes, local specialties, and discover the stories behind the city's diverse cuisine.",
  keywords: [
    "Da Nang food",
    "Danang culinary atlas",
    "Vietnamese cuisine",
    "local specialties",
    "Da Nang street food",
    "Vietnam food culture"
  ],
  openGraph: {
    title: "Danang Culinary Atlas",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${mulish.variable} ${openSans.variable} ${volkhov.variable} ${poppins.variable} ${nicoMoji.variable} antialiased`}
      >
        {children}
        <ToastContainer
          position="top-center"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={true}
          closeOnClick
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
      </body>
    </html>
  );
}