SNAPFLOW STARTER PACKAGE

Upload these 7 files to the ROOT of your GitHub repository:
index.html
style.css
photos.js
ads.js
app.js
manifest.webmanifest
vercel.json

Then import the GitHub repository into Vercel and deploy.

MONETAG:
- Add the exact Telegram Mini App SDK snippet from your Monetag dashboard to index.html.
- Replace YOUR_REWARDED_ZONE_ID in ads.js with your rewarded zone ID.
- Confirm the SDK function name and reward callback format against your account's current Monetag documentation before production.

IMPORTANT:
This is a starter prototype, not a fully monetized production app.
Automatic 1 photo : 4 ad placements are NOT implemented yet.
adViews and adClicks are placeholder counters.
Reward points are demo-only, not cash and not withdrawable.
Real reward verification/payout requires a secure backend/server-side postback.
LocalStorage data stays on this browser/device and can be lost if site data is cleared.
Sample Unsplash images are remote demo images; use images you have permission to publish.
