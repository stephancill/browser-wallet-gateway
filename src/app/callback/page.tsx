"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import ContinueView from "../../components/ContinueView";
import { Communicator } from "../../lib/Communicator";
import { replacer } from "../../lib/json";
import { useWalletUrl } from "../../providers/WalletUrlProvider";

export default function Home() {
  const { walletUrl } = useWalletUrl();
  const [communicator, setCommunicator] = useState<Communicator | null>(null);
  const [showSettings, setShowSettings] = useState(false);

  const params = useSearchParams();

  const id = JSON.parse(params.get("id") || "");
  const sender = JSON.parse(params.get("sender") || "");
  const sdkVersion = JSON.parse(params.get("sdkVersion") || "");
  const callbackUrl = JSON.parse(params.get("callbackUrl") || "");
  const timestamp = JSON.parse(params.get("timestamp") || "");
  const content = JSON.parse(params.get("content") || "");

  const router = useRouter();

  const sendMessage = useCallback(
    (response: any) => {
      if (!callbackUrl || !communicator) return;

      communicator?.disconnect();

      const url = new URL(callbackUrl);

      for (const [key, value] of Object.entries(response)) {
        url.searchParams.set(key, JSON.stringify(value, replacer));
      }

      router.push(url.toString());
    },
    [callbackUrl, communicator]
  );

  const handleMessage = useCallback(async () => {
    if (!communicator || !callbackUrl) {
      return;
    }

    const message = {
      id,
      sender,
      sdkVersion,
      timestamp,
      content,
    };

    if ("encrypted" in message.content) {
      const encrypted = message.content.encrypted;
      message.content = {
        encrypted: {
          iv: new Uint8Array(Buffer.from(encrypted.iv, "hex")),
          cipherText: new Uint8Array(Buffer.from(encrypted.cipherText, "hex")),
        },
      };
    }

    const signerSelectTypeMessage = {
      id: crypto.randomUUID(),
      event: "selectSignerType",
      data: "scw",
    };

    if (message.content.handshake) {
      // The handshake needs to happen directly after the selectSignerType message
      // Get message from local storage
      // @ts-ignore -- Type is wrong
      await communicator.postRequestAndWaitForResponse(signerSelectTypeMessage);
    }

    // Forward message to the wallet and wait for response
    let walletResponse = await communicator.postRequestAndWaitForResponse(
      message
    );

    // Adapt expected fields and forward response to the app
    const response = {
      ...walletResponse,
      id: walletResponse.requestId,
      timestamp,
    };
    return sendMessage(response);
  }, [communicator, callbackUrl]);

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
        showSettings={showSettings || !walletUrl}
        setShowSettings={setShowSettings}
        walletUrl={walletUrl}
        handleContinue={handleMessage}
      />
    </div>
  );
}
