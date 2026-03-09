import { useState, useEffect, useRef } from "react";

const PING_MESSAGES = ["HAIIAIAAIIAAIIAIA","HALLOOOOOOO","☹️☹️☹️☹️☹️☹️","HIYA","HALLO"];
const USERS = ["Frankocean","Funnya"];
const PING_SOUNDS = [{label:"chime 🔔",id:"chime"},{label:"boing 🎵",id:"boing"},{label:"beep 📟",id:"beep"},{label:"pop 🫧",id:"pop"}];

function playSound(id) {
  try {
    const ctx=new(window.AudioContext||window.webkitAudioContext)();
    if(id==="chime"){[523,659,784,1047].forEach((f,i)=>{const o=ctx.createOscillator(),g=ctx.createGain();o.connect(g);g.connect(ctx.destination);o.type="sine";const t=ctx.currentTime+i*0.13;o.frequency.setValueAtTime(f,t);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(0.28,t+0.03);g.gain.exponentialRampToValueAtTime(0.001,t+0.28);o.start(t);o.stop(t+0.3);});}
    else if(id==="boing"){const o=ctx.createOscillator(),g=ctx.createGain();o.connect(g);g.connect(ctx.destination);o.type="sine";o.frequency.setValueAtTime(200,ctx.currentTime);o.frequency.exponentialRampToValueAtTime(600,ctx.currentTime+0.15);o.frequency.exponentialRampToValueAtTime(300,ctx.currentTime+0.4);g.gain.setValueAtTime(0.3,ctx.currentTime);g.gain.exponentialRampToValueAtTime(0.001,ctx.currentTime+0.5);o.start(ctx.currentTime);o.stop(ctx.currentTime+0.5);}
    else if(id==="beep"){const o=ctx.createOscillator(),g=ctx.createGain();o.connect(g);g.connect(ctx.destination);o.type="square";o.frequency.setValueAtTime(880,ctx.currentTime);g.gain.setValueAtTime(0.1,ctx.currentTime);g.gain.exponentialRampToValueAtTime(0.001,ctx.currentTime+0.12);o.start(ctx.currentTime);o.stop(ctx.currentTime+0.12);}
    else if(id==="pop"){const o=ctx.createOscillator(),g=ctx.createGain();o.connect(g);g.connect(ctx.destination);o.type="sine";o.frequency.setValueAtTime(1200,ctx.currentTime);o.frequency.exponentialRampToValueAtTime(200,ctx.currentTime+0.08);g.gain.setValueAtTime(0.25,ctx.currentTime);g.gain.exponentialRampToValueAtTime(0.001,ctx.currentTime+0.1);o.start(ctx.currentTime);o.stop(ctx.currentTime+0.1);}
  } catch(e){}
}
function playSendSound(){try{const ctx=new(window.AudioContext||window.webkitAudioContext)();const o=ctx.createOscillator(),g=ctx.createGain();o.connect(g);g.connect(ctx.destination);o.type="sine";o.frequency.setValueAtTime(440,ctx.currentTime);o.frequency.linearRampToValueAtTime(880,ctx.currentTime+0.1);g.gain.setValueAtTime(0.15,ctx.currentTime);g.gain.exponentialRampToValueAtTime(0.001,ctx.currentTime+0.2);o.start(ctx.currentTime);o.stop(ctx.currentTime+0.22);}catch(e){}}

