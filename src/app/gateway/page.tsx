"use client";

import { useEffect, useState } from "react";
import { Communicator } from "../../lib/Communicator";
import { closeThisPopup } from "../../lib/web";
import { ManageWalletView } from "../../components/ManageWalletView";
import { useWalletUrl } from "../../providers/WalletUrlProvider";

export default function Home() {
  const { walletUrl } = useWalletUrl();
  const [communicator, setCommunicator] = useState<Communicator | null>(null);

  useEffect(() => {
    if (!communicator) return;

    const handler = async (m: MessageEvent) => {
      if (m.source !== window.opener || !communicator) {
        return;
      }

      console.log("Forwarding message to wallet", m.data);

      // forward message to the wallet and wait for response
      const response = await communicator.postRequestAndWaitForResponse(m.data);

      if ((response as any) === "PopupUnload") {
        closeThisPopup();
      }

      console.log("Forwarding response to app", response);

      window.opener.postMessage(response, "*");
    };

    window.addEventListener("message", handler, false);

    communicator
      .waitForPopupLoaded()
      .then(() => window.opener.postMessage({ event: "PopupLoaded" }, "*"));

    console.log("Added event listener", walletUrl);

    return () => {
      console.log("Removed event listener");
      window.removeEventListener("message", handler);
    };
  }, [communicator]);

  useEffect(() => {
    if (!walletUrl) {
      return;
    }
    const communicator = new Communicator(walletUrl);
    console.log("Created new communicator with", walletUrl);
    setCommunicator(communicator);
  }, [walletUrl]);

  return (
    <div>
      <h1>Open Wallet Gateway</h1>
      <p>Gateway for browser wallets</p>
      <ManageWalletView></ManageWalletView>
    </div>
  );
}
