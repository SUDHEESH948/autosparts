// Cross-tab and in-app synchronization for products

const SYNC_CHANNEL_NAME = "auto_parts_products_sync";
const STORAGE_KEY = "auto_parts_products_last_updated";

let broadcastChannel = null;
try {
  if (typeof window !== "undefined" && "BroadcastChannel" in window) {
    broadcastChannel = new BroadcastChannel(SYNC_CHANNEL_NAME);
  }
} catch {
  // BroadcastChannel not available in older environments
}

/**
 * Trigger this whenever a seller adds, updates, or deletes a product
 */
export const notifyProductsChanged = (detail = {}) => {
  const timestamp = Date.now();

  if (typeof window === "undefined") return;

  // 1. Same-window custom DOM event
  try {
    window.dispatchEvent(
      new CustomEvent("productsUpdated", {
        detail: { timestamp, ...detail },
      })
    );
  } catch {}

  // 2. Cross-tab localStorage event
  try {
    localStorage.setItem(STORAGE_KEY, String(timestamp));
  } catch {}

  // 3. Modern BroadcastChannel
  try {
    if (broadcastChannel) {
      broadcastChannel.postMessage({
        type: "PRODUCTS_UPDATED",
        timestamp,
        ...detail,
      });
    }
  } catch {}
};

/**
 * Listen for product mutations across all tabs and the current window
 */
export const subscribeToProductsChanged = (callback) => {
  if (typeof window === "undefined") return () => {};

  const onCustomEvent = (e) => {
    callback(e.detail || {});
  };

  const onStorageEvent = (e) => {
    if (e.key === STORAGE_KEY && e.newValue) {
      callback({ timestamp: Number(e.newValue) });
    }
  };

  const onBroadcastMessage = (e) => {
    if (e.data && e.data.type === "PRODUCTS_UPDATED") {
      callback(e.data);
    }
  };

  window.addEventListener("productsUpdated", onCustomEvent);
  window.addEventListener("storage", onStorageEvent);

  if (broadcastChannel) {
    broadcastChannel.addEventListener("message", onBroadcastMessage);
  }

  return () => {
    window.removeEventListener("productsUpdated", onCustomEvent);
    window.removeEventListener("storage", onStorageEvent);
    if (broadcastChannel) {
      broadcastChannel.removeEventListener("message", onBroadcastMessage);
    }
  };
};
