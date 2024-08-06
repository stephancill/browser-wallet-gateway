"use client";

import { ManageWalletView } from "../components/ManageWalletView";

export default function Page() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      <ManageWalletView />
    </div>
  );
}
