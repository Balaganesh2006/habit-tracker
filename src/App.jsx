import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

const HABIT_DATA = [
  { id:1,  name:"Morning Exercise",       emoji:"🏃", color:"#ff6b6b", image:"https://i.ytimg.com/vi/h0Sqc90rUY4/maxresdefault.jpg",
    fields:[{label:"Type of Exercise",type:"select",options:["Running","Gym","Cycling","Walking","Other"]},{label:"Time Spent (mins)",type:"number"}]},
  { id:2,  name:"Yoga",                   emoji:"🧘", color:"#da77f2", image:"https://t3.ftcdn.net/jpg/04/87/48/66/360_F_487486623_CatNgUbulZ6rOpENckeTzRfY7IzrqOKd.jpg",
    fields:[{label:"Type of Yoga",type:"select",options:["Hatha","Vinyasa","Yin","Power","Meditation"]},{label:"Time Spent (mins)",type:"number"}]},
  { id:3,  name:"Drink 4L Water",         emoji:"💧", color:"#4dabf7", image:"https://www.thoughtco.com/thmb/Ce_U7ugg_g1TBUl_DMIfRGVOG3s=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/WaterBottle-58dd39845f9b584683cbd554.jpg",
    fields:[{label:"Amount Drank (ml)",type:"number"}]},
  { id:4,  name:"Healthy Eating",         emoji:"🥗", color:"#69db7c", image:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTvOFG5TSeqaCbMlu0Ql_eVn1ie2VE35U88kA&s",
    fields:[{label:"Meal Type",type:"select",options:["Breakfast","Lunch","Dinner","Snack"]},{label:"What did you eat?",type:"text"}]},
  { id:5,  name:"Learning Something New", emoji:"📖", color:"#ffd43b", image:"https://www.shutterstock.com/image-photo/wooden-blocks-words-learn-something-260nw-2227051575.jpg",
    fields:[{label:"What did you learn?",type:"text"},{label:"Time Spent (mins)",type:"number"}]},
  { id:6,  name:"Reading Books",          emoji:"📚", color:"#f7b731", image:"https://png.pngtree.com/thumb_back/fh260/background/20241002/pngtree-springtime-reading-stack-of-books-outdoors-on-green-lawn-for-students-image_16306691.jpg",
    fields:[{label:"Book Name",type:"text"},{label:"Pages Read",type:"number"}]},
  { id:7,  name:"Playing Games",          emoji:"🎮", color:"#63e6be", image:"https://media.istockphoto.com/id/884279742/photo/leisure-activities.jpg?s=612x612&w=0&k=20&c=fsD1GrpVRJpPj5F8JWnYqApLMcovBt9_ZX79ZF7VBEQ=",
    fields:[{label:"Game Name",type:"text"},{label:"Time Spent (mins)",type:"number"}]},
  { id:8,  name:"Family Time",            emoji:"👨‍👩‍👧", color:"#f783ac", image:"https://media.istockphoto.com/id/1179405499/photo/silhouette-happy-family-people-group-celebrate-jump-for-good-life-on-weekend-concept-for-win.jpg?s=612x612&w=0&k=20&c=k7MJ7LHfqbSGhujiA1hde-9Faz1SKpNc9CV42ORak30=",
    fields:[{label:"Activity Done",type:"text"},{label:"Time Spent (mins)",type:"number"}]},
  { id:9,  name:"Work / Class / Office",  emoji:"💼", color:"#a78bfa", image:"https://thumb.photo-ac.com/3f/3f3f1ae3c4c3fbb1b2574a9ddc638b1e_t.jpeg",
    fields:[{label:"Type",type:"select",options:["Office","College Class","School Class","Work from Home"]},{label:"Hours Spent",type:"number"}]},
  { id:10, name:"Practise",               emoji:"🎯", color:"#ff922b", image:"https://ec.europa.eu/futurium/sites/futurium/files/best_practices.jpg",
    fields:[{label:"What did you practise?",type:"text"},{label:"Time Spent (mins)",type:"number"}]},
  { id:11, name:"Improving Communication",emoji:"🗣️", color:"#20c997", image:"https://previews.123rf.com/images/bimdeedee/bimdeedee1505/bimdeedee150500052/41299638-communication-concept-with-business-doodles-in-speech-bubble.jpg",
    fields:[{label:"Activity Type",type:"select",options:["Public Speaking","Conversation","Writing","Listening"]},{label:"Time Spent (mins)",type:"number"}]},
  { id:12, name:"Sleep Track",            emoji:"😴", color:"#748ffc", image:"https://static.vecteezy.com/system/resources/thumbnails/073/562/724/small/a-young-man-sleeps-soundly-on-a-white-pillow-in-a-dimly-lit-bedroom-with-a-soft-light-illuminating-his-face-photo.jpg",
    fields:[]},
];