function checkWinner(b){const lines=[[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];for(const[a,c,d]of lines)if(b[a]&&b[a]===b[c]&&b[a]===b[d])return b[a];return b.every(Boolean)?"draw":null;}

const makeCss=(dark)=>`
  @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&family=Nunito:wght@400;600;700;800;900&display=swap');
  *{box-sizing:border-box;margin:0;padding:0;}
  body{background:${dark?"#0d0d0d":"#f5f5f0"};}
  @keyframes bob{0%,100%{transform:translateY(0) rotate(-3deg)}50%{transform:translateY(-10px) rotate(3deg)}}
  @keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
  @keyframes popIn{from{opacity:0;transform:scale(0.65) translateY(-20px)}to{opacity:1;transform:scale(1) translateY(0)}}
  @keyframes shake{0%,100%{transform:translateX(0)}15%{transform:translateX(-9px)}35%{transform:translateX(9px)}55%{transform:translateX(-6px)}75%{transform:translateX(4px)}}
  @keyframes chromePulse{0%,100%{box-shadow:0 0 0 0 rgba(150,150,150,0.4),0 8px 40px rgba(0,0,0,0.3),inset 0 1px 0 rgba(255,255,255,0.4);}50%{box-shadow:0 0 0 18px rgba(150,150,150,0),0 8px 40px rgba(0,0,0,0.3),inset 0 1px 0 rgba(255,255,255,0.4);}}
  @keyframes blink{0%,100%{opacity:1}50%{opacity:0.15}}
  @keyframes sweep{0%{left:-75%}60%,100%{left:125%}}
  @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}
  @keyframes wiggle{0%,100%{transform:rotate(-4deg)}50%{transform:rotate(4deg)}}
  @keyframes easterWiggle{0%,100%{transform:scale(1) rotate(0deg)}25%{transform:scale(1.08) rotate(-3deg)}75%{transform:scale(1.08) rotate(3deg)}}
  @keyframes dotBounce{0%,80%,100%{transform:translateY(0)}40%{transform:translateY(-5px)}}
  @keyframes streakPop{0%{transform:scale(0.6)}60%{transform:scale(1.2)}100%{transform:scale(1)}}
  @keyframes floatUp{0%{transform:translateY(0);opacity:1}100%{transform:translateY(-60px);opacity:0}}
  @keyframes winPop{0%{transform:scale(0.8)}60%{transform:scale(1.15)}100%{transform:scale(1)}}

  .glass{background:${dark?"rgba(255,255,255,0.035)":"rgba(0,0,0,0.025)"};backdrop-filter:blur(18px);-webkit-backdrop-filter:blur(18px);border:1px solid ${dark?"rgba(255,255,255,0.08)":"rgba(0,0,0,0.08)"};position:relative;overflow:hidden;}
  .glass::before{content:'';position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,${dark?"rgba(255,255,255,0.18)":"rgba(0,0,0,0.06)"},transparent);pointer-events:none;}
  .pbtn{transition:all 0.18s !important;position:relative;overflow:hidden;}
  .pbtn:hover{transform:scale(1.07) !important;opacity:0.85;}
  .pbtn:active{transform:scale(0.95) !important;}
  .pingbtn{transition:transform 0.14s,filter 0.2s !important;position:relative;overflow:hidden;}
  .pingbtn::after{content:'';position:absolute;top:0;left:-75%;width:50%;height:100%;background:linear-gradient(90deg,transparent,rgba(255,255,255,0.28),transparent);transform:skewX(-20deg);animation:sweep 3s infinite;}
  .pingbtn:hover{transform:scale(1.08) !important;filter:brightness(1.1) !important;}
  .pingbtn:active{transform:scale(0.90) !important;}
  .pingbtn-easter{animation:easterWiggle 0.4s ease infinite !important;}
  .dmbtn{transition:all 0.15s !important;}
  .dmbtn:hover{opacity:0.7;}
  .ping-row{transition:background 0.18s;}
  .tab-btn{transition:all 0.2s !important;}
  .chat-input:focus{outline:none !important;}
  .chat-input::placeholder{color:${dark?"#2a2a2a":"#ccc"};}
  .star{position:fixed;pointer-events:none;font-size:10px;opacity:0.15;animation:float 3s ease-in-out infinite;}
  .dot{display:inline-block;width:5px;height:5px;border-radius:50%;background:${dark?"#555":"#bbb"};margin:0 2px;animation:dotBounce 1.2s infinite;}
  .sound-btn{transition:all 0.15s !important;}
  .ttt-cell{transition:all 0.15s !important;cursor:pointer;}
  .toggle-btn{transition:all 0.3s !important;}
`;

const STARS=["✦","✧","⋆","·","✦","✧","⋆","·","✦","✧","⋆","·","✦","✧"];
const STAR_POS=[[8,12],[18,70],[30,35],[42,88],[55,20],[65,60],[75,10],[85,80],[92,45],[12,55],[48,5],[22,90],[70,30],[90,15]];
const TABS=[{id:"ping",label:"📡"},{id:"chat",label:"💬"},{id:"game",label:"🎮"}];

// Simple in-memory storage (replaces window.storage for web deployment)
const memStore = {};
const storage = {
  async get(key, shared) {
    const k = shared ? `shared_${key}` : key;
    return memStore[k] ? { key, value: memStore[k], shared } : null;
  },
  async set(key, value, shared) {
    const k = shared ? `shared_${key}` : key;
    memStore[k] = value;
    return { key, value, shared };
  }
};

export default function PingApp() {
  const [myName,setMyName]             = useState(null);
  const [dark,setDark]                 = useState(true);
  const [tab,setTab]                   = useState("ping");
  const [pings,setPings]               = useState([]);
  const [messages,setMessages]         = useState([]);
  const [chatInput,setChatInput]       = useState("");
  const [onlineStatus,setOnlineStatus] = useState({});
  const [alert,setAlert]               = useState(null);
  const [alertShake,setAlertShake]     = useState(false);
  const [sending,setSending]           = useState(false);
  const [easterEgg,setEasterEgg]       = useState(false);
  const [pingSound,setPingSound]       = useState("chime");
  const [showSounds,setShowSounds]     = useState(false);
  const [streak,setStreak]             = useState(0);
  const [streakAnim,setStreakAnim]     = useState(false);
  const [isTyping,setIsTyping]         = useState(false);
  const [tttBoard,setTttBoard]         = useState(Array(9).fill(null));
  const [tttTurn,setTttTurn]           = useState("X");
  const [tttWinner,setTttWinner]       = useState(null);
  const [mySymbol,setMySymbol]         = useState(null);

  const seenIds    = useRef(new Set());
  const seenMsgIds = useRef(new Set());
  const spamCount  = useRef(0);
  const spamTimer  = useRef(null);
  const streakTimer= useRef(null);
  const typingTimer= useRef(null);
  const chatBottom = useRef(null);
  const otherName  = myName==="Frankocean"?"Funnya":"Frankocean";

  useEffect(()=>{chatBottom.current?.scrollIntoView({behavior:"smooth"});},[messages,isTyping]);

  useEffect(()=>{
    if(!myName)return;
    const beat=async()=>{try{await storage.set(`online_${myName}`,Date.now().toString(),true);}catch(e){}};
    beat();const hb=setInterval(beat,5000);
    return()=>{clearInterval(hb);try{storage.set(`online_${myName}`,"0",true);}catch(e){}};
  },[myName]);

  useEffect(()=>{
    if(!myName)return;
    const poll=async()=>{
      const statuses={};
      for(const u of USERS){try{const res=await storage.get(`online_${u}`,true);const ts=res?parseInt(res.value):0;statuses[u]=ts>0&&Date.now()-ts<12000;}catch(e){statuses[u]=false;}}
      setOnlineStatus(statuses);
      try{const res=await storage.get(`typing_${otherName}`,true);const ts=res?parseInt(res.value):0;setIsTyping(ts>0&&Date.now()-ts<4000);}catch(e){}
      try{
        const res=await storage.get("pings_v3",true);const list=res?JSON.parse(res.value):[];
        setPings(list.slice(-30));
        const myNew=list.filter(p=>p.to===myName&&!seenIds.current.has(p.id));
        myNew.forEach(p=>seenIds.current.add(p.id));
        if(myNew.length>0){
          const latest=myNew[myNew.length-1];
          playSound(pingSound);
          setAlert({from:latest.from,msg:latest.msg});setAlertShake(true);setTimeout(()=>setAlertShake(false),600);
          setStreak(s=>{const n=s+myNew.length;setStreakAnim(true);setTimeout(()=>setStreakAnim(false),400);return n;});
          clearTimeout(streakTimer.current);streakTimer.current=setTimeout(()=>setStreak(0),30000);
        }
      }catch(e){}
      try{const res=await storage.get("chat_v1",true);const list=res?JSON.parse(res.value):[];const myNew=list.filter(m=>m.from!==myName&&!seenMsgIds.current.has(m.id));myNew.forEach(m=>seenMsgIds.current.add(m.id));setMessages(list.slice(-60));}catch(e){}
      try{const res=await storage.get("ttt_v1",true);if(res){const d=JSON.parse(res.value);setTttBoard(d.board);setTttTurn(d.turn);setTttWinner(d.winner||null);}}catch(e){}
    };
    poll();const iv=setInterval(poll,2000);return()=>clearInterval(iv);
  },[myName,pingSound]);

  const handleTyping=(val)=>{setChatInput(val);try{storage.set(`typing_${myName}`,Date.now().toString(),true);}catch(e){}clearTimeout(typingTimer.current);typingTimer.current=setTimeout(()=>{try{storage.set(`typing_${myName}`,"0",true);}catch(e){}},3000);};

  const sendPing=async()=>{
    if(!myName||sending)return;
    spamCount.current+=1;clearTimeout(spamTimer.current);spamTimer.current=setTimeout(()=>{spamCount.current=0;},1500);
    if(spamCount.current>=5){setEasterEgg(true);setTimeout(()=>{setEasterEgg(false);spamCount.current=0;},3000);return;}
    setSending(true);playSendSound();
    const msg=PING_MESSAGES[Math.floor(Math.random()*PING_MESSAGES.length)];
    const id=`${Date.now()}_${Math.random()}`;seenIds.current.add(id);
    try{const res=await storage.get("pings_v3",true);const list=res?JSON.parse(res.value):[];await storage.set("pings_v3",JSON.stringify([...list,{id,from:myName,to:otherName,msg,ts:Date.now()}].slice(-30)),true);}catch(e){}
    setTimeout(()=>setSending(false),700);
  };

  const sendMessage=async()=>{
    if(!myName||!chatInput.trim())return;
    const msg=chatInput.trim();setChatInput("");
    try{storage.set(`typing_${myName}`,"0",true);}catch(e){}
    playSendSound();
    const id=`${Date.now()}_${Math.random()}`;seenMsgIds.current.add(id);
    try{const res=await storage.get("chat_v1",true);const list=res?JSON.parse(res.value):[];await storage.set("chat_v1",JSON.stringify([...list,{id,from:myName,msg,ts:Date.now()}].slice(-60)),true);setMessages(prev=>[...prev,{id,from:myName,msg,ts:Date.now()}].slice(-60));}catch(e){}
  };

  const tttMove=async(i)=>{
    if(!mySymbol||tttBoard[i]||tttWinner||tttTurn!==mySymbol)return;
    const newBoard=[...tttBoard];newBoard[i]=mySymbol;
    const winner=checkWinner(newBoard);const nextTurn=mySymbol==="X"?"O":"X";
    const state={board:newBoard,turn:winner?tttTurn:nextTurn,winner:winner||null};
    setTttBoard(newBoard);setTttTurn(state.turn);setTttWinner(winner||null);
    try{await storage.set("ttt_v1",JSON.stringify(state),true);}catch(e){}
  };

  const resetTtt=async()=>{
    const state={board:Array(9).fill(null),turn:"X",winner:null};
    setTttBoard(state.board);setTttTurn("X");setTttWinner(null);
    try{await storage.set("ttt_v1",JSON.stringify(state),true);}catch(e){}
  };

  const isOtherOnline=onlineStatus[otherName]||false;
  const recentForMe=pings.filter(p=>p.to===myName).slice(-5).reverse();
  const css=makeCss(dark);

  const t=dark?{
    text:"#e4e4e4", muted:"#aaa", dim:"#555", vdim:"#2e2e2e",
    border:"rgba(255,255,255,0.08)", glassB:"rgba(255,255,255,0.035)",
    tabAB:"rgba(255,255,255,0.08)", tabABorder:"rgba(255,255,255,0.18)",
    msgMe:"rgba(255,255,255,0.08)", msgOther:"rgba(255,255,255,0.04)",
    bg:"linear-gradient(160deg,#0a0a0a 0%,#111 60%,#0d0d0d 100%)",
  }:{
    text:"#111", muted:"#555", dim:"#bbb", vdim:"#ddd",
    border:"rgba(0,0,0,0.08)", glassB:"rgba(0,0,0,0.025)",
    tabAB:"rgba(0,0,0,0.06)", tabABorder:"rgba(0,0,0,0.12)",
    msgMe:"rgba(0,0,0,0.06)", msgOther:"rgba(0,0,0,0.03)",
    bg:"linear-gradient(160deg,#f0f0eb 0%,#fafaf7 60%,#ededea 100%)",
  };

  const StarField=()=>STARS.map((s,i)=>(
    <div key={i} className="star" style={{left:`${STAR_POS[i][0]}%`,top:`${STAR_POS[i][1]}%`,animationDelay:`${i*0.22}s`,animationDuration:`${2.5+(i%4)*0.5}s`,color:dark?"rgba(255,255,255,0.6)":"rgba(0,0,0,0.2)"}}>{s}</div>
  ));
  const Grid=()=><div style={{position:"fixed",inset:0,opacity:dark?0.025:0.04,backgroundImage:`linear-gradient(${dark?"rgba(255,255,255,0.8)":"rgba(0,0,0,0.4)"} 1px,transparent 1px),linear-gradient(90deg,${dark?"rgba(255,255,255,0.8)":"rgba(0,0,0,0.4)"} 1px,transparent 1px)`,backgroundSize:"40px 40px",pointerEvents:"none",zIndex:0}}/>;

  if(!myName) return(
    <div style={{minHeight:"100vh",background:t.bg,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",fontFamily:"'Nunito',sans-serif",padding:24,position:"relative",overflow:"hidden"}}>
      <style>{css}</style><StarField/><Grid/>
      <div style={{position:"relative",zIndex:1,display:"flex",flexDirection:"column",alignItems:"center"}}>
        <div style={{fontSize:62,marginBottom:16,animation:"bob 2s ease-in-out infinite"}}>🌙</div>
        <h1 style={{color:t.text,fontSize:30,fontWeight:900,margin:"0 0 4px",letterSpacing:"-1px"}}>ping app ˚ʚ♡ɞ˚</h1>
        <p style={{color:t.dim,fontSize:11,margin:"0 0 46px",fontFamily:"'DM Mono'",letterSpacing:2,textTransform:"uppercase"}}>frankocean · funnya</p>
        <p style={{color:t.dim,fontSize:11,marginBottom:18,letterSpacing:3,textTransform:"uppercase",fontFamily:"'DM Mono'"}}>who r u ??</p>
        <div style={{display:"flex",gap:12,marginBottom:28}}>
          {USERS.map(name=>(
            <button key={name} className="pbtn" onClick={()=>setMyName(name)} style={{background:t.glassB,border:`1px solid ${t.border}`,color:t.text,padding:"13px 22px",borderRadius:16,fontFamily:"'Nunito'",fontWeight:800,fontSize:14,cursor:"pointer"}}>
              {name==="Frankocean"?"frankocean 🌊":"funnya 🌸"}
            </button>
          ))}
        </div>
        <button className="toggle-btn dmbtn" onClick={()=>setDark(d=>!d)} style={{background:"transparent",border:`1px solid ${t.border}`,color:t.muted,padding:"7px 18px",borderRadius:20,fontFamily:"'DM Mono'",fontSize:11,cursor:"pointer",letterSpacing:1}}>
          {dark?"☀️ light":"🌙 dark"}
        </button>
        <p style={{color:t.vdim,fontSize:11,marginTop:24,fontFamily:"'DM Mono'",letterSpacing:1}}>✦ made w love ✦</p>
      </div>
    </div>
  );

  return(
    <div style={{minHeight:"100vh",background:t.bg,fontFamily:"'Nunito',sans-serif",padding:"20px 18px 28px",display:"flex",flexDirection:"column",alignItems:"center",position:"relative",overflow:"hidden"}}>
      <style>{css}</style><StarField/><Grid/>

      {alert&&(
        <div onClick={()=>setAlert(null)} style={{position:"fixed",inset:0,background:dark?"rgba(0,0,0,0.9)":"rgba(255,255,255,0.85)",backdropFilter:"blur(16px)",zIndex:999,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}>
          <div onClick={e=>e.stopPropagation()} className="glass" style={{borderRadius:28,padding:"44px 38px",maxWidth:310,width:"88%",textAlign:"center",background:dark?"rgba(14,14,14,0.97)":"rgba(250,250,248,0.97)",border:`1px solid ${t.border}`,boxShadow:"0 40px 80px rgba(0,0,0,0.2)",animation:alertShake?"shake 0.5s ease, popIn 0.28s ease":"popIn 0.28s ease"}}>
            <div style={{fontSize:52,marginBottom:14,animation:"wiggle 0.6s ease-in-out infinite"}}>🔔</div>
            <div style={{marginBottom:6}}><span style={{fontSize:14}}>˚ʚ</span><span style={{color:t.muted,fontFamily:"'DM Mono'",fontSize:10,letterSpacing:3,textTransform:"uppercase",margin:"0 6px"}}>ping from {alert.from}</span><span style={{fontSize:14}}>ɞ˚</span></div>
            <div style={{color:t.text,fontSize:22,fontWeight:800,marginBottom:28,lineHeight:1.3,wordBreak:"break-word"}}>{alert.msg}</div>
            <button className="dmbtn" onClick={()=>setAlert(null)} style={{background:t.glassB,border:`1px solid ${t.border}`,color:t.muted,padding:"9px 24px",borderRadius:40,fontFamily:"'Nunito'",fontWeight:700,fontSize:13,cursor:"pointer"}}>ok ok i see u ˙ᵕ˙</button>
          </div>
        </div>
      )}

      {easterEgg&&(
        <div style={{position:"fixed",inset:0,background:dark?"rgba(0,0,0,0.92)":"rgba(255,255,255,0.9)",backdropFilter:"blur(16px)",zIndex:998,display:"flex",alignItems:"center",justifyContent:"center"}}>
          <div className="glass" style={{borderRadius:28,padding:"44px 38px",maxWidth:300,width:"88%",textAlign:"center",background:dark?"rgba(14,14,14,0.97)":"rgba(250,250,248,0.97)",border:`1px solid ${t.border}`,animation:"popIn 0.3s ease"}}>
            <div style={{fontSize:52,marginBottom:14}}>🥺</div>
            <div style={{color:t.text,fontSize:20,fontWeight:900,lineHeight:1.4}}>relax buddy</div>
            <div style={{color:t.muted,fontSize:14,marginTop:8,fontWeight:700}}>i still love you more 🤍</div>
          </div>
        </div>
      )}

      <div style={{width:"100%",maxWidth:390,marginBottom:14,display:"flex",justifyContent:"space-between",alignItems:"center",position:"relative",zIndex:1}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div>
            <div style={{color:t.dim,fontSize:9,letterSpacing:3,textTransform:"uppercase",marginBottom:2,fontFamily:"'DM Mono'"}}>hiii,</div>
            <div style={{color:t.text,fontSize:19,fontWeight:900}}>{myName} <span style={{fontSize:13}}>✦</span></div>
          </div>
          {streak>0&&(
            <div style={{background:t.glassB,border:`1px solid ${t.border}`,borderRadius:12,padding:"4px 10px",display:"flex",alignItems:"center",gap:4,animation:streakAnim?"streakPop 0.4s ease":"none"}}>
              <span style={{fontSize:14}}>🔥</span><span style={{color:t.muted,fontSize:13,fontWeight:900}}>{streak}</span>
            </div>
          )}
        </div>
        <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:5}}>
          <div style={{color:t.dim,fontSize:10,fontFamily:"'DM Mono'",letterSpacing:1,fontStyle:"italic"}}>i love u more 🤍</div>
          <div style={{display:"flex",gap:6}}>
            <button className="toggle-btn dmbtn" onClick={()=>setDark(d=>!d)} style={{background:"transparent",border:`1px solid ${t.border}`,color:t.muted,padding:"4px 8px",borderRadius:8,fontSize:13,cursor:"pointer"}}>{dark?"☀️":"🌙"}</button>
            <button onClick={()=>{setMyName(null);setAlert(null);}} className="dmbtn" style={{background:"transparent",border:`1px solid ${t.border}`,color:t.muted,padding:"4px 11px",borderRadius:8,fontFamily:"'Nunito'",fontWeight:700,fontSize:11,cursor:"pointer"}}>switch ↩</button>
          </div>
        </div>
      </div>

      <div className="glass" style={{width:"100%",maxWidth:390,borderRadius:18,padding:"11px 18px",marginBottom:14,border:`1px solid ${isOtherOnline?t.tabABorder:t.border}`,display:"flex",alignItems:"center",gap:10,position:"relative",zIndex:1,transition:"border-color 0.5s"}}>
        <div style={{width:7,height:7,borderRadius:"50%",flexShrink:0,background:isOtherOnline?dark?"#d0d0d0":"#555":"transparent",border:isOtherOnline?"none":`1px solid ${t.dim}`,boxShadow:isOtherOnline?`0 0 8px ${dark?"#fff":"#555"}`:"none",animation:isOtherOnline?"blink 2.5s infinite":"none",transition:"all 0.5s"}}/>
        <span style={{color:t.muted,fontWeight:800,fontSize:14}}>{otherName}</span>
        <span style={{fontSize:12}}>{isOtherOnline?"🤍":"🖤"}</span>
        <span style={{marginLeft:"auto",color:isOtherOnline?t.muted:t.dim,fontSize:10,fontFamily:"'DM Mono'",letterSpacing:2,textTransform:"uppercase"}}>{isOtherOnline?"online":"offline"}</span>
      </div>

      <div style={{width:"100%",maxWidth:390,marginBottom:16,display:"flex",gap:8,position:"relative",zIndex:1}}>
        {TABS.map(tb=>(
          <button key={tb.id} className="tab-btn" onClick={()=>setTab(tb.id)} style={{flex:1,padding:"10px 0",borderRadius:14,fontFamily:"'Nunito'",fontWeight:800,fontSize:20,cursor:"pointer",border:"1px solid",background:tab===tb.id?t.tabAB:"transparent",borderColor:tab===tb.id?t.tabABorder:t.border,color:tab===tb.id?t.text:t.dim}}>
            {tb.label}
          </button>
        ))}
      </div>

      {tab==="ping"&&(
        <div style={{width:"100%",maxWidth:390,display:"flex",flexDirection:"column",alignItems:"center",position:"relative",zIndex:1}}>
          <div style={{marginBottom:14,width:"100%",position:"relative"}}>
            <button onClick={()=>setShowSounds(s=>!s)} className="dmbtn" style={{background:t.glassB,border:`1px solid ${t.border}`,color:t.muted,padding:"7px 14px",borderRadius:10,fontFamily:"'DM Mono'",fontSize:10,cursor:"pointer",letterSpacing:1,width:"100%",textAlign:"left"}}>
              ping sound: {PING_SOUNDS.find(s=>s.id===pingSound)?.label} {showSounds?"▲":"▼"}
            </button>
            {showSounds&&(
              <div className="glass" style={{position:"absolute",top:"calc(100% + 6px)",left:0,right:0,borderRadius:12,padding:8,zIndex:10,display:"flex",gap:6,flexWrap:"wrap"}}>
                {PING_SOUNDS.map(s=>(
                  <button key={s.id} className={`sound-btn${pingSound===s.id?" active":""}`} onClick={()=>{setPingSound(s.id);playSound(s.id);setShowSounds(false);}} style={{flex:1,padding:"8px 10px",borderRadius:10,background:pingSound===s.id?t.tabAB:"transparent",border:`1px solid ${pingSound===s.id?t.tabABorder:t.border}`,color:pingSound===s.id?t.text:t.muted,fontFamily:"'Nunito'",fontWeight:700,fontSize:13,cursor:"pointer",minWidth:70}}>{s.label}</button>
                ))}
              </div>
            )}
          </div>

          <div style={{textAlign:"center",color:t.dim,fontSize:10,fontFamily:"'DM Mono'",letterSpacing:3,marginBottom:10,textTransform:"uppercase"}}>tap to ping ˘ᵕ˘</div>

          <div style={{position:"relative",marginBottom:24}}>
            <button className={`pingbtn${easterEgg?" pingbtn-easter":""}`} onClick={sendPing} disabled={sending} style={{width:165,height:165,borderRadius:"50%",background:sending?dark?"rgba(35,35,35,0.7)":"rgba(200,200,200,0.5)":"linear-gradient(145deg,#dcdcdc 0%,#888 38%,#c4c4c4 68%,#f8f8f8 100%)",border:sending?`1px solid ${t.border}`:"1px solid rgba(255,255,255,0.38)",color:sending?t.dim:"#181818",cursor:sending?"default":"pointer",fontFamily:"'Nunito'",fontWeight:900,animation:sending?"none":"chromePulse 2.6s infinite",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:6,boxShadow:sending?"none":"0 14px 50px rgba(0,0,0,0.2),inset 0 2px 0 rgba(255,255,255,0.55),inset 0 -3px 0 rgba(0,0,0,0.18)",transition:"background 0.3s,color 0.3s"}}>
              <span style={{fontSize:38,lineHeight:1,filter:sending?"grayscale(1) opacity(0.35)":"drop-shadow(0 2px 4px rgba(0,0,0,0.25))"}}>{sending?"✈️":"📡"}</span>
              <span style={{fontSize:12,letterSpacing:1,opacity:sending?0.35:0.75,fontWeight:900}}>{sending?"sent!":"ping!"}</span>
              {!sending&&<span style={{fontSize:9,letterSpacing:1,opacity:0.5,marginTop:-2,fontFamily:"'DM Mono'"}}>{otherName.toLowerCase()}</span>}
            </button>
          </div>

          {recentForMe.length>0?(
            <>
              <div style={{color:t.dim,fontSize:9,letterSpacing:3,textTransform:"uppercase",marginBottom:10,fontFamily:"'DM Mono'",alignSelf:"flex-start"}}>pings from {otherName} ˚₊‧</div>
              {recentForMe.map(p=>(
                <div key={p.id} className="glass ping-row" style={{width:"100%",borderRadius:16,padding:"12px 18px",marginBottom:8,display:"flex",justifyContent:"space-between",alignItems:"center",border:`1px solid ${t.border}`}}>
                  <span style={{color:t.muted,fontSize:15,fontWeight:700}}>{p.msg}</span>
                  <span style={{color:t.dim,fontSize:10,fontFamily:"'DM Mono'",flexShrink:0,marginLeft:10}}>{new Date(p.ts).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}</span>
                </div>
              ))}
            </>
          ):(
            <div style={{color:t.vdim,fontSize:11,fontFamily:"'DM Mono'",letterSpacing:2}}>no pings yet ˙◠˙ hit it!</div>
          )}
        </div>
      )}

      {tab==="chat"&&(
        <div style={{width:"100%",maxWidth:390,display:"flex",flexDirection:"column",position:"relative",zIndex:1,height:"calc(100vh - 260px)",minHeight:320}}>
          <div className="glass" style={{flex:1,borderRadius:20,padding:"14px",overflowY:"auto",marginBottom:10,display:"flex",flexDirection:"column",gap:8,border:`1px solid ${t.border}`}}>
            {messages.length===0?(<div style={{margin:"auto",textAlign:"center",color:t.dim,fontSize:11,fontFamily:"'DM Mono'",letterSpacing:2}}>no messages yet ˙◠˙<br/>say hi!!</div>)
            :messages.map(m=>{const isMe=m.from===myName;return(
              <div key={m.id} style={{display:"flex",flexDirection:"column",alignItems:isMe?"flex-end":"flex-start",animation:"fadeUp 0.25s ease"}}>
                <div style={{maxWidth:"78%",padding:"10px 14px",borderRadius:isMe?"18px 18px 4px 18px":"18px 18px 18px 4px",background:isMe?t.msgMe:t.msgOther,border:`1px solid ${isMe?t.tabABorder:t.border}`,color:isMe?t.text:t.muted,fontSize:14,fontWeight:700,wordBreak:"break-word",lineHeight:1.4}}>{m.msg}</div>
                <span style={{color:t.dim,fontSize:9,fontFamily:"'DM Mono'",marginTop:3,marginLeft:4,marginRight:4}}>{new Date(m.ts).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}</span>
              </div>
            );})}
            {isTyping&&(<div style={{display:"flex",alignItems:"flex-start",animation:"fadeUp 0.2s ease"}}><div style={{padding:"10px 16px",borderRadius:"18px 18px 18px 4px",background:t.msgOther,border:`1px solid ${t.border}`,display:"flex",gap:2,alignItems:"center"}}><span className="dot" style={{animationDelay:"0s"}}/><span className="dot" style={{animationDelay:"0.2s"}}/><span className="dot" style={{animationDelay:"0.4s"}}/></div></div>)}
            <div ref={chatBottom}/>
          </div>
          <div style={{display:"flex",gap:8}}>
            <input className="chat-input glass" value={chatInput} onChange={e=>handleTyping(e.target.value)} onKeyDown={e=>e.key==="Enter"&&sendMessage()} placeholder={`message ${otherName.toLowerCase()}...`} style={{flex:1,padding:"12px 16px",borderRadius:14,fontFamily:"'Nunito'",fontWeight:700,fontSize:14,color:t.text,border:`1px solid ${t.border}`,background:t.glassB}}/>
            <button onClick={sendMessage} style={{padding:"12px 18px",borderRadius:14,background:t.glassB,border:`1px solid ${t.border}`,color:t.text,fontFamily:"'Nunito'",fontWeight:800,fontSize:14,cursor:"pointer",transition:"all 0.15s",flexShrink:0}} onMouseOver={e=>e.currentTarget.style.opacity="0.7"} onMouseOut={e=>e.currentTarget.style.opacity="1"}>send ✦</button>
          </div>
        </div>
      )}

      {tab==="game"&&(
        <div style={{width:"100%",maxWidth:390,display:"flex",flexDirection:"column",alignItems:"center",gap:14,position:"relative",zIndex:1}}>
          <div style={{textAlign:"center"}}>
            <div style={{fontSize:32,marginBottom:4}}>⭕❌</div>
            <div style={{color:t.muted,fontSize:14,fontWeight:800}}>tic tac toe</div>
          </div>

          {!mySymbol?(
            <div className="glass" style={{borderRadius:20,padding:"24px",border:`1px solid ${t.border}`,textAlign:"center",width:"100%"}}>
              <div style={{color:t.muted,fontSize:12,fontFamily:"'DM Mono'",letterSpacing:2,marginBottom:16}}>pick your symbol</div>
              <div style={{display:"flex",gap:12,justifyContent:"center"}}>
                {["X","O"].map(s=>(
                  <button key={s} onClick={()=>setMySymbol(s)} style={{width:72,height:72,borderRadius:16,background:t.glassB,border:`1px solid ${t.border}`,fontSize:28,fontWeight:900,color:t.text,cursor:"pointer",fontFamily:"'Nunito'",transition:"all 0.15s"}} onMouseOver={e=>e.currentTarget.style.opacity="0.7"} onMouseOut={e=>e.currentTarget.style.opacity="1"}>{s}</button>
                ))}
              </div>
            </div>
          ):(
            <>
              <div className="glass" style={{borderRadius:14,padding:"12px 20px",border:`1px solid ${t.border}`,textAlign:"center",width:"100%"}}>
                {tttWinner?(
                  <div style={{color:t.text,fontWeight:900,fontSize:15,animation:"winPop 0.4s ease"}}>
                    {tttWinner==="draw"?"it's a draw!! 😭":tttWinner===mySymbol?"u won!! 🎉 ":"they won 💀"}
                  </div>
                ):(
                  <div style={{color:t.muted,fontSize:13,fontWeight:700}}>
                    {tttTurn===mySymbol?"ur turn ✦":"their turn..."}
                    <span style={{color:t.dim,fontFamily:"'DM Mono'",fontSize:10,marginLeft:8}}>u are {mySymbol}</span>
                  </div>
                )}
              </div>

              <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,width:"100%",maxWidth:280}}>
                {tttBoard.map((cell,i)=>(
                  <button key={i} className="ttt-cell" onClick={()=>tttMove(i)} style={{aspectRatio:"1",borderRadius:16,background:t.glassB,border:`1px solid ${t.border}`,fontSize:38,fontWeight:900,color:cell==="X"?t.text:t.muted,cursor:!cell&&!tttWinner&&tttTurn===mySymbol?"pointer":"default",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Nunito'"}}>
                    {cell||""}
                  </button>
                ))}
              </div>

              <div style={{display:"flex",gap:8}}>
                <button onClick={resetTtt} style={{padding:"10px 22px",borderRadius:12,background:t.glassB,border:`1px solid ${t.border}`,color:t.text,fontFamily:"'Nunito'",fontWeight:800,fontSize:13,cursor:"pointer",transition:"all 0.15s"}} onMouseOver={e=>e.currentTarget.style.opacity="0.7"} onMouseOut={e=>e.currentTarget.style.opacity="1"}>new game ↩</button>
                <button onClick={()=>setMySymbol(null)} style={{padding:"10px 22px",borderRadius:12,background:"transparent",border:`1px solid ${t.border}`,color:t.muted,fontFamily:"'Nunito'",fontWeight:700,fontSize:13,cursor:"pointer"}}>change symbol</button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
