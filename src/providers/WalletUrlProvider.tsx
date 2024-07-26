"use client";

import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from "react";
import { WALLET_PREFERENCE_KEY } from "../lib/constants";

interface WalletContextType {
  walletUrl: string | null;
  updateWalletUrl: (url: string) => void;
}

const WalletUrlContext = createContext<WalletContextType | undefined>(
  undefined
);

export const useWalletUrl = () => {
  const context = useContext(WalletUrlContext);
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
};

interface WalletUrlProviderProps {
  children: ReactNode;
}

export const WalletProvider: React.FC<WalletUrlProviderProps> = ({
  children,
}) => {
  const [walletUrl, setWalletUrl] = useState<string | null>(null);

  useEffect(() => {
    // Load preference from local storage
    const storedWalletUrl = localStorage.getItem(WALLET_PREFERENCE_KEY);
    if (storedWalletUrl) {
      setWalletUrl(storedWalletUrl);
    }
  }, []);

  const updateWalletUrl = (url: string) => {
    setWalletUrl(url);
    localStorage.setItem(WALLET_PREFERENCE_KEY, url);
  };

  return (
    <WalletUrlContext.Provider value={{ walletUrl, updateWalletUrl }}>
      {children}
    </WalletUrlContext.Provider>
  );
};