const QUOTES = [
  {quote:"Discipline is the bridge between goals and accomplishment.",author:"Jim Rohn"},
  {quote:"We are what we repeatedly do. Excellence is not an act, but a habit.",author:"Aristotle"},
  {quote:"Success is the sum of small efforts repeated day in and day out.",author:"Robert Collier"},
  {quote:"Consistency is what transforms average into excellence.",author:"Unknown"},
  {quote:"The secret of your future is hidden in your daily routine.",author:"Mike Murdock"},
];

const DAYS=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
const MONTHS=["January","February","March","April","May","June","July","August","September","October","November","December"];
const getDayKey=(d=new Date())=>d.toISOString().split("T")[0];

function getStreak(c){
  let s=0,t=new Date();
  for(let i=0;i<365;i++){const d=new Date(t);d.setDate(t.getDate()-i);if(c[getDayKey(d)])s++;else break;}
  return s;
}
function weekBars(c){
  return Array.from({length:7},(_,i)=>{const d=new Date();d.setDate(d.getDate()-(6-i));return{day:DAYS[d.getDay()],done:!!c[getDayKey(d)]};});
}
function greeting(name){
  const h=new Date().getHours();
  if(h>=5&&h<12)return{text:`Good Morning, ${name}! 🌅`,sub:"Start your day strong!",bg:"linear-gradient(135deg,#f7971e,#ffd200)"};
  if(h>=12&&h<17)return{text:`Good Afternoon, ${name}! ☀️`,sub:"Keep the momentum going!",bg:"linear-gradient(135deg,#43cea2,#185a9d)"};
  if(h>=17&&h<21)return{text:`Good Evening, ${name}! 🌆`,sub:"Wind down with purpose!",bg:"linear-gradient(135deg,#ee0979,#ff6a00)"};
  return{text:`Good Night, ${name}! 🌙`,sub:"Rest well, rise stronger!",bg:"linear-gradient(135deg,#0f0c29,#302b63)"};
}

// RAINBOW STYLES
const rainbowCSS = `
  @keyframes rainbowMove {
    0%   { background-position: 0% 50%; }
    50%  { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  @keyframes float1 { 0%,100%{transform:translateY(0px) scale(1);} 50%{transform:translateY(-25px) scale(1.08);} }
  @keyframes float2 { 0%,100%{transform:translateY(0px);} 50%{transform:translateY(-35px);} }
  @keyframes float3 { 0%,100%{transform:translateY(0px) rotate(0deg);} 50%{transform:translateY(-18px) rotate(10deg);} }
  @keyframes shimmer { 0%,100%{opacity:0.8;} 50%{opacity:1;} }
  @keyframes bubbleRainbow {
    0%  { background: rgba(255,80,80,0.85); }
    16% { background: rgba(255,180,50,0.85); }
    33% { background: rgba(255,255,80,0.85); }
    50% { background: rgba(80,255,120,0.85); }
    66% { background: rgba(80,160,255,0.85); }
    83% { background: rgba(180,80,255,0.85); }
    100%{ background: rgba(255,80,80,0.85); }
  }
  .rainbow-bg {
    background: linear-gradient(270deg,#ff0000,#ff7700,#ffff00,#00ee00,#00bfff,#8b00ff,#ff00ff,#ff0000) !important;
    background-size: 600% 600% !important;
    animation: rainbowMove 3s ease infinite !important;
  }
  .bubble { border-radius: 50%; filter: blur(2px); }
  .bubble1 { animation: float1 6s ease-in-out infinite, bubbleRainbow 4s ease infinite; }
  .bubble2 { animation: float2 8s ease-in-out infinite, bubbleRainbow 5s ease infinite 1s; }
  .bubble3 { animation: float3 7s ease-in-out infinite, bubbleRainbow 6s ease infinite 2s; }
  .bubble4 { animation: float1 9s ease-in-out infinite, bubbleRainbow 4s ease infinite 0.5s; }
  .bubble5 { animation: float2 5s ease-in-out infinite, bubbleRainbow 7s ease infinite 1.5s; }
  .shimmer { animation: shimmer 2s ease-in-out infinite; }
`;

