"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { ManageWalletView } from "../../components/ManageWalletView";
import { Communicator } from "../../lib/Communicator";
import { replacer, reviver } from "../../lib/json";
import { useWalletUrl } from "../../providers/WalletUrlProvider";
import ContinueView from "../../components/ContinueView";

export default function Home() {
  const { walletUrl } = useWalletUrl();
  const [communicator, setCommunicator] = useState<Communicator | null>(null);
  const [showSettings, setShowSettings] = useState(false);

  const params = useSearchParams();
  const messageRaw = params.get("message");
  const callbackUrl = params.get("callbackUrl");
  const router = useRouter();

  const sendMessage = useCallback(
    (response: any) => {
      if (!callbackUrl || !communicator) return;

      communicator?.disconnect();

      const url = new URL(callbackUrl);
      url.searchParams.set("message", JSON.stringify(response, replacer));
      router.push(url.toString());
    },
    [callbackUrl, communicator]
  );

  const handleMessage = useCallback(async () => {
    if (!communicator || !messageRaw || !callbackUrl) {
      return;
    }

    const message = JSON.parse(messageRaw, reviver);

    const signerSelectTypeMessage = {
      id: crypto.randomUUID(),
      event: "selectSignerType",
      data: "scw",
    };

    if (message.data.event === "selectSignerType") {
      // Forward message to the wallet and wait for response
      let response = await communicator.postRequestAndWaitForResponse(
        message.data
      );
      return sendMessage(response);
    } else if (message.data.content.handshake) {
      // The handshake needs to happen directly after the selectSignerType message
      // Get message from local storage
      // @ts-ignore -- Type is wrong
      await communicator.postRequestAndWaitForResponse(signerSelectTypeMessage);
    }

    // Forward message to the wallet and wait for response
    let response = await communicator.postRequestAndWaitForResponse(
      message.data
    );

    return sendMessage(response);
  }, [communicator, messageRaw, callbackUrl]);

  useEffect(() => {
    if (!walletUrl) {
      return;
    }
    const communicator = new Communicator(walletUrl);
    console.log("Created new communicator with", walletUrl);
    setCommunicator(communicator);
  }, [walletUrl]);

  useEffect(() => {
    handleMessage();
  }, [handleMessage]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      <ContinueView
        showSettings={showSettings}
        setShowSettings={setShowSettings}
        walletUrl={walletUrl}
        handleContinue={handleMessage}
      />
    </div>
  );
}
