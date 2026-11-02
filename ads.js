/*
 SnapFlow ad adapter. Replace this file when changing ad networks.
 Add the exact Monetag TMA SDK snippet supplied in your dashboard to index.html.
 Replace the placeholder zone ID with your rewarded zone ID.
 Never put passwords, bot tokens or private keys in frontend files.
 Real rewards require secure server-side verification; this starter is demo-only.
*/
const MONETAG_REWARDED_ZONE_ID="YOUR_REWARDED_ZONE_ID";
async function showRewardedAd(){
 const fn=window["show_"+MONETAG_REWARDED_ZONE_ID];
 if(!MONETAG_REWARDED_ZONE_ID||MONETAG_REWARDED_ZONE_ID==="YOUR_REWARDED_ZONE_ID"||typeof fn!=="function"){
  throw new Error("Monetag Rewarded SDK is not configured.");
 }
 const result=await fn();
 if(result&&result.reward_event_type==="valued")return {success:true};
 return {success:false};
}