// LOGIN
function Login({onDone}){
  const [step,setStep]=useState("form");
  const [name,setName]=useState("");
  const [mobile,setMobile]=useState("");
  const [otp,setOtp]=useState("");
  const [input,setInput]=useState("");
  const [err,setErr]=useState("");
  const [loading,setLoading]=useState(false);
  const [timer,setTimer]=useState(0);
  useEffect(()=>{if(timer>0){const t=setTimeout(()=>setTimer(r=>r-1),1000);return()=>clearTimeout(t);}},[timer]);

  const send=()=>{
    if(!name.trim()){setErr("Please enter your name");return;}
    if(!/^\d{10}$/.test(mobile)){setErr("Enter valid 10-digit number");return;}
    setErr("");setLoading(true);
    setTimeout(()=>{
      const o=(Math.floor(100000+Math.random()*900000)).toString();
      setOtp(o);setLoading(false);setStep("otp");setTimer(30);
      alert(`📱 OTP for +91 ${mobile}\n\nOTP: ${o}\n\n(Demo mode — in production this would be a real SMS)`);
    },1200);
  };
  const verify=()=>{ if(input===otp)onDone(name); else setErr("Invalid OTP, try again."); };

  return(
    <div style={{...G.center, position:"relative", overflow:"hidden", background:"none"}} className="rainbow-bg">
      <style>{rainbowCSS}</style>

      {/* Floating rainbow bubbles */}
      <div className="bubble bubble1" style={{position:"absolute",top:"8%",left:"10%",width:"130px",height:"130px"}}/>
      <div className="bubble bubble2" style={{position:"absolute",top:"15%",right:"8%",width:"90px",height:"90px"}}/>
      <div className="bubble bubble3" style={{position:"absolute",bottom:"20%",left:"5%",width:"70px",height:"70px"}}/>
      <div className="bubble bubble4" style={{position:"absolute",bottom:"10%",right:"12%",width:"110px",height:"110px"}}/>
      <div className="bubble bubble5" style={{position:"absolute",top:"50%",left:"3%",width:"55px",height:"55px"}}/>
      <div className="bubble bubble1" style={{position:"absolute",top:"35%",right:"3%",width:"65px",height:"65px"}}/>

      <div style={{...G.card, position:"relative", zIndex:1, background:"rgba(5,8,18,0.75)", backdropFilter:"blur(24px)", border:"2px solid rgba(255,255,255,0.35)", boxShadow:"0 8px 48px rgba(0,0,0,0.6)"}}>
        <div style={{textAlign:"center",marginBottom:"1.8rem"}}>
          <div className="shimmer" style={{fontSize:"3.5rem"}}>🏆</div>
          <h1 style={{background:"linear-gradient(90deg,#ff6b6b,#ffd43b,#69db7c,#4dabf7,#da77f2)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text",fontSize:"2rem",fontWeight:900,margin:"0.3rem 0 0.2rem"}}>HabitFlow</h1>
          <p style={{color:"#cbd5e1",fontSize:"0.85rem"}}>Build habits. Transform your life.</p>
        </div>
        {step==="form"?(
          <>
            <label style={G.lbl}>Your Name</label>
            <input style={G.inp} placeholder="e.g. Arjun" value={name} onChange={e=>setName(e.target.value)}/>
            <label style={G.lbl}>Mobile Number</label>
            <div style={{display:"flex",gap:"0.5rem",marginBottom:"1rem"}}>
              <div style={{...G.inp,width:"58px",textAlign:"center",color:"#94a3b8",flexShrink:0}}>+91</div>
              <input style={{...G.inp,flex:1,marginBottom:0}} placeholder="10-digit number" value={mobile} onChange={e=>setMobile(e.target.value.replace(/\D/g,"").slice(0,10))} maxLength={10}/>
            </div>
            {err&&<div style={G.err}>{err}</div>}
            <button style={{...G.btn,opacity:loading?0.7:1}} onClick={send} disabled={loading}>{loading?"Sending OTP...":"Send OTP →"}</button>
          </>
        ):(
          <>
            <div style={{textAlign:"center",marginBottom:"1.5rem"}}>
              <div style={{fontSize:"2.5rem"}}>📱</div>
              <p style={{color:"#94a3b8",fontSize:"0.85rem",marginTop:"0.4rem"}}>OTP sent to +91 {mobile}</p>
            </div>
            <label style={G.lbl}>Enter OTP</label>
            <input style={{...G.inp,textAlign:"center",fontSize:"1.6rem",letterSpacing:"0.6rem",fontWeight:700}} placeholder="• • • • • •" value={input} onChange={e=>setInput(e.target.value.replace(/\D/g,"").slice(0,6))} maxLength={6}/>
            {err&&<div style={G.err}>{err}</div>}
            <button style={G.btn} onClick={verify}>Verify & Continue →</button>
            <div style={{textAlign:"center",marginTop:"1rem"}}>
              {timer>0
                ?<span style={{color:"#475569",fontSize:"0.8rem"}}>Resend in {timer}s</span>
                :<button style={{background:"transparent",border:"none",color:"#6366f1",fontFamily:"'Outfit',sans-serif",fontSize:"0.85rem",cursor:"pointer",fontWeight:600}} onClick={()=>{send();setInput("");}}>Resend OTP</button>}
            </div>
            <button style={{background:"transparent",border:"none",color:"#475569",fontFamily:"'Outfit',sans-serif",fontSize:"0.82rem",cursor:"pointer",display:"block",width:"100%",marginTop:"0.6rem"}} onClick={()=>{setStep("form");setErr("");}}>← Change Number</button>
          </>
        )}
      </div>
    </div>
  );
}

