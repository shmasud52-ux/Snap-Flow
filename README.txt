SNAPFLOW FINAL MONETAG MINI APP
================================
Zone ID: 12174319

Includes:
- Telegram Mini App SDK
- Monetag In-App Interstitial using the supplied settings
- Rewarded Interstitial: show_12174319()
- Rewarded Popup: show_12174319('pop')
- 10 local points after the rewarded SDK promise resolves
- Local username, points, activity history
- CSV, XLSX and JSON export
- Photo feed, timer, pause/play, vertical swipe

IMPORTANT:
- Points are local-only, have no cash value and cannot be withdrawn.
- LocalStorage is device/browser-specific and can be cleared or edited. This is not fraud-proof.
- Monetag ad availability, approval, fill and completion behavior depend on the publisher account, region and SDK.
- Test both rewarded formats in the live Telegram Mini App before launching.
- In-app interstitial frequency is controlled by Monetag. It does not guarantee a fixed 1-photo-to-4-ad ratio.
- Ad clicks never earn points. Points are only added after the rewarded SDK promise resolves.
- No backend/cloud database is included. Username, points and history remain on this device.
- Keep all files together at the root of the GitHub repository; Vercel should redeploy automatically.
