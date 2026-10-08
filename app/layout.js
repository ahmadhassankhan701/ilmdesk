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
import { canvas, navy, primary } from "@/lib/brand";
const poppins = Poppins({ weight: ["400", "700"], subsets: ["latin"] });

const theme = createTheme({
  palette: {
    primary: { main: primary, contrastText: "#fff" },
    text: { primary: navy },
    background: { default: canvas },
  },
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
        style={{ backgroundColor: canvas }}
      >
        <AuthProvider>
          <ThemeProvider theme={theme}>
            <ToastContainer
              position="top-center"
              autoClose={4200}
              hideProgressBar={false}
              newestOnTop
              closeOnClick
              pauseOnFocusLoss
              draggable={false}
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