// MOTIVATION
function Motivation({name,onNext}){
  const q=QUOTES[Math.floor(Math.random()*QUOTES.length)];
  const [v,setV]=useState(false);
  useEffect(()=>{setTimeout(()=>setV(true),100);},[]);
  return(
    <div style={{...G.center,background:"linear-gradient(135deg,#0f0c29,#302b63,#24243e)"}}>
      <div style={{...G.card,textAlign:"center",opacity:v?1:0,transform:v?"translateY(0)":"translateY(30px)",transition:"all 0.8s ease",background:"rgba(255,255,255,0.05)",backdropFilter:"blur(20px)"}}>
        <div style={{fontSize:"4rem",marginBottom:"0.8rem"}}>✨</div>
        <div style={{fontSize:"0.7rem",letterSpacing:"3px",textTransform:"uppercase",color:"#a78bfa",marginBottom:"1.2rem"}}>Daily Motivation</div>
        <blockquote style={{fontSize:"1.2rem",fontWeight:700,color:"#f1f5f9",lineHeight:1.7,fontStyle:"italic",marginBottom:"0.8rem"}}>"{q.quote}"</blockquote>
        <div style={{color:"#64748b",fontSize:"0.85rem",marginBottom:"2rem"}}>— {q.author}</div>
        <div style={{background:"rgba(167,139,250,0.12)",border:"1px solid rgba(167,139,250,0.3)",borderRadius:"12px",padding:"0.8rem 1.2rem",marginBottom:"1.8rem",color:"#c4b5fd",fontSize:"0.9rem"}}>
          Ready to build great habits, <strong>{name}</strong>? 💪
        </div>
        <button style={G.btn} onClick={onNext}>Let's Set Up My Habits →</button>
      </div>
    </div>
  );
}

// SELECTION
function Selection({onDone}){
  const [sel,setSel]=useState([]);
  const toggle=id=>setSel(p=>p.includes(id)?p.filter(x=>x!==id):[...p,id]);
  return(
    <div style={{minHeight:"100vh",background:"#0b0f1a",fontFamily:"'Outfit',sans-serif",padding:"2rem 1rem",overflowY:"auto"}}>
      <div style={{maxWidth:"560px",margin:"0 auto"}}>
        <div style={{textAlign:"center",marginBottom:"2rem"}}>
          <div style={{fontSize:"2.2rem",marginBottom:"0.5rem"}}>🎯</div>
          <h2 style={{color:"#f1f5f9",fontSize:"1.5rem",fontWeight:800}}>Choose Your Daily Habits</h2>
          <p style={{color:"#64748b",fontSize:"0.85rem",marginTop:"0.4rem"}}>Select all habits you want to track every day</p>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.9rem",marginBottom:"2rem"}}>
          {HABIT_DATA.map(h=>{
            const on=sel.includes(h.id);
            return(
              <div key={h.id} onClick={()=>toggle(h.id)} style={{borderRadius:"18px",overflow:"hidden",cursor:"pointer",border:`2px solid ${on?h.color:"rgba(255,255,255,0.07)"}`,boxShadow:on?`0 0 22px ${h.color}44`:"none",transition:"all 0.25s"}}>
                <div style={{height:"95px",backgroundImage:`url(${h.image})`,backgroundSize:"cover",backgroundPosition:"center",position:"relative"}}>
                  <div style={{position:"absolute",inset:0,background:on?`${h.color}55`:"rgba(0,0,0,0.48)"}}/>
                  {on&&<div style={{position:"absolute",top:"8px",right:"8px",background:h.color,borderRadius:"50%",width:"22px",height:"22px",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"0.75rem",fontWeight:700,color:"#fff"}}>✓</div>}
                </div>
                <div style={{padding:"0.6rem 0.8rem",background:"#111827"}}>
                  <div style={{fontSize:"0.83rem",fontWeight:700,color:on?h.color:"#e2e8f0"}}>{h.emoji} {h.name}</div>
                </div>
              </div>
            );
          })}
        </div>
        <button style={{...G.btn,opacity:sel.length===0?0.4:1,cursor:sel.length===0?"not-allowed":"pointer"}} onClick={()=>sel.length>0&&onDone(sel)} disabled={sel.length===0}>
          Continue with {sel.length} habit{sel.length!==1?"s":""} →
        </button>
      </div>
    </div>
  );
}

