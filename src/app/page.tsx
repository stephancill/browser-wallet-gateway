"use client";

import { ManageWalletView } from "../components/ManageWalletView";
import { useWalletUrl } from "../providers/WalletUrlProvider";

export default function Page() {
  const { walletUrl } = useWalletUrl();
  return (
    <div>
      <h1>Configure Gateway</h1>
      <div>Wallet URL: {walletUrl}</div>
      <ManageWalletView />
    </div>
  );
}
