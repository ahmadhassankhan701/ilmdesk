"use client";
import { Poppins } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { Box, createTheme, ThemeProvider } from "@mui/material";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { usePathname } from "next/navigation";
const poppins = Poppins({ weight: ["400", "700"], subsets: ["latin"] });

const theme = createTheme({
  typography: {
    fontFamily: "Poppins, sans-serif",
  },
});
export default function RootLayout({ children }) {
  const pathname = usePathname();
  const isDashboard = pathname.startsWith("/dashboard");
  return (
    <html lang="en">
      <body
        className={poppins.className}
        style={{ backgroundColor: "#F5F5F5" }}
      >
        <AuthProvider>
          <ThemeProvider theme={theme}>
            <ToastContainer
              position="top-center"
              autoClose={2000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="dark"
            />
            <Box
              style={{
                display: "flex",
                justifyContent: "space-between",
                flexDirection: "column",
                height: "100%",
              }}
            >
              {!isDashboard && <Nav />}
              {children}
              {!isDashboard && <Footer />}
            </Box>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