// GREETING
function Greeting({name,onNext}){
  const g=greeting(name);
  const [v,setV]=useState(false);
  useEffect(()=>{setTimeout(()=>setV(true),100);},[]);
  return(
    <div style={{...G.center,background:g.bg}}>
      <div style={{textAlign:"center",padding:"2rem",opacity:v?1:0,transform:v?"scale(1)":"scale(0.9)",transition:"all 0.7s ease"}}>
        <div style={{fontSize:"5rem",marginBottom:"0.8rem"}}>👋</div>
        <h1 style={{fontSize:"clamp(1.8rem,5vw,2.8rem)",fontWeight:900,color:"#fff",lineHeight:1.3,marginBottom:"0.6rem",textShadow:"0 2px 20px rgba(0,0,0,0.3)"}}>{g.text}</h1>
        <p style={{color:"rgba(255,255,255,0.8)",fontSize:"1rem",marginBottom:"2.5rem"}}>{g.sub}</p>
        <button onClick={onNext} style={{background:"rgba(255,255,255,0.2)",backdropFilter:"blur(10px)",border:"2px solid rgba(255,255,255,0.4)",color:"#fff",padding:"0.9rem 2.5rem",borderRadius:"50px",fontSize:"1rem",fontWeight:700,cursor:"pointer",fontFamily:"'Outfit',sans-serif"}}>
          View My Habits →
        </button>
      </div>
    </div>
  );
}

