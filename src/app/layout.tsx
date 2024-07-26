import type { Metadata } from "next";
import { WalletProvider } from "../providers/WalletUrlProvider";

export const metadata: Metadata = {
  title: "Open Wallet Gateway",
  description: "Gateway for browser wallets",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <WalletProvider>{children}</WalletProvider>
      </body>
    </html>
  );
}
