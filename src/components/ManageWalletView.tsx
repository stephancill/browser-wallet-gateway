"use client";

import { useEffect, useState } from "react";
import { useWalletUrl } from "../providers/WalletUrlProvider";

// Define the structure for our shortcut items
interface ShortcutItem {
  label: string;
  url: string;
}

// Array of shortcut items
const shortcuts: ShortcutItem[] = [
  { label: "localhost:3005", url: "http://localhost:3005/connect" },
  { label: "Coinbase", url: "https://keys.coinbase.com/connect" },
  {
    label: "Open Browser Wallet",
    url: "https://open-browser-wallet.vercel.app/connect",
  },
  // Add more shortcuts here as needed
];

export function ManageWalletView() {
  const { walletUrl, updateWalletUrl } = useWalletUrl();
  const [walletUrlInput, setWalletUrlInput] = useState<string>("");

  useEffect(() => {
    setWalletUrlInput(walletUrl || shortcuts[0].url);
  }, [walletUrl]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateWalletUrl(walletUrlInput);
  };

  const handleShortcutClick = (url: string) => {
    setWalletUrlInput(url);
    updateWalletUrl(url);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {shortcuts.map((shortcut, index) => (
          <button
            key={index}
            onClick={() => handleShortcutClick(shortcut.url)}
            className="p-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            {shortcut.label}
          </button>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="space-y-2">
        <input
          type="url"
          value={walletUrlInput}
          onChange={(e) => setWalletUrlInput(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <button
          type="submit"
          className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Connect
        </button>
      </form>
    </div>
  );
}