// DETAIL POPUP
function DetailPopup({habit,onSave,onClose}){
  const [vals,setVals]=useState({});
  const set=(l,v)=>setVals(p=>({...p,[l]:v}));
  if(habit.fields.length===0){
    return(
      <div style={G.overlay} onClick={onClose}>
        <div style={{...G.popup,textAlign:"center"}} onClick={e=>e.stopPropagation()}>
          <div style={{fontSize:"3rem",marginBottom:"0.7rem"}}>{habit.emoji}</div>
          <h3 style={{color:"#f1f5f9",marginBottom:"0.5rem"}}>{habit.name}</h3>
          <p style={{color:"#64748b",fontSize:"0.85rem",marginBottom:"1.5rem"}}>No details needed — just mark it done!</p>
          <button style={{...G.btn,background:habit.color}} onClick={()=>onSave({})}>✓ Mark as Done</button>
        </div>
      </div>
    );
  }
  return(
    <div style={G.overlay} onClick={onClose}>
      <div style={G.popup} onClick={e=>e.stopPropagation()}>
        <div style={{display:"flex",alignItems:"center",gap:"0.8rem",marginBottom:"1.4rem"}}>
          <div style={{width:"48px",height:"48px",borderRadius:"14px",background:`${habit.color}22`,border:`1.5px solid ${habit.color}55`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.4rem"}}>{habit.emoji}</div>
          <div>
            <div style={{fontWeight:700,color:"#f1f5f9",fontSize:"1rem"}}>{habit.name}</div>
            <div style={{color:"#64748b",fontSize:"0.75rem"}}>Tell us about today's session</div>
          </div>
        </div>
        {habit.fields.map(f=>(
          <div key={f.label} style={{marginBottom:"1rem"}}>
            <label style={G.lbl}>{f.label}</label>
            {f.type==="select"
              ?<select style={G.inp} value={vals[f.label]||""} onChange={e=>set(f.label,e.target.value)}>
                <option value="">Select...</option>
                {f.options.map(o=><option key={o} value={o}>{o}</option>)}
               </select>
              :<input style={G.inp} type={f.type==="number"?"number":"text"} placeholder={f.type==="number"?"Enter number":"Type here..."} value={vals[f.label]||""} onChange={e=>set(f.label,e.target.value)}/>
            }
          </div>
        ))}
        <div style={{display:"flex",gap:"0.8rem",marginTop:"1.2rem"}}>
          <button style={{...G.btn,background:"rgba(255,255,255,0.07)",flex:1}} onClick={onClose}>Cancel</button>
          <button style={{...G.btn,background:habit.color,flex:2}} onClick={()=>onSave(vals)}>✓ Save & Mark Done</button>
        </div>
      </div>
    </div>
  );
}

// HABIT CARD
function HabitCard({habit,onMark,onDelete}){
  const today=getDayKey();
  const done=!!habit.completions[today];
  const streak=getStreak(habit.completions);
  const bars=weekBars(habit.completions);
  return(
    <div style={{borderRadius:"20px",overflow:"hidden",border:`1.5px solid ${done?habit.color:"rgba(255,255,255,0.08)"}`,boxShadow:done?`0 0 28px ${habit.color}33`:"none",transition:"all 0.3s",background:"#111827"}}>
      <div style={{height:"115px",backgroundImage:`url(${habit.image})`,backgroundSize:"cover",backgroundPosition:"center",position:"relative"}}>
        <div style={{position:"absolute",inset:0,background:done?`${habit.color}66`:"rgba(0,0,0,0.52)"}}/>
        <div style={{position:"absolute",top:"10px",left:"12px",background:"rgba(0,0,0,0.55)",backdropFilter:"blur(6px)",borderRadius:"10px",padding:"0.3rem 0.8rem",display:"flex",alignItems:"center",gap:"0.5rem"}}>
          <span style={{fontSize:"1.1rem"}}>{habit.emoji}</span>
          <span style={{fontWeight:700,color:"#f1f5f9",fontSize:"0.9rem"}}>{habit.name}</span>
        </div>
        <button onClick={onDelete} style={{position:"absolute",top:"10px",right:"10px",background:"rgba(0,0,0,0.45)",border:"none",color:"#94a3b8",width:"28px",height:"28px",borderRadius:"8px",cursor:"pointer",fontSize:"0.8rem"}}>✕</button>
        {done&&<div style={{position:"absolute",bottom:"10px",right:"12px",background:habit.color,borderRadius:"8px",padding:"0.2rem 0.75rem",fontSize:"0.75rem",fontWeight:700,color:"#fff"}}>✓ Done</div>}
      </div>
      <div style={{padding:"1rem"}}>
        <div style={{fontSize:"0.74rem",color:"#64748b",marginBottom:"0.8rem"}}>🔥 {streak} day streak · {Object.values(habit.completions).filter(Boolean).length} total</div>
        <div style={{display:"flex",gap:"4px",marginBottom:"0.9rem"}}>
          {bars.map((b,i)=>(
            <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:"3px"}}>
              <div style={{width:"100%",height:"26px",borderRadius:"6px",background:b.done?habit.color:"rgba(255,255,255,0.05)",transition:"background 0.3s"}}/>
              <span style={{fontSize:"0.58rem",color:"#334155"}}>{b.day}</span>
            </div>
          ))}
        </div>
        <button onClick={()=>!done&&onMark()} style={{width:"100%",padding:"0.72rem",borderRadius:"12px",background:done?habit.color:"rgba(255,255,255,0.05)",border:`2px solid ${done?habit.color:"rgba(255,255,255,0.1)"}`,color:done?"#fff":"#94a3b8",fontFamily:"'Outfit',sans-serif",fontWeight:700,fontSize:"0.9rem",cursor:done?"default":"pointer",transition:"all 0.3s"}}>
          {done?"✓ Done Today!":"Mark Complete"}
        </button>
      </div>
    </div>
  );
}

