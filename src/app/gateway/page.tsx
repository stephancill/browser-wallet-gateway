"use client";

import { useCallback, useEffect, useState } from "react";
import { Communicator } from "../../lib/Communicator";
import { closeThisPopup } from "../../lib/web";
import { ManageWalletView } from "../../components/ManageWalletView";
import { useWalletUrl } from "../../providers/WalletUrlProvider";
import ContinueView from "../../components/ContinueView";

export default function Home() {
  const { walletUrl } = useWalletUrl();
  const [communicator, setCommunicator] = useState<Communicator | null>(null);
  const [message, setMessage] = useState<MessageEvent | null>(null);
  const [showSettings, setShowSettings] = useState(false);

  const handleMessage = useCallback(
    async (message: MessageEvent) => {
      if (message.source !== window.opener || !communicator) {
        return;
      }

      console.log("Forwarding message to wallet", message.data);

      // forward message to the wallet and wait for response
      const response = await communicator.postRequestAndWaitForResponse(
        message.data
      );

      console.log("Forwarding response to app", response);

      window.opener.postMessage(response, "*");
    },
    [communicator]
  );

  const enable = useCallback(() => {
    if (!communicator) {
      return;
    }
    communicator
      .waitForPopupLoaded()
      .then(() => window.opener.postMessage({ event: "PopupLoaded" }, "*"));
  }, [communicator]);

  useEffect(() => {
    window.addEventListener("beforeunload", closeThisPopup, false);

    if (!communicator) return;

    window.addEventListener("message", setMessage, false);

    enable();

    console.log("Added event listener", walletUrl);

    return () => {
      console.log("Removed event listener");
      window.removeEventListener("message", setMessage);
      window.removeEventListener("beforeunload", closeThisPopup);
    };
  }, [communicator, handleMessage, enable]);

  useEffect(() => {
    if (!walletUrl) {
      return;
    }
    const communicator = new Communicator(walletUrl);
    console.log("Created new communicator with", walletUrl);
    setCommunicator(communicator);
  }, [walletUrl]);

  useEffect(() => {
    if (!communicator || !message || !handleMessage) {
      return;
    }

    handleMessage(message);
  }, [message, handleMessage]);

  return (
    <div>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
        <ContinueView
          showSettings={showSettings || !walletUrl}
          setShowSettings={setShowSettings}
          walletUrl={walletUrl}
          handleContinue={() => enable()}
        />
      </div>
    </div>
  );
}
