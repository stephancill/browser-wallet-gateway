"use client";

import { useEffect, useState } from "react";
import { useWalletUrl } from "../providers/WalletUrlProvider";

interface ShortcutItem {
  label: string;
  url: string;
}

const shortcuts: ShortcutItem[] = [
  { label: "localhost:3005", url: "http://localhost:3005/connect" },
  { label: "Coinbase", url: "https://keys.coinbase.com/connect" },
  {
    label: "Open Browser Wallet",
    url: "https://open-browser-wallet.vercel.app/connect",
  },
];

export function ManageWalletView({
  onConfirm,
}: {
  onConfirm?: (url: string) => void;
}) {
  const { walletUrl, updateWalletUrl } = useWalletUrl();
  const [walletUrlInput, setWalletUrlInput] = useState<string>("");

  useEffect(() => {
    setWalletUrlInput(walletUrl || shortcuts[0].url);
  }, [walletUrl]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateWalletUrl(walletUrlInput);
    onConfirm?.(walletUrlInput);
  };

  const handleShortcutClick = (url: string) => {
    setWalletUrlInput(url);
    updateWalletUrl(url);
    onConfirm?.(url);
  };

  return (
    <div className="max-w-md mx-auto space-y-6 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
        Choose a Wallet
      </h2>
      <div className="space-y-2">
        <h3 className="font-semibold text-gray-700 dark:text-gray-300">
          Quick Connect
        </h3>
        <div className="flex flex-wrap gap-2">
          {shortcuts.map((shortcut, index) => (
            <button
              key={index}
              onClick={() => handleShortcutClick(shortcut.url)}
              className="px-3 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition duration-300 ease-in-out"
            >
              {shortcut.label}
            </button>
          ))}
        </div>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="walletUrl"
            className="block font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Custom Wallet URL
          </label>
          <input
            id="walletUrl"
            type="url"
            value={walletUrlInput}
            onChange={(e) => setWalletUrlInput(e.target.value)}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400"
            placeholder="Enter wallet URL"
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 transition duration-300 ease-in-out"
        >
          Confirm
        </button>
      </form>
    </div>
  );
}