// DASHBOARD
function Dashboard({username,selectedIds}){
  const [habits,setHabits]=useState(HABIT_DATA.filter(h=>selectedIds.includes(h.id)).map(h=>({...h,completions:{}})));
  const [popup,setPopup]=useState(null);
  const [tab,setTab]=useState("habits");
  const [toast,setToast]=useState(null);
  const today=getDayKey();
  const done=habits.filter(h=>h.completions[today]).length;
  const prog=habits.length===0?0:(done/habits.length)*100;
  const now=new Date();
  const g=greeting(username);

  const showToast=m=>{setToast(m);setTimeout(()=>setToast(null),3000);};
  const markDone=(id,vals)=>{setHabits(p=>p.map(h=>h.id===id?{...h,completions:{...h.completions,[today]:{done:true,...vals}}}:h));setPopup(null);showToast("🎉 Great job! Habit marked done!");};
  const del=id=>setHabits(p=>p.filter(h=>h.id!==id));

  const chart=habits.map(h=>({name:h.emoji,streak:getStreak(h.completions),total:Object.values(h.completions).filter(Boolean).length,color:h.color}));

  return(
    <div style={{minHeight:"100vh",background:"#0b0f1a",fontFamily:"'Outfit',sans-serif"}}>
      {toast&&<div style={G.toast}>{toast}</div>}
      <div style={{maxWidth:"560px",margin:"0 auto",padding:"1.5rem 1rem"}}>
        <div style={{borderRadius:"20px",background:g.bg,padding:"1.2rem 1.5rem",marginBottom:"1.2rem",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div>
            <div style={{fontSize:"0.7rem",color:"rgba(255,255,255,0.7)",letterSpacing:"1px",marginBottom:"0.2rem"}}>{DAYS[now.getDay()]}, {MONTHS[now.getMonth()]} {now.getDate()}</div>
            <div style={{fontWeight:800,fontSize:"1.1rem",color:"#fff"}}>{g.text}</div>
            <div style={{fontSize:"0.8rem",color:"rgba(255,255,255,0.7)",marginTop:"0.1rem"}}>{g.sub}</div>
          </div>
          <div style={{fontSize:"2.2rem"}}>🏆</div>
        </div>

        <div style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:"16px",padding:"1.1rem 1.3rem",marginBottom:"1.2rem"}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:"0.5rem"}}>
            <span style={{fontSize:"0.8rem",color:"#94a3b8"}}>Today's Progress</span>
            <span style={{fontSize:"0.8rem",fontWeight:700,color:"#f1f5f9"}}>{done} / {habits.length}</span>
          </div>
          <div style={{height:"8px",background:"rgba(255,255,255,0.07)",borderRadius:"99px",overflow:"hidden"}}>
            <div style={{height:"100%",width:`${prog}%`,background:"linear-gradient(90deg,#6366f1,#a78bfa)",borderRadius:"99px",transition:"width 0.5s"}}/>
          </div>
          {prog===100&&<div style={{textAlign:"center",marginTop:"0.5rem",fontSize:"0.82rem",color:"#ffd43b"}}>🎉 All habits done today!</div>}
        </div>

        <div style={{display:"flex",gap:"0.6rem",marginBottom:"1.3rem"}}>
          {["habits","stats"].map(t=>(
            <button key={t} onClick={()=>setTab(t)} style={{flex:1,padding:"0.6rem",borderRadius:"12px",border:`1.5px solid ${tab===t?"#6366f1":"transparent"}`,background:tab===t?"rgba(99,102,241,0.2)":"rgba(255,255,255,0.04)",color:tab===t?"#a78bfa":"#475569",fontFamily:"'Outfit',sans-serif",fontWeight:600,fontSize:"0.85rem",cursor:"pointer"}}>
              {t==="habits"?"🏠 Habits":"📊 Stats"}
            </button>
          ))}
        </div>

        {tab==="habits"?(
          <div style={{display:"grid",gap:"1rem"}}>
            {habits.map(h=><HabitCard key={h.id} habit={h} onMark={()=>setPopup(h)} onDelete={()=>del(h.id)}/>)}
          </div>
        ):(
          <div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"0.8rem",marginBottom:"1.5rem"}}>
              {[{l:"Done Today",v:`${done}/${habits.length}`,c:"#69db7c"},{l:"Today's Rate",v:`${Math.round(prog)}%`,c:"#4dabf7"},{l:"Best Streak",v:`🔥 ${habits.reduce((m,h)=>Math.max(m,getStreak(h.completions)),0)}`,c:"#ffd43b"}].map(s=>(
                <div key={s.l} style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:"14px",padding:"1rem",textAlign:"center"}}>
                  <div style={{fontSize:"1.6rem",fontWeight:800,color:s.c}}>{s.v}</div>
                  <div style={{fontSize:"0.68rem",color:"#64748b",marginTop:"0.3rem"}}>{s.l}</div>
                </div>
              ))}
            </div>
            {habits.length>0&&(
              <>
                <div style={{fontSize:"0.72rem",color:"#475569",letterSpacing:"2px",textTransform:"uppercase",marginBottom:"0.8rem"}}>Current Streaks</div>
                <ResponsiveContainer width="100%" height={160}>
                  <BarChart data={chart} barSize={30}>
                    <XAxis dataKey="name" tick={{fill:"#475569",fontSize:16}} axisLine={false} tickLine={false}/>
                    <YAxis hide/>
                    <Tooltip contentStyle={{background:"#1e293b",border:"none",borderRadius:"8px",color:"#f1f5f9",fontSize:"0.8rem"}}/>
                    <Bar dataKey="streak" radius={[6,6,0,0]}>{chart.map((e,i)=><Cell key={i} fill={e.color}/>)}</Bar>
                  </BarChart>
                </ResponsiveContainer>
              </>
            )}
          </div>
        )}
      </div>
      {popup&&<DetailPopup habit={popup} onSave={v=>markDone(popup.id,v)} onClose={()=>setPopup(null)}/>}
    </div>
  );
}

