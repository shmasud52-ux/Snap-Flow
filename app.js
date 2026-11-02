(() => {
  "use strict";
  const KEY = "snapflow_local_v1", $ = id => document.getElementById(id);
  const photos = window.SNAPFLOW_PHOTOS || [];
  const defaults = {username:"",points:0,viewed:0,clicked:0,photoViews:0,activities:[],liked:[]};
  let data; try { data={...defaults,...JSON.parse(localStorage.getItem(KEY)||"{}")}; } catch { data={...defaults}; }
  let position=0,timerId=null,progressId=null,startedAt=0,paused=false,duration=3000,touchY=null,touchX=null,rewardBusy=false;
  const save=()=>localStorage.setItem(KEY,JSON.stringify(data));
  function toast(s){const e=$("toast");e.textContent=s;e.classList.add("show");setTimeout(()=>e.classList.remove("show"),2200);}
  function escapeHtml(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
  function log(type,id,extra={}){data.activities.unshift({username:data.username,datetime:new Date().toISOString(),activity:type,content_id:id,views:extra.views||0,clicks:extra.clicks||0,points:extra.points||0});data.activities=data.activities.slice(0,5000);save();renderStats();}
  function renderStats(){
    $("pointsValue").textContent=data.points;$("viewsValue").textContent=data.viewed;$("clicksValue").textContent=data.clicked;
    $("earnedValue").textContent=data.points;$("photosValue").textContent=data.photoViews;
    $("profileName").textContent=data.username||"Guest";$("avatarLetter").textContent=(data.username||"U").trim().charAt(0).toUpperCase();$("renameInput").value=data.username||"";
    $("historyList").innerHTML=data.activities.length?data.activities.slice(0,12).map(a=>`<div class="history-item">${escapeHtml(a.activity)} · ${escapeHtml(a.content_id)}<span>${escapeHtml(a.username)} · ${new Date(a.datetime).toLocaleString()}${a.points?" · +"+a.points+" points":""}</span></div>`).join(""):'<p class="muted">No activity yet.</p>';
  }
  function current(){return photos.length?photos[position%photos.length]:{id:"P-DEMO",image:"",title:"Add your photos",caption:"Edit photos.js to add content.",creator:"@snapflow"};}
  function stopTimer(){clearTimeout(timerId);clearInterval(progressId);timerId=progressId=null;}
  function startTimer(){stopTimer();if(paused||!$("homePage").classList.contains("active"))return;duration=Number($("timerSelect").value)*1000;startedAt=Date.now();$("progressBar").style.width="0%";progressId=setInterval(()=>$("progressBar").style.width=Math.min(100,(Date.now()-startedAt)/duration*100)+"%",80);timerId=setTimeout(next,duration);}
  function showItem(){
    const item=current();$("feedImage").src=item.image||"";$("feedImage").alt=item.title||"Photo";$("feedLabel").textContent="PHOTO POST";$("feedLabel").classList.remove("ad");
    $("feedCreator").textContent=item.creator||"@snapflow";$("feedTitle").textContent=item.title||"SnapFlow";$("feedCaption").textContent=item.caption||"";
    $("adAction").classList.add("hidden");$("likeBtn").classList.remove("hidden");$("feedCounter").textContent=String(position+1).padStart(2,"0")+" / "+String(Math.max(photos.length,1)).padStart(2,"0");
    data.photoViews++;log("Photo viewed",item.id,{views:1});
    $("likeBtn").onclick=()=>{if(!data.liked.includes(item.id)){data.liked.push(item.id);save();toast("Liked");}else toast("Already liked");};startTimer();
  }
  function next(){position=(position+1)%Math.max(photos.length,1);showItem();}
  function prev(){position=(position-1+Math.max(photos.length,1))%Math.max(photos.length,1);showItem();}
  function setPage(page){["home","rewards","profile"].forEach(p=>$(p+"Page").classList.toggle("active",p===page));document.querySelectorAll(".nav-btn").forEach(b=>b.classList.toggle("active",b.dataset.page===page));if(page==="home"){if(!paused)startTimer();}else stopTimer();}
  function download(name,content,type){const blob=new Blob([content],{type}),url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
  function exportRows(){return data.activities.map(a=>({...a,datetime:new Date(a.datetime).toLocaleString()}));}
  function exportCsv(){const rows=exportRows(),keys=["username","datetime","activity","content_id","views","clicks","points"];const csv=[keys.join(","),...rows.map(r=>keys.map(k=>`"${String(r[k]??"").replace(/"/g,'""')}"`).join(","))].join("\n");download("snapflow-activity.csv","\ufeff"+csv,"text/csv;charset=utf-8");}
  function exportXlsx(){if(window.XLSX){const ws=XLSX.utils.json_to_sheet(exportRows()),wb=XLSX.utils.book_new();XLSX.utils.book_append_sheet(wb,ws,"Activity");XLSX.writeFile(wb,"snapflow-activity.xlsx");}else{exportCsv();toast("Excel library unavailable; CSV downloaded.");}}
  async function earn(kind){
    if(rewardBusy)return;if(!data.username){toast("Set your username first.");return;}
    if(!window.SnapFlowAds?.isReady()){toast("Monetag SDK not ready. Check connection and reload.");$("rewardStatus").textContent="SDK unavailable; no points added.";return;}
    rewardBusy=true;$("rewardInterstitialBtn").disabled=$("rewardPopupBtn").disabled=true;$("rewardStatus").textContent="Loading rewarded ad…";
    try{
      if(kind==="popup")await window.SnapFlowAds.showRewardedPopup();else await window.SnapFlowAds.showRewardedInterstitial();
      data.points+=10;data.viewed++;log("Rewarded ad completed",kind==="popup"?"MONETAG-REWARDED-POPUP":"MONETAG-REWARDED-INTERSTITIAL",{views:1,points:10});
      $("rewardStatus").textContent="Ad completed. +10 local points added.";toast("+10 points earned!");
    }catch(e){console.warn(e);$("rewardStatus").textContent="Ad unavailable or not completed. No points added.";toast("No points added. Try again later.");}
    finally{rewardBusy=false;$("rewardInterstitialBtn").disabled=$("rewardPopupBtn").disabled=false;}
  }
  $("startBtn").onclick=()=>{const n=$("nameInput").value.trim();if(!n)return;data.username=n;save();$("nameGate").classList.add("hidden");renderStats();showItem();};
  $("nameInput").addEventListener("keydown",e=>{if(e.key==="Enter")$("startBtn").click();});
  $("timerSelect").onchange=startTimer;$("pauseBtn").onclick=()=>{paused=!paused;$("pauseBtn").textContent=paused?"▶":"Ⅱ";if(paused)stopTimer();else startTimer();};
  $("nextBtn").onclick=next;$("shareBtn").onclick=async()=>{try{await navigator.share({title:"SnapFlow",text:"Check out SnapFlow"});}catch{toast("Share unavailable.");}};
  document.querySelectorAll(".nav-btn").forEach(b=>b.onclick=()=>setPage(b.dataset.page));
  $("rewardInterstitialBtn").onclick=()=>earn("interstitial");$("rewardPopupBtn").onclick=()=>earn("popup");
  $("renameBtn").onclick=()=>{const n=$("renameInput").value.trim();if(!n)return toast("Enter a name first");data.username=n;save();renderStats();toast("Username saved");};
  $("xlsxBtn").onclick=exportXlsx;$("csvBtn").onclick=exportCsv;$("jsonBtn").onclick=()=>download("snapflow-backup.json",JSON.stringify(data,null,2),"application/json");
  $("resetBtn").onclick=()=>{if(confirm("Delete all local SnapFlow data?")){localStorage.removeItem(KEY);location.reload();}};
  $("feedStage").addEventListener("touchstart",e=>{touchY=e.changedTouches[0].clientY;touchX=e.changedTouches[0].clientX;},{passive:true});
  $("feedStage").addEventListener("touchend",e=>{if(touchY===null)return;const dy=e.changedTouches[0].clientY-touchY,dx=e.changedTouches[0].clientX-touchX;if(Math.abs(dy)>45&&Math.abs(dy)>Math.abs(dx)){dy<0?next():prev();}touchY=touchX=null;},{passive:true});
  $("feedStage").addEventListener("wheel",e=>{if(Math.abs(e.deltaY)>15){e.deltaY>0?next():prev();}},{passive:true});
  document.addEventListener("visibilitychange",()=>{if(document.hidden)stopTimer();else if(!paused&&$("homePage").classList.contains("active"))startTimer();});
  renderStats();if(!data.username)$("nameGate").classList.remove("hidden");else showItem();
  if(window.Telegram?.WebApp){Telegram.WebApp.ready();Telegram.WebApp.expand();}
  window.addEventListener("load",()=>setTimeout(()=>window.SnapFlowAds?.showInAppInterstitial(),5000));
})();