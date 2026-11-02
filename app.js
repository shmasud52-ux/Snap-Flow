const $=id=>document.getElementById(id),KEY="snapflow_data_v1";
let state;try{state=JSON.parse(localStorage.getItem(KEY)||"null")}catch(e){state=null}
if(!state)state={username:"",timer:3,points:0,photoViews:0,adViews:0,adClicks:0,rewards:[],activity:[]};
state.activity=Array.isArray(state.activity)?state.activity:[];state.rewards=Array.isArray(state.rewards)?state.rewards:[];
function save(){localStorage.setItem(KEY,JSON.stringify(state))}
function log(type,details={}){state.activity.push({type,date:new Date().toISOString(),...details});save()}
function setupName(){if(!state.username){state.username=(prompt("Welcome to SnapFlow! Enter username:")||"").trim()||"Guest";save()}$("username").textContent=state.username}
$("changeNameBtn").onclick=()=>{let n=prompt("New username:",state.username);if(n&&n.trim()){state.username=n.trim();log("username_changed");update()}}
let index=0,interval=null,paused=false,startY=0;
function showPhoto(){if(!photoPosts.length)return;let p=photoPosts[index];$("photo").src=p.image;$("photoTitle").textContent=p.title;$("photoAuthor").textContent="@"+p.author;$("feedCount").textContent=`Photo ${index+1} / ${photoPosts.length}`;state.photoViews++;log("photo_view",{postId:p.id});update();startTimer()}
function next(){index=(index+1)%photoPosts.length;showPhoto()}
function startTimer(){clearInterval(interval);let elapsed=0;paused=false;$("pauseBtn").textContent="Ⅱ";$("feedStatus").textContent="Auto Play";$("progressBar").style.width="0%";interval=setInterval(()=>{if(paused)return;elapsed++;$("progressBar").style.width=Math.min(elapsed/state.timer*100,100)+"%";if(elapsed>=state.timer)next()},1000)}
$("pauseBtn").onclick=()=>{paused=!paused;$("pauseBtn").textContent=paused?"▶":"Ⅱ";$("feedStatus").textContent=paused?"Paused":"Auto Play"};
$("nextBtn").onclick=next;
function changeTimer(){let v=prompt("Timer: 1, 3 or 5 seconds",String(state.timer));if(["1","3","5"].includes(v)){state.timer=+v;save();$("timerBtn").textContent=v+"s";startTimer()}}
$("timerBtn").onclick=changeTimer;$("timerSettingBtn").onclick=changeTimer;
$("feed").addEventListener("touchstart",e=>startY=e.changedTouches[0].screenY,{passive:true});
$("feed").addEventListener("touchend",e=>{let d=startY-e.changedTouches[0].screenY;if(d>50)next();else if(d< -50){index=Math.max(0,index-1);showPhoto()}},{passive:true});
document.querySelectorAll(".nav-btn").forEach(b=>b.onclick=()=>{document.querySelectorAll(".page").forEach(p=>p.classList.remove("active"));$(b.dataset.page).classList.add("active");document.querySelectorAll(".nav-btn").forEach(n=>n.classList.remove("active"));b.classList.add("active");if(b.dataset.page!=="homePage")clearInterval(interval);else startTimer();update()});
$("watchRewardBtn").onclick=async()=>{let b=$("watchRewardBtn");b.disabled=true;b.textContent="Loading Ad...";try{let r=await showRewardedAd();if(r.success){state.points+=10;state.rewards.push({points:10,date:new Date().toISOString()});log("demo_reward",{points:10});alert("10 demo points added.")}else alert("Reward not confirmed. No points added.")}catch(e){console.error(e);alert("Rewarded ad unavailable. Configure Monetag SDK first.")}b.disabled=false;b.textContent="Watch Rewarded Ad";update()};
function update(){$("username").textContent=state.username;$("points").textContent=state.points;$("photoViews").textContent=state.photoViews;$("adViews").textContent=state.adViews;$("adClicks").textContent=state.adClicks;$("totalRewards").textContent=state.rewards.length;$("rewardHistory").replaceChildren();[...state.rewards].reverse().forEach(r=>{let d=document.createElement("div");d.className="history-item";d.textContent=`+${r.points} demo points • ${new Date(r.date).toLocaleString()}`;$("rewardHistory").appendChild(d)})}
function download(data,name,type){let u=URL.createObjectURL(new Blob([data],{type})),a=document.createElement("a");a.href=u;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(u),1000)}
$("exportJSON").onclick=()=>download(JSON.stringify(state,null,2),"snapflow-activity.json","application/json");
$("exportCSV").onclick=()=>{let rows=[["Username","Activity","Date","Post ID","Points"],...state.activity.map(x=>[state.username,x.type,x.date,x.postId||"",x.points||""])];let csv=rows.map(r=>r.map(v=>`"${String(v).replace(/"/g,'""')}"`).join(",")).join("\n");download("\uFEFF"+csv,"snapflow-activity.csv","text/csv;charset=utf-8")};
$("exportExcel").onclick=()=>{if(!window.XLSX){alert("Excel library not loaded.");return}let ws=XLSX.utils.json_to_sheet(state.activity.map(x=>({Username:state.username,Activity:x.type,Date:x.date,PostID:x.postId||"",Points:x.points||""})));let wb=XLSX.utils.book_new();XLSX.utils.book_append_sheet(wb,ws,"Activity");XLSX.writeFile(wb,"snapflow-activity.xlsx")};
function init(){let tg=window.Telegram?.WebApp;if(tg){tg.ready();tg.expand();try{tg.setHeaderColor("#090d18");tg.setBackgroundColor("#090d18")}catch(e){}}setupName();$("timerBtn").textContent=state.timer+"s";showPhoto();update()}init();