// ROOT
export default function App(){
  const [screen,setScreen]=useState("login");
  const [name,setName]=useState("");
  const [ids,setIds]=useState([]);
  return(
    <>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;800;900&display=swap" rel="stylesheet"/>
      {screen==="login"      &&<Login      onDone={n=>{setName(n);setScreen("motivation");}}/>}
      {screen==="motivation" &&<Motivation name={name} onNext={()=>setScreen("selection")}/>}
      {screen==="selection"  &&<Selection  onDone={i=>{setIds(i);setScreen("greeting");}}/>}
      {screen==="greeting"   &&<Greeting   name={name} onNext={()=>setScreen("dashboard")}/>}
      {screen==="dashboard"  &&<Dashboard  username={name} selectedIds={ids}/>}
    </>
  );
}

const G={
  center:{minHeight:"100vh",background:"#0b0f1a",display:"flex",alignItems:"center",justifyContent:"center",padding:"1.5rem",fontFamily:"'Outfit',sans-serif"},
  card:{background:"#111827",border:"1px solid rgba(255,255,255,0.08)",borderRadius:"24px",padding:"2.5rem 2rem",width:"100%",maxWidth:"380px"},
  lbl:{display:"block",fontSize:"0.72rem",color:"#475569",letterSpacing:"1.5px",textTransform:"uppercase",marginBottom:"0.5rem"},
  inp:{width:"100%",background:"rgba(255,255,255,0.05)",border:"1.5px solid rgba(255,255,255,0.1)",borderRadius:"12px",padding:"0.8rem 1rem",color:"#f1f5f9",fontSize:"0.9rem",fontFamily:"'Outfit',sans-serif",outline:"none",boxSizing:"border-box",marginBottom:"1rem"},
  btn:{width:"100%",padding:"0.85rem",borderRadius:"14px",background:"linear-gradient(135deg,#6366f1,#8b5cf6)",color:"#fff",border:"none",fontFamily:"'Outfit',sans-serif",fontWeight:700,fontSize:"0.95rem",cursor:"pointer"},
  err:{color:"#f87171",fontSize:"0.82rem",marginBottom:"0.8rem",padding:"0.6rem 0.9rem",background:"rgba(248,113,113,0.1)",borderRadius:"8px",border:"1px solid rgba(248,113,113,0.2)"},
  overlay:{position:"fixed",inset:0,background:"rgba(0,0,0,0.75)",backdropFilter:"blur(8px)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:100,padding:"1rem"},
  popup:{background:"#111827",border:"1px solid rgba(255,255,255,0.1)",borderRadius:"20px",padding:"1.8rem",width:"100%",maxWidth:"360px"},
  toast:{position:"fixed",top:"1.2rem",left:"50%",transform:"translateX(-50%)",background:"#1e293b",border:"1px solid rgba(255,255,255,0.1)",color:"#f1f5f9",padding:"0.75rem 1.5rem",borderRadius:"14px",fontSize:"0.88rem",fontWeight:600,zIndex:200,boxShadow:"0 8px 32px rgba(0,0,0,0.4)",whiteSpace:"nowrap"},
};
