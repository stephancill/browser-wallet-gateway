const POPUP_WIDTH = 420;
const POPUP_HEIGHT = 540;

// Window Management

export function openPopup(url: URL): Window {
  const left = (window.innerWidth - POPUP_WIDTH) / 2 + window.screenX;
  const top = (window.innerHeight - POPUP_HEIGHT) / 2 + window.screenY;

  const popup = window.open(
    url,
    "Smart Wallet Gateway",
    `width=${POPUP_WIDTH}, height=${POPUP_HEIGHT}, left=${left}, top=${top}`
  );
  popup?.focus();
  if (!popup) {
    throw new Error("Pop up window failed to open");
  }
  return popup;
}

export function closePopup(popup: Window | null) {
  if (popup && !popup.closed) {
    popup.close();
  }
}

export function closeThisPopup() {
  console.log("Closing this popup");
  window.opener.postMessage({ event: "PopupUnload" }, "*");
  const parent = window.self;
  parent.opener = window.self;
  parent.close();
}

/**
 * TODO: consolidate all UI related helper functions,
 * ones making window.xxx() document.yyy() calls.
 * e.g. WLMobileRelayUI, WalletLinkRelay, ...
 */
