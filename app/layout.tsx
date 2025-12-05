import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ConfigProvider, App } from "antd";
import StyledComponentsRegistry from "@/lib/AntdRegistry";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "The Ripple Effect",
  description: "A compassionate employee reflection platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <StyledComponentsRegistry>
          <ConfigProvider
            theme={{
              token: {
                colorPrimary: "#5a7ec4",
                borderRadius: 14,
                fontFamily: "var(--font-geist-sans)",
                colorBgLayout: "#f7f6f2", // Warm off-white
              },
              components: {
                Button: {
                  boxShadow: "0 4px 14px 0 rgba(0, 118, 255, 0.39)",
                },
                Card: {
                  borderRadiusLG: 14,
                  boxShadowTertiary: "0 12px 30px -18px rgba(67, 83, 115, 0.45)",
                }
              },
            }}
          >
            <App>
              {children}
            </App>
          </ConfigProvider>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
