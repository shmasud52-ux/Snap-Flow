/* SnapFlow Monetag integration — Zone 12174319 */
(() => {
  "use strict";
  const zone = "show_12174319";
  const ready = () => typeof window[zone] === "function";

  function showInAppInterstitial() {
    if (!ready()) return false;
    try {
      window[zone]({
        type: "inApp",
        inAppSettings: {
          frequency: 2,
          capping: 0.1,
          interval: 30,
          timeout: 5,
          everyPage: false
        }
      });
      return true;
    } catch (e) {
      console.error("Monetag in-app error", e);
      return false;
    }
  }
  function showRewardedInterstitial() {
    if (!ready()) return Promise.reject(new Error("Monetag SDK is not ready."));
    return window[zone]();
  }
  function showRewardedPopup() {
    if (!ready()) return Promise.reject(new Error("Monetag SDK is not ready."));
    return window[zone]("pop");
  }
  window.SnapFlowAds = { isReady: ready, showInAppInterstitial, showRewardedInterstitial, showRewardedPopup };
})();