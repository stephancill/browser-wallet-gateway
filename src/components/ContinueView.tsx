import React from "react";
import { ManageWalletView } from "./ManageWalletView";

interface ContinueViewProps {
  showSettings: boolean;
  setShowSettings: (show: boolean) => void;
  walletUrl: string | null;
  handleContinue: () => void;
}

const ContinueView: React.FC<ContinueViewProps> = ({
  showSettings,
  setShowSettings,
  walletUrl,
  handleContinue,
}) => {
  if (showSettings) {
    return <ManageWalletView onConfirm={() => setShowSettings(false)} />;
  }

  if (!walletUrl) {
    return <div>Connecting...</div>;
  }

  return (
    <div className="text-center w-full max-w-[350px] px-8">
      <button
        className="py-4 mb-4 w-full text-white bg-blue-500 dark:bg-blue-600 rounded-full hover:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:ring-opacity-50 transition duration-300 ease-in-out"
        onClick={handleContinue}
      >
        <div className="text-xl font-bold">Continue to wallet</div>
        <div>{new URL(walletUrl).host}</div>
      </button>
      <div>
        <button
          onClick={() => setShowSettings(true)}
          className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline"
        >
          Manage
        </button>
      </div>
    </div>
  );
};

export default ContinueView;
