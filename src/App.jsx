import { useState, useEffect, useRef } from "react";

const persist = (k,v)=>{try{localStorage.setItem(k,JSON.stringify(v));}catch{}};
const recall  = (k,d)=>{try{const r=localStorage.getItem(k);return r?JSON.parse(r):d;}catch{return d;}};

/* ─── COURSE DATA ─── */
const INITIAL_COURSES = [
  { id:"ap-stats", code:"AP Stats", name:"AP Statistics", color:"#A8D08D", creditWeight:1, roundTarget:0.97,
    items:[
      {id:1,name:"Unit 1",obtained:60,possible:60,weight:100},
      {id:2,name:"Unit 2",obtained:35.5,possible:36,weight:100},
      {id:3,name:"Unit 3",obtained:35,possible:36,weight:100},
      {id:4,name:"Unit 4",obtained:36.5,possible:39,weight:100},
      {id:5,name:"Unit 5",obtained:36,possible:38,weight:100},
      {id:6,name:"Unit 6",obtained:40.5,possible:42,weight:100},
      {id:7,name:"Unit 7",obtained:97,possible:100,weight:100},
      {id:9,name:"Unit 9",obtained:100,possible:100,weight:100},
    ]},
  { id:"adv-fn", code:"MHF4U", name:"Advanced Functions", color:"#33CCFF", creditWeight:1, roundTarget:0.98,
    items:[
      {id:1,name:"Conversation Ch.1",obtained:100,possible:100,weight:10},
      {id:2,name:"Chapter 1 Test",obtained:77.5,possible:78,weight:100},
      {id:3,name:"Conversation Ch.2",obtained:100,possible:100,weight:10},
      {id:4,name:"Chapter 2 Test",obtained:67,possible:68,weight:100},
      {id:5,name:"Conversation Ch.3",obtained:100,possible:100,weight:10},
      {id:6,name:"Chapter 3 Test",obtained:64.5,possible:66,weight:100},
      {id:7,name:"Conversation Ch.4/5",obtained:100,possible:100,weight:10},
      {id:8,name:"Chapter 4/5 Test",obtained:69.5,possible:73,weight:100},
      {id:9,name:"Conversation Ch.6/7",obtained:100,possible:100,weight:10},
      {id:10,name:"Chapter 6/7 Test",obtained:65.5,possible:66,weight:100},
      {id:11,name:"Vectors 1 Conversation",obtained:100,possible:100,weight:10},
      {id:13,name:"Vectors 2 Test",obtained:40,possible:40,weight:100},
    ]},
  { id:"music", code:"Music", name:"Music", color:"#CC66FF", creditWeight:1, roundTarget:0.98,
    items:[
      {id:1,name:"Pg 4 #2",obtained:19.6,possible:20,weight:20},
      {id:2,name:"Pg 4 #4",obtained:19.6,possible:20,weight:20},
      {id:3,name:"Pg 6 #4",obtained:19.6,possible:20,weight:20},
      {id:4,name:"Pg 6 #5",obtained:19.6,possible:20,weight:20},
      {id:5,name:"Pg 8 #2",obtained:19.6,possible:20,weight:20},
      {id:6,name:"Pg 8 #5",obtained:19.6,possible:20,weight:20},
      {id:7,name:"Performance Project",obtained:15,possible:15,weight:15},
      {id:8,name:"Pg 10 #4",obtained:19.6,possible:20,weight:20},
      {id:9,name:"Pg 10 #6",obtained:19.6,possible:20,weight:20},
    ]},
  { id:"chem", code:"SCH4U", name:"Chemistry", color:"#FFCC66", creditWeight:1, roundTarget:0.97,
    items:[
      {id:1,name:"Matter & Periodic Trends Test",obtained:38.5,possible:40,weight:100},
      {id:2,name:"Naming Test",obtained:60,possible:60,weight:60},
      {id:3,name:"Lab Obs Conv",obtained:97,possible:100,weight:8},
      {id:4,name:"Formula of Hydrate Lab",obtained:26,possible:26,weight:26},
      {id:5,name:"Mole Test",obtained:41.5,possible:45,weight:100},
      {id:6,name:"Discussions of Error",obtained:97,possible:100,weight:8},
      {id:7,name:"Intro Journal",obtained:3,possible:3,weight:1},
      {id:8,name:"Collab Day",obtained:1,possible:1,weight:1},
      {id:9,name:"Summary Page",obtained:97,possible:100,weight:5},
      {id:10,name:"Unit 1-2 Reflection",obtained:97,possible:100,weight:5},
      {id:11,name:"Lab and Collab Obs/Cons",obtained:97,possible:100,weight:10},
      {id:12,name:"Reactions & Stoichiometry",obtained:50,possible:50,weight:100},
      {id:13,name:"Mid Unit Assignment",obtained:10,possible:10,weight:10},
      {id:14,name:"Consolidation",obtained:5.5,possible:6,weight:2},
      {id:15,name:"Mid-Unit Assignment 2",obtained:10,possible:10,weight:10},
      {id:16,name:"Bonding Unit Test",obtained:55.3,possible:57.5,weight:100},
      {id:17,name:"Portfolio",obtained:100,possible:100,weight:10},
      {id:18,name:"Filtration Lab",obtained:35,possible:35,weight:35},
      {id:19,name:"Consolidation Day 1-5",obtained:97,possible:100,weight:10},
      {id:20,name:"Solutions Unit Test",obtained:96,possible:100,weight:100},
    ]},
  { id:"cs", code:"ICS4U", name:"Computer Science", color:"#FF7C80", creditWeight:1, roundTarget:0.95,
    items:[
      {id:1,name:"Unit Quest",obtained:58,possible:60,weight:60},
      {id:2,name:"Library Conversation",obtained:84,possible:100,weight:30},
      {id:3,name:"Unit Quest 2",obtained:33,possible:36,weight:60},
      {id:4,name:"Higher Order Array",obtained:29,possible:30,weight:35},
      {id:5,name:"Asynchronous Presentation",obtained:100,possible:100,weight:60},
      {id:6,name:"School-API Convo",obtained:97,possible:100,weight:30},
    ]},
  { id:"eng", code:"ENG4U", name:"English", color:"#FFFF00", creditWeight:1, roundTarget:0.93,
    items:[
      {id:1,name:"Sight Poetry Quiz",obtained:19.5,possible:20,weight:20},
      {id:2,name:"Poetry Critique",obtained:35.5,possible:40,weight:40},
      {id:3,name:"Macbeth Quiz",obtained:15,possible:15,weight:15},
      {id:4,name:"Macbeth Harkness",obtained:97,possible:100,weight:10},
      {id:5,name:"Music Analysis",obtained:36,possible:40,weight:40},
      {id:6,name:"Persuasive Essay",obtained:37,possible:40,weight:40},
      {id:7,name:"1984 Quiz",obtained:19.5,possible:20,weight:20},
    ]},
  { id:"phys", code:"SPH4U", name:"Physics", color:"#4472C4", creditWeight:1, roundTarget:0.99,
    items:[
      {id:1,name:"Math Skills Quiz",obtained:17.5,possible:18,weight:18},
      {id:2,name:"Kin Quiz 1",obtained:22,possible:22,weight:22},
      {id:3,name:"Kin Quiz 2",obtained:17,possible:17,weight:17},
      {id:4,name:"Kin Quiz 3",obtained:15,possible:15,weight:15},
      {id:5,name:"Kinematics Test",obtained:43.5,possible:44,weight:100},
      {id:6,name:"Reflection",obtained:1,possible:1,weight:1},
      {id:7,name:"Lab Observation",obtained:1,possible:1,weight:1},
      {id:8,name:"Kinematics Lab",obtained:9.85,possible:10,weight:20},
      {id:9,name:"Dyn Quiz 1",obtained:19,possible:19,weight:19},
      {id:10,name:"Pulley Lab",obtained:100,possible:100,weight:5},
      {id:11,name:"Dyn Quiz 2",obtained:20,possible:19,weight:19},
      {id:12,name:"Dyn Test",obtained:42,possible:42,weight:100},
      {id:13,name:"Reflection 2",obtained:1,possible:1,weight:1},
      {id:14,name:"Friction Lab",obtained:100,possible:100,weight:5},
      {id:15,name:"Friction Lab (2)",obtained:18,possible:18,weight:18},
      {id:16,name:"Energy Quiz",obtained:15,possible:15,weight:15},
      {id:17,name:"Energy Quiz 2",obtained:24,possible:24,weight:24},
      {id:18,name:"Energy Test",obtained:35.5,possible:37,weight:100},
      {id:19,name:"Reflection 3",obtained:1,possible:1,weight:1},
      {id:20,name:"Nuclear Test",obtained:40.5,possible:41,weight:100},
      {id:21,name:"Parachute Lab",obtained:98,possible:100,weight:10},
      {id:22,name:"Parachute Lab Obs",obtained:97,possible:100,weight:18},
      {id:23,name:"Test Reflection",obtained:1,possible:1,weight:1},
      {id:24,name:"E & M Quiz 1",obtained:18,possible:18,weight:18},
      {id:25,name:"Application Pres",obtained:100,possible:100,weight:16},
      {id:26,name:"E & M Quiz 2",obtained:25.5,possible:26,weight:26},
      {id:27,name:"E & M Test",obtained:38.5,possible:40,weight:100},
    ]},
];

/* ─── ASSESSMENT TRACKER (Notion-style) ─── */
const SUBJECTS_MAP = {
  "AP Statistics":   "#A8D08D",
  "Math":            "#33CCFF",
  "Music":           "#CC66FF",
  "Chemistry":       "#FFCC66",
  "Physics":         "#4472C4",
  "Computer Science":"#FF7C80",
  "English":         "#FFFF00",
  "Other":           "#94a3b8",
};
const SUBJECT_KEYS = Object.keys(SUBJECTS_MAP);

const SEED_ASSESSMENTS = [
  {id:1, name:"Consolidation Day",    subject:"Chemistry",      date:"2026-01-16", done:false, obtained:"", possible:"", notes:""},
  {id:2, name:"Math Convo",           subject:"Math",           date:"2026-01-19", done:false, obtained:"", possible:"", notes:""},
  {id:3, name:"Energy Quiz",          subject:"Physics",        date:"2026-01-20", done:true,  obtained:"15", possible:"15", notes:""},
  {id:4, name:"Unit 6 Test",          subject:"Math",           date:"2026-01-21", done:true,  obtained:"", possible:"", notes:""},
  {id:5, name:"Pg 10 #2",             subject:"Music",          date:"2026-01-23", done:true,  obtained:"19.6", possible:"20", notes:""},
  {id:6, name:"Pg 10 #4",             subject:"Music",          date:"2026-01-23", done:true,  obtained:"19.6", possible:"20", notes:""},
  {id:7, name:"Energy Quiz 2",        subject:"Physics",        date:"2026-01-28", done:true,  obtained:"24", possible:"24", notes:""},
  {id:8, name:"Bonding Test",         subject:"Chemistry",      date:"2026-02-11", done:true,  obtained:"55.3", possible:"57.5", notes:""},
  {id:9, name:"Energy Test",          subject:"Physics",        date:"2026-02-12", done:true,  obtained:"35.5", possible:"37", notes:""},
  {id:10,name:"Parachute Lab",        subject:"Physics",        date:"2026-02-18", done:true,  obtained:"98", possible:"100", notes:""},
  {id:11,name:"Unit 6 Test (Stats)",  subject:"AP Statistics",  date:"2026-02-20", done:true,  obtained:"", possible:"", notes:""},
  {id:12,name:"Vectors 2 Test",       subject:"Math",           date:"2026-03-10", done:true,  obtained:"40", possible:"40", notes:""},
  {id:13,name:"Solutions Unit Test",  subject:"Chemistry",      date:"2026-03-20", done:true,  obtained:"96", possible:"100", notes:""},
  {id:14,name:"E & M Test",           subject:"Physics",        date:"2026-04-15", done:true,  obtained:"38.5", possible:"40", notes:""},
  {id:15,name:"Limits & Continuity",  subject:"Math",           date:"2026-05-22", done:false, obtained:"", possible:"", notes:"Chapter 3 focus"},
  {id:16,name:"Persuasive Essay",     subject:"English",        date:"2026-05-27", done:false, obtained:"", possible:"", notes:"Outline done"},
  {id:17,name:"Electrochemistry Lab", subject:"Chemistry",      date:"2026-05-21", done:false, obtained:"", possible:"", notes:"Need discussion"},
  {id:18,name:"Sorting Project",      subject:"Computer Science",date:"2026-06-10",done:false, obtained:"", possible:"", notes:"Quicksort done"},
];

/* ─── TO-DO LIST (Notion-style) ─── */
const SEED_TODOS = [
  {id:1, name:"Review Chapter 3 limits",      subject:"Math",           date:"2026-05-21", done:false, priority:"High",   notes:""},
  {id:2, name:"Finish electrochemistry lab",  subject:"Chemistry",      date:"2026-05-20", done:false, priority:"High",   notes:"Discussion section"},
  {id:3, name:"Draft English essay body",     subject:"English",        date:"2026-05-23", done:false, priority:"Medium", notes:""},
  {id:4, name:"Implement quicksort",          subject:"Computer Science",date:"2026-05-26",done:false, priority:"Medium", notes:""},
  {id:5, name:"Soccer practice",              subject:"Other",          date:"2026-05-19", done:false, priority:"Low",    notes:"Extra-curricular"},
];

const PRIORITIES = ["High", "Medium", "Low"];
const PRIORITY_COLOR = { High:"#ef4444", Medium:"#f59e0b", Low:"#22c55e" };

/* ─── GRADE CALC (weighted, matches Excel) ─── */
const calcScore = (courseOrItems) => {
  const items = Array.isArray(courseOrItems) ? courseOrItems : (courseOrItems?.items || []);
  const valid = items.filter(i => i.possible > 0);
  if (!valid.length) return 0;
  const wtdSum = valid.reduce((s,i) => s + (i.obtained/i.possible)*i.weight, 0);
  const wtdTot = valid.reduce((s,i) => s + i.weight, 0);
  return wtdTot > 0 ? wtdSum / wtdTot : 0;
};
const calcOverall = (courses) => {
  if (!courses?.length) return { unrounded: 0, rounded: 0 };
  const rpcts = courses.map(c => Math.round(calcScore(c) * 100));
  const avg = rpcts.reduce((s,v)=>s+v,0) / courses.length;
  return { unrounded: avg, rounded: Math.round(avg) };
};

/* ─── HELPERS ─── */
const ltr = g => { if(g>=95)return"A+";if(g>=87)return"A";if(g>=80)return"A−";if(g>=77)return"B+";if(g>=73)return"B";if(g>=70)return"B−";if(g>=67)return"C+";if(g>=63)return"C";if(g>=60)return"C−";return"F"; };
// Grade tier colors matching Excel conditional formatting exactly
const gcol = g => {
  if (g >= 97)   return "#00B050"; // dark green  (>=97%)
  if (g >= 93)   return "#92D050"; // light green (93-96.9%)
  if (g >= 90)   return "#FFC000"; // amber       (90-92.9%)
  return "#FF0000";                // red         (<=89.9%)
};
const fmt2 = n => { const v=parseFloat(n); return isNaN(v)?"—":v.toFixed(2); };
const fmt1 = n => { const v=parseFloat(n); return isNaN(v)?"—":(v%1===0?String(v):v.toFixed(1)); };
const daysDiff = d => !d?null:Math.ceil((new Date(d)-new Date())/86400000);
const fmtDate = d => { if(!d)return"—"; const dt=new Date(d+"T12:00:00"); return dt.toLocaleDateString("en-US",{month:"long",day:"numeric",year:"numeric"}); };

/* ─── AI ─── */
function aiTodo(p){
  const lower = p.toLowerCase();
  const SUBJECT_MAP = [
    {keys:["physics","sph"],                         val:"Physics"},
    {keys:["chem","chemistry","sch"],                val:"Chemistry"},
    {keys:["math","mhf","calculus","functions"],     val:"Math"},
    {keys:["english","essay","eng"],                 val:"English"},
    {keys:["computer","cs","coding","programming"],  val:"Computer Science"},
    {keys:["music","theory"],                        val:"Music"},
    {keys:["stats","statistics"],                    val:"AP Statistics"},
  ];
  let subject = "Other";
  for (const {keys, val} of SUBJECT_MAP) {
    if (keys.some(k => lower.includes(k))) { subject = val; break; }
  }

  // Priority
  let priority = "Medium";
  if (/urgent|asap|tonight|today|due tomorrow|high/i.test(p)) priority = "High";
  else if (/low|whenever|eventually|sometime/i.test(p)) priority = "Low";
  else if (/test|exam|final|summative/i.test(p)) priority = "High";

  // Date extraction
  let date = "";
  const days = {monday:1,tuesday:2,wednesday:3,thursday:4,friday:5,saturday:6,sunday:0,
    mon:1,tue:2,wed:3,thu:4,fri:5,sat:6,sun:0,
    today:null,tomorrow:null};
  const now = new Date();
  if (/today/i.test(p)) {
    date = now.toISOString().split("T")[0];
  } else if (/tomorrow/i.test(p)) {
    const d = new Date(now); d.setDate(d.getDate()+1);
    date = d.toISOString().split("T")[0];
  } else {
    for (const [day, num] of Object.entries(days)) {
      if (lower.includes(day) && num !== null) {
        const d = new Date(now);
        const diff = (num - d.getDay() + 7) % 7 || 7;
        d.setDate(d.getDate() + diff);
        date = d.toISOString().split("T")[0];
        break;
      }
    }
  }

  const name = p.charAt(0).toUpperCase() + p.slice(1);
  return Promise.resolve({name, subject, date, priority, notes:""});
}
function aiEdsby(raw){
  const SUBJECTS = ["Physics","Chemistry","Music","English","Advanced Functions","Computer Science","AP Statistics"];
  const SUBJ_NORM = {"Advanced Functions":"Math"};
  const EXCLUDE = ["therapy dog","spirit day","frisbee","university visit","us gym","student experience",
    "waterloo","club","trip","assembly","pizza","bbq","food drive","photo","prom","talent","tbd finals"];
  const ACADEMIC = ["test","quiz","isp","exam","summative","due","lab","essay","report",
    "correction","challenge","lesson","final","assignment","playground","presentation","project"];
  const MONTHS = "Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec";

  const items = [], seen = new Set();
  const subjPat = new RegExp(`(?=${SUBJECTS.map(s=>s.replace(/ /g,'\\s')).join('|')})`, 'gi');
  const blocks = raw.split(subjPat);

  for (let block of blocks) {
    if (!block.trim()) continue;
    const lower = block.toLowerCase();
    if (EXCLUDE.some(ex => lower.includes(ex))) continue;
    if (!ACADEMIC.some(ac => lower.includes(ac))) continue;

    // Detect & strip subject from start
    let subj = "Other";
    for (const s of SUBJECTS) {
      if (block.startsWith(s)) {
        subj = SUBJ_NORM[s] || s;
        block = block.slice(s.length);
        // Strip echoed subject name if it repeats
        if (block.startsWith(s)) block = block.slice(s.length);
        break;
      }
    }

    // Extract name: strip type prefix, cut at date or "Created by" or "Due:"
    let name = block.replace(/^(Final Summative:|Test:|Assignment:|Lab:|Quiz:|ISP\s*)/i, '');
    name = name.split(/(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d/i)[0];
    name = name.split(/Due:/i)[0];
    name = name.split(/Created by:/i)[0];
    name = name.replace(/\d+:\d+\s*(?:am|pm)/gi, '').trim().replace(/[.,:\s]+$/, '');

    // Extract date
    let date = "";
    const dueM = block.match(/Due:\s*((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{1,2},?\s*\d{4})/i);
    const dateM = block.match(/((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{1,2},?\s*\d{4})/i);
    const rawDate = (dueM ? dueM[1] : dateM ? dateM[1] : "").trim();
    if (rawDate) {
      const parsed = new Date(rawDate);
      if (!isNaN(parsed)) date = parsed.toISOString().split("T")[0];
    }

    const key = name.toLowerCase().slice(0, 30);
    if (name && name.length > 2 && !seen.has(key)) {
      seen.add(key);
      items.push({name, subject: subj, date});
    }
  }
  return Promise.resolve(items);
}

/* ─── DONUT ─── */
function Donut({pct,color,size=80}){
  const r=(size-8)/2,c=2*Math.PI*r,dash=Math.min(pct||0,100)/100*c;
  return(<svg width={size} height={size} style={{transform:"rotate(-90deg)"}}>
    <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#0d1b33" strokeWidth={6}/>
    <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={6}
      strokeDasharray={`${dash} ${c}`} strokeLinecap="round" style={{transition:"stroke-dasharray .8s ease"}}/>
  </svg>);
}

/* ─── SUBJECT TAG ─── */
function SubjectTag({subject, size="sm"}){
  const color = SUBJECTS_MAP[subject]||"#64748b";
  const pad = size==="sm"?"2px 10px":"3px 12px";
  const fs  = size==="sm"?11:12;
  return <span style={{background:color,color:"#fff",borderRadius:5,padding:pad,fontSize:fs,fontWeight:700,whiteSpace:"nowrap"}}>{subject}</span>;
}

/* ─── STATUS CHECKBOX (multi-check like Notion) ─── */
function StatusChecks({done, onChange}){
  return(
    <div style={{display:"flex",alignItems:"center",gap:4}}>
      <div onClick={()=>onChange(!done)} style={{width:20,height:20,borderRadius:4,border:`2px solid ${done?"#22c55e":"#253554"}`,background:done?"#22c55e":"transparent",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",transition:"all .15s",flexShrink:0}}>
        {done&&<span style={{color:"#fff",fontSize:12,fontWeight:900,lineHeight:1}}>✓</span>}
      </div>
    </div>
  );
}

/* ─── DRAG HANDLE ─── */
function DragHandle(){
  return <div style={{cursor:"grab",padding:"0 6px",userSelect:"none",flexShrink:0}} title="Drag to reorder">
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"3px 3px",width:10}}>
      {[0,1,2,3,4,5].map(i=><div key={i} style={{width:3,height:3,borderRadius:"50%",background:"#253554"}}/>)}
    </div>
  </div>;
}

/* ─── TOAST ─── */
function Toast({msg,color}){return <div style={{position:"fixed",bottom:28,right:28,zIndex:9999,background:"#0b1425",border:`1px solid ${color}55`,color,padding:"12px 22px",borderRadius:12,fontWeight:700,fontSize:13,boxShadow:`0 0 24px ${color}33`,animation:"su .3s ease"}}>{msg}</div>;}

/* ─── INLINE EDITABLE CELL ─── */
function EditCell({value, onSave, type="text", options, style={}, displayStyle={}}){
  const [editing,setEditing]=useState(false);
  const ref=useRef();
  useEffect(()=>{if(editing&&ref.current)ref.current.focus();},[editing]);

  if(!editing) return <div onDoubleClick={()=>setEditing(true)} style={{cursor:"text",minHeight:20,...displayStyle}}>{value||<span style={{color:"#253554",fontStyle:"italic",fontSize:11}}>—</span>}</div>;

  if(type==="select") return(
    <select autoFocus ref={ref} defaultValue={value} style={{background:"#0a1525",border:"1px solid #3b82f6",borderRadius:5,color:"#e2e8f0",padding:"3px 6px",fontSize:12,outline:"none",...style}}
      onBlur={e=>{onSave(e.target.value);setEditing(false);}}
      onChange={e=>{onSave(e.target.value);setEditing(false);}}>
      {options.map(o=><option key={o}>{o}</option>)}
    </select>
  );
  return(
    <input ref={ref} type={type} defaultValue={value} style={{background:"#0a1525",border:"1px solid #3b82f6",borderRadius:5,color:"#e2e8f0",padding:"3px 6px",fontSize:12,outline:"none",width:"100%",...style}}
      onBlur={e=>{onSave(type==="number"?e.target.value:e.target.value);setEditing(false);}}
      onKeyDown={e=>{if(e.key==="Enter"){onSave(e.target.value);setEditing(false);}if(e.key==="Escape")setEditing(false);}}/>
  );
}

/* ─── NOTION-STYLE TABLE ─── */
function NotionTable({rows, onUpdateRow, onDeleteRow, onReorder, columns, addRowLabel, onAddRow, filterBar}){
  const dragItem=useRef(null), dragOver=useRef(null);
  const onDragStart=(e,i)=>{dragItem.current=i;e.dataTransfer.effectAllowed="move";};
  const onDragEnter=(_,i)=>dragOver.current=i;
  const onDragEnd=()=>{
    if(dragItem.current===null||dragOver.current===null||dragItem.current===dragOver.current){dragItem.current=null;dragOver.current=null;return;}
    const arr=[...rows];const[m]=arr.splice(dragItem.current,1);arr.splice(dragOver.current,0,m);
    onReorder(arr);dragItem.current=null;dragOver.current=null;
  };

  return(
    <div style={{background:"#07101f",borderRadius:14,overflow:"hidden",border:"1px solid #0f1e38"}}>
      {/* Toolbar */}
      <div style={{padding:"12px 16px",borderBottom:"1px solid #0a1525",display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
        <span style={{fontSize:13,fontWeight:700,color:"#f1f5f9"}}>{addRowLabel}</span>
        {filterBar}
        <div style={{flex:1}}/>
        <button onClick={onAddRow} style={{background:"#1d4ed8",color:"#fff",border:"none",borderRadius:7,padding:"6px 14px",fontSize:12,fontWeight:700,cursor:"pointer"}}>+ New</button>
      </div>
      {/* Header */}
      <div style={{display:"grid",gridTemplateColumns:columns.map(c=>c.width||"1fr").join(" "),background:"#040b14",borderBottom:"1px solid #0a1525",padding:"0 8px"}}>
        <div style={{width:28}}/>
        <div style={{width:28}}/>
        {columns.map(c=>(
          <div key={c.key} style={{padding:"8px 10px",fontSize:10,fontWeight:800,color:"#253554",letterSpacing:2,textTransform:"uppercase",display:"flex",alignItems:"center",gap:5}}>
            {c.icon&&<span style={{fontSize:12}}>{c.icon}</span>}{c.label}
          </div>
        ))}
        <div style={{width:32}}/>
      </div>
      {/* Rows */}
      {rows.length===0&&<div style={{padding:"32px",textAlign:"center",color:"#1e3a5f",fontSize:13}}>No items — click + New to add one</div>}
      {rows.map((row,idx)=>(
        <div key={row.id} draggable onDragStart={e=>onDragStart(e,idx)} onDragEnter={e=>onDragEnter(e,idx)} onDragEnd={onDragEnd} onDragOver={e=>e.preventDefault()}
          style={{display:"grid",gridTemplateColumns:["28px","28px",...columns.map(c=>c.width||"1fr"),"32px"].join(" "),borderBottom:"1px solid #0a1525",alignItems:"center",padding:"0 8px",transition:"background .15s"}}
          onMouseOver={e=>e.currentTarget.style.background="#ffffff04"} onMouseOut={e=>e.currentTarget.style.background="transparent"}>
          <DragHandle/>
          {/* checkbox */}
          <div style={{padding:"10px 4px"}}>
            <StatusChecks done={row.done} onChange={v=>onUpdateRow(row.id,"done",v)}/>
          </div>
          {/* columns */}
          {columns.map(c=>(
            <div key={c.key} style={{padding:"10px",minWidth:0,overflow:"hidden"}}>
              {c.render ? c.render(row,onUpdateRow) : (
                <EditCell value={row[c.key]} onSave={v=>onUpdateRow(row.id,c.key,v)}
                  type={c.type||"text"} options={c.options}
                  displayStyle={{fontSize:13,color:row.done?"#334155":"#e2e8f0",textDecoration:row.done?"line-through":"none",...(c.displayStyle||{})}}/>
              )}
            </div>
          ))}
          {/* delete */}
          <div style={{padding:"10px 4px",textAlign:"center"}}>
            <button onClick={()=>onDeleteRow(row.id)} style={{background:"none",border:"none",color:"#1e3a5f",cursor:"pointer",fontSize:13,padding:"2px 4px",lineHeight:1}} onMouseOver={e=>e.target.style.color="#ef4444"} onMouseOut={e=>e.target.style.color="#1e3a5f"}>✕</button>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─── COURSE CARD ─── */
function CourseCard({course,onUpdate}){
  const [open,setOpen]=useState(false);
  const [items,setItems]=useState(()=>Array.isArray(course.items)?course.items:[]);
  const [editing,setEditing]=useState(null);
  const dragItem=useRef(null),dragOver=useRef(null);

  const score=calcScore(items);
  const scorePct=score*100;
  const roundedPct=Math.round(scorePct);
  const meetsTarget=roundedPct>=Math.round(course.roundTarget*100);
  const {color}=course;

  useEffect(()=>{onUpdate({...course,items});},[items]);

  const upd=(id,f,v)=>setItems(p=>p.map(i=>i.id===id?{...i,[f]:typeof v==="string"&&f!=="name"?parseFloat(v)||0:v}:i));
  const del=id=>setItems(p=>p.filter(i=>i.id!==id));
  const add=()=>{setItems(p=>[...p,{id:Date.now(),name:"New Assessment",obtained:0,possible:100,weight:100}]);setOpen(true);};

  const onDragStart=(e,i)=>{dragItem.current=i;e.dataTransfer.effectAllowed="move";};
  const onDragEnter=(_,i)=>dragOver.current=i;
  const onDragEnd=()=>{
    if(dragItem.current===null||dragOver.current===null||dragItem.current===dragOver.current){dragItem.current=null;dragOver.current=null;return;}
    const arr=[...items];const[m]=arr.splice(dragItem.current,1);arr.splice(dragOver.current,0,m);setItems(arr);dragItem.current=null;dragOver.current=null;
  };

  const inpS={background:"#0a1525",border:"1px solid #3b82f6",borderRadius:5,color:"#e2e8f0",padding:"3px 6px",fontSize:12,outline:"none"};

  return(
    <div style={{background:"#07101f",border:`1px solid ${open?color+"55":"#0f1e38"}`,borderRadius:16,overflow:"hidden",marginBottom:11,transition:"border-color .3s",boxShadow:open?"0 8px 40px #000a":"none"}}>
      <div style={{display:"flex",alignItems:"center",gap:14,padding:"15px 18px",cursor:"pointer",borderBottom:open?"1px solid #0d1b2e":"none"}} onClick={()=>setOpen(o=>!o)}>
        <div style={{position:"relative",flexShrink:0}}>
          <Donut pct={scorePct} color={color} size={74}/>
          <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
            <span style={{fontSize:13,fontWeight:900,color,fontFamily:"'Fira Code',monospace",lineHeight:1}}>{scorePct.toFixed(0)}</span>
            <span style={{fontSize:8,color:color+"aa",fontWeight:700}}>%</span>
          </div>
        </div>
        <div style={{flex:1,minWidth:0}}>
          <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:3}}>
            <span style={{fontSize:10,fontWeight:800,letterSpacing:3,color,fontFamily:"'Fira Code',monospace"}}>{course.code}</span>
            <span style={{fontSize:10,color:"#1e3a5f",background:"#0d1b2e",padding:"1px 7px",borderRadius:10,fontWeight:700}}>{items.length} items</span>
          </div>
          <div style={{fontSize:14,fontWeight:800,color:"#f1f5f9",marginBottom:7}}>{course.name}</div>
          <div style={{display:"flex",gap:7,flexWrap:"wrap",alignItems:"center"}}>
            <span style={{fontSize:11,fontWeight:700,color,background:color+"18",border:`1px solid ${color}33`,borderRadius:6,padding:"2px 9px",fontFamily:"'Fira Code',monospace"}}>{ltr(scorePct)} · {scorePct.toFixed(2)}%</span>
            <span style={{fontSize:11,fontWeight:700,color:meetsTarget?"#22c55e":"#f59e0b",background:meetsTarget?"#22c55e15":"#f59e0b15",border:`1px solid ${meetsTarget?"#22c55e33":"#f59e0b33"}`,borderRadius:6,padding:"2px 9px"}}>
              {meetsTarget?"✓":"→"} rounds to {roundedPct}%
            </span>
            {!meetsTarget&&<span style={{fontSize:10,color:"#475569"}}>need +{((course.roundTarget-score)*100).toFixed(2)}%</span>}
          </div>
        </div>
        <div style={{width:90,flexShrink:0,display:"flex",flexDirection:"column",gap:4}}>
          {[["Raw",scorePct,color],["Rounded",roundedPct,meetsTarget?"#22c55e":"#f59e0b"],["Target",course.roundTarget*100,"#253554"]].map(([l,v,c])=>(
            <div key={l}>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:9,color:"#253554",marginBottom:1,fontWeight:700,letterSpacing:.3}}>
                <span>{l}</span><span style={{color:c,fontFamily:"'Fira Code',monospace"}}>{Number(v).toFixed(2)}%</span>
              </div>
              <div style={{background:"#0a1525",borderRadius:3,height:3,overflow:"hidden"}}>
                <div style={{width:`${Math.min(v,100)}%`,height:"100%",background:c,borderRadius:3,transition:"width .8s"}}/>
              </div>
            </div>
          ))}
        </div>
        <span style={{fontSize:16,color:"#1e3a5f",transition:"transform .3s",transform:open?"rotate(180deg)":"none",flexShrink:0}}>⌄</span>
      </div>

      {open&&(
        <div style={{animation:"fadeDown .2s ease"}}>
          <table style={{width:"100%",borderCollapse:"collapse"}}>
            <thead>
              <tr style={{background:"#040b14"}}>
                <th style={{width:28}}/>
                {["Assessment","Obtained","Possible","Grade","Weight",""].map(h=>(
                  <th key={h} style={{padding:"7px 10px",fontSize:10,fontWeight:800,color:"#1e3a5f",letterSpacing:2,textTransform:"uppercase",textAlign:h==="Assessment"?"left":"center",whiteSpace:"nowrap"}}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map((item,idx)=>{
                const p=item.possible>0?(item.obtained/item.possible)*100:0;
                const c=gcol(p);
                const isE=(f)=>editing?.id===item.id&&editing?.f===f;
                const startE=(f,e)=>{e.stopPropagation();setEditing({id:item.id,f});};
                const stopE=(f,v)=>{if(f==="name")setItems(p=>p.map(i=>i.id===item.id?{...i,name:v}:i));else upd(item.id,f,v);setEditing(null);};
                const EI=(f,type="text",w=70)=>(
                  isE(f)?<input type={type} autoFocus defaultValue={item[f]} style={{...inpS,width:type==="text"?"100%":w,textAlign:type==="number"?"center":"left"}}
                    onBlur={e=>stopE(f,e.target.value)} onKeyDown={e=>e.key==="Enter"&&stopE(f,e.target.value)} onClick={e=>e.stopPropagation()}/>
                  :<span style={{cursor:"text",fontFamily:type==="number"?"'Fira Code',monospace":"inherit"}}>{type==="number"?fmt1(item[f]):item[f]}</span>
                );
                return(
                  <tr key={item.id} draggable onDragStart={e=>onDragStart(e,idx)} onDragEnter={e=>onDragEnter(e,idx)} onDragEnd={onDragEnd} onDragOver={e=>e.preventDefault()}
                    style={{borderBottom:"1px solid #091525",transition:"background .15s"}}
                    onMouseOver={e=>e.currentTarget.style.background="#ffffff05"} onMouseOut={e=>e.currentTarget.style.background="transparent"}>
                    <td style={{padding:"4px 4px 4px 8px"}} onClick={e=>e.stopPropagation()}><DragHandle/></td>
                    <td style={{padding:"8px 10px",maxWidth:220}} onDoubleClick={e=>startE("name",e)}>{EI("name","text")}</td>
                    <td style={{padding:"8px 10px",textAlign:"center"}} onDoubleClick={e=>startE("obtained",e)} onClick={e=>e.stopPropagation()}>{EI("obtained","number")}</td>
                    <td style={{padding:"8px 10px",textAlign:"center"}} onDoubleClick={e=>startE("possible",e)} onClick={e=>e.stopPropagation()}>{EI("possible","number")}</td>
                    <td style={{padding:"8px 10px",textAlign:"center"}}>
                      <div style={{display:"flex",alignItems:"center",gap:6}}>
                        <div style={{flex:1,background:"#0a1525",borderRadius:3,height:5,overflow:"hidden"}}>
                          <div style={{width:`${Math.min(p,100)}%`,height:"100%",background:c,borderRadius:3}}/>
                        </div>
                        <span style={{fontSize:11,color:c,fontFamily:"'Fira Code',monospace",minWidth:46,textAlign:"right"}}>{p.toFixed(2)}%</span>
                      </div>
                    </td>
                    <td style={{padding:"8px 10px",textAlign:"center"}} onDoubleClick={e=>startE("weight",e)} onClick={e=>e.stopPropagation()}>{EI("weight","number")}</td>
                    <td style={{padding:"8px 6px",textAlign:"center"}} onClick={e=>e.stopPropagation()}>
                      <button onClick={()=>del(item.id)} style={{background:"none",border:"none",color:"#1e3a5f",cursor:"pointer",fontSize:12,padding:"2px 4px"}} onMouseOver={e=>e.target.style.color="#ef4444"} onMouseOut={e=>e.target.style.color="#1e3a5f"}>✕</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div style={{padding:"10px 14px",display:"flex",justifyContent:"space-between",alignItems:"center",background:"#040b14",borderTop:"1px solid #091525"}}>
            <button onClick={e=>{e.stopPropagation();add();}} style={{background:"#0d1b2e",border:"1px dashed #1e3a5f",borderRadius:7,color:"#3b82f6",padding:"5px 12px",fontSize:11,fontWeight:600,cursor:"pointer"}}>+ Add Assessment</button>
            <span style={{fontSize:11,color:"#334155",fontFamily:"'Fira Code',monospace"}}>
              Grade: <span style={{color,fontWeight:700}}>{scorePct.toFixed(2)}%</span>
              <span style={{color:"#253554",marginLeft:8}}>→ <span style={{color:meetsTarget?"#22c55e":"#f59e0b",fontWeight:700}}>{roundedPct}%</span></span>
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── SubjectCell (top-level component for hooks) ─── */
function SubjectCell({row, onU}){
  const [editing, setEditing] = useState(false);
  return editing
    ? <select autoFocus defaultValue={row.subject} style={{background:"#0a1525",border:"1px solid #3b82f6",borderRadius:5,color:"#e2e8f0",padding:"3px 6px",fontSize:12,outline:"none"}}
        onBlur={e=>{onU(row.id,"subject",e.target.value);setEditing(false);}}
        onChange={e=>{onU(row.id,"subject",e.target.value);setEditing(false);}}>
        {SUBJECT_KEYS.map(s=><option key={s}>{s}</option>)}
      </select>
    : <div onDoubleClick={()=>setEditing(true)} style={{cursor:"pointer"}}><SubjectTag subject={row.subject}/></div>;
}

/* ─── PriorityCell (top-level component for hooks) ─── */
function PriorityCell({row, onU}){
  const [editing, setEditing] = useState(false);
  const c = PRIORITY_COLOR[row.priority] || "#64748b";
  return editing
    ? <select autoFocus defaultValue={row.priority} style={{background:"#0a1525",border:"1px solid #3b82f6",borderRadius:5,color:"#e2e8f0",padding:"3px 6px",fontSize:12,outline:"none"}}
        onBlur={e=>{onU(row.id,"priority",e.target.value);setEditing(false);}}
        onChange={e=>{onU(row.id,"priority",e.target.value);setEditing(false);}}>
        {PRIORITIES.map(p=><option key={p}>{p}</option>)}
      </select>
    : <div onDoubleClick={()=>setEditing(true)} style={{cursor:"pointer"}}>
        <span style={{background:c+"22",color:c,border:`1px solid ${c}44`,borderRadius:5,padding:"2px 9px",fontSize:11,fontWeight:700}}>{row.priority}</span>
      </div>;
}

/* ─── MAIN APP ─── */
export default function App(){
  const [tab,setTab]=useState("assessments");
  const [courses,setCourses]=useState(()=>{
    const s=recall("ian_c_v8",INITIAL_COURSES);
    return s.map(c=>({...c,items:Array.isArray(c.items)?c.items:[]}));
  });
  const [assessments,setAssessments]=useState(()=>recall("ian_as_v8",SEED_ASSESSMENTS));
  const [todos,setTodos]=useState(()=>recall("ian_td_v8",SEED_TODOS));
  const [toast,setToast]=useState(null);

  // assessment filters
  const [fSubject,setFSubject]=useState("All");
  const [fDone,setFDone]=useState("All"); // All | Done | Pending
  const [showEdsby,setShowEdsby]=useState(false);
  const [eText,setEText]=useState("");
  const [eLoad,setELoad]=useState(false);

  // todo filters
  const [tSubject,setTSubject]=useState("All");
  const [tPriority,setTPriority]=useState("All");
  const [tInput,setTInput]=useState("");
  const [tLoad,setTLoad]=useState(false);

  useEffect(()=>{persist("ian_c_v8",courses);},[courses]);
  useEffect(()=>{persist("ian_as_v8",assessments);},[assessments]);
  useEffect(()=>{persist("ian_td_v8",todos);},[todos]);

  const notify=(msg,color="#22c55e")=>{setToast({msg,color});setTimeout(()=>setToast(null),3000);};

  const {unrounded,rounded}=calcOverall(courses);
  const updateCourse=u=>setCourses(p=>p.map(c=>c.id===u.id?u:c));

  /* ── assessment actions ── */
  const uA=(id,f,v)=>setAssessments(p=>p.map(a=>a.id===id?{...a,[f]:v}:a));
  const dA=id=>setAssessments(p=>p.filter(a=>a.id!==id));
  const addA=()=>setAssessments(p=>[{id:Date.now(),name:"New Assessment",subject:"Other",date:"",done:false,obtained:"",possible:"",notes:""},...p]);
  const importEdsby=async()=>{
    if(!eText.trim())return;setELoad(true);
    try{const items=await aiEdsby(eText);const ni=items.map(i=>({id:Date.now()+Math.random(),name:i.name,subject:i.subject||"Other",date:i.date||"",done:false,obtained:"",possible:"",notes:""}));setAssessments(p=>[...ni,...p]);setEText("");setShowEdsby(false);notify(`✓ ${ni.length} item(s) imported`);}
    catch{notify("Parse error","#ef4444");}
    setELoad(false);
  };

  const filtA=assessments.filter(a=>(fSubject==="All"||a.subject===fSubject)&&(fDone==="All"||(fDone==="Done"?a.done:!a.done))).sort((a,b)=>a.date<b.date?-1:1);

  /* ── todo actions ── */
  const uT=(id,f,v)=>setTodos(p=>p.map(t=>t.id===id?{...t,[f]:v}:t));
  const dT=id=>setTodos(p=>p.filter(t=>t.id!==id));
  const addT=()=>setTodos(p=>[{id:Date.now(),name:"New Task",subject:"Other",date:"",done:false,priority:"Medium",notes:""},...p]);
  const addTAI=async()=>{
    if(!tInput.trim())return;setTLoad(true);
    try{const item=await aiTodo(tInput);setTodos(p=>[{id:Date.now(),...item,done:false},...p]);setTInput("");notify("✓ Task added");}
    catch{setTodos(p=>[{id:Date.now(),name:tInput,subject:"Other",date:"",done:false,priority:"Medium",notes:""},...p]);setTInput("");notify("Task added","#3b82f6");}
    setTLoad(false);
  };

  const filtT=todos.filter(t=>(tSubject==="All"||t.subject===tSubject)&&(tPriority==="All"||t.priority===tPriority)).sort((a,b)=>{
    const p={High:0,Medium:1,Low:2};if(!a.done&&b.done)return-1;if(a.done&&!b.done)return 1;return(p[a.priority]||1)-(p[b.priority]||1);
  });

  const dueWeek=assessments.filter(a=>{const d=daysDiff(a.date);return d!==null&&d>=0&&d<=7&&!a.done;}).length;
  const doneT=todos.filter(t=>t.done).length;

  // styles
  const inp={background:"#080f20",border:"1px solid #152140",borderRadius:8,color:"#e2e8f0",padding:"8px 10px",fontSize:12,outline:"none",boxSizing:"border-box"};
  const btn=(bg="#3b82f6",fg="#fff")=>({background:bg,color:fg,border:"none",borderRadius:8,padding:"8px 14px",fontWeight:700,fontSize:12,cursor:"pointer",whiteSpace:"nowrap"});
  const cardS={background:"#080f20",border:"1px solid #101e38",borderRadius:16,overflow:"hidden",marginBottom:18};
  const selS={...inp,width:"auto",padding:"6px 10px"};

  const navs=[["assessments","📋","Assessments"],["todo","✅","To-Do"],["grades","📊","Grades"],["edsby","🎓","Edsby"]];
  const todayStr=new Date().toLocaleDateString("en-CA",{weekday:"long",month:"long",day:"numeric"});

  /* ── assessment columns ── */
  const assessCols=[
    {key:"name",label:"Name",icon:"Aα",width:"2fr",
      render:(row,onU)=><EditCell value={row.name} onSave={v=>onU(row.id,"name",v)} displayStyle={{fontSize:13,color:row.done?"#334155":"#f1f5f9",fontWeight:600,textDecoration:row.done?"line-through":"none"}}/>},
    {key:"subject",label:"Subject",icon:"≔",width:"140px",
      render:(row,onU)=><EditCell value={row.subject} onSave={v=>onU(row.id,"subject",v)} type="select" options={SUBJECT_KEYS}
        displayStyle={{}} /* overridden below via custom render *//>
    },
    {key:"date",label:"Assessment Date",icon:"📅",width:"160px",
      render:(row,onU)=><EditCell value={row.date} onSave={v=>onU(row.id,"date",v)} type="date"
        displayStyle={{fontSize:12,color:"#94a3b8"}}/>},
    {key:"score",label:"For or Of",icon:"⊙",width:"130px",
      render:(row,onU)=>(
        <div style={{display:"flex",alignItems:"center",gap:4,fontSize:12,fontFamily:"'Fira Code',monospace"}}>
          <input type="number" placeholder="—" value={row.obtained} onChange={e=>onU(row.id,"obtained",e.target.value)}
            style={{...inp,width:48,padding:"2px 4px",textAlign:"center",fontSize:12}} title="Obtained"/>
          <span style={{color:"#253554"}}>/</span>
          <input type="number" placeholder="—" value={row.possible} onChange={e=>onU(row.id,"possible",e.target.value)}
            style={{...inp,width:48,padding:"2px 4px",textAlign:"center",fontSize:12}} title="Possible"/>
        </div>
      )},
    {key:"pct",label:"%",width:"90px",
      render:(row)=>{
        const o=parseFloat(row.obtained),p=parseFloat(row.possible);
        if(isNaN(o)||isNaN(p)||p===0)return <span style={{color:"#253554",fontSize:12}}>—</span>;
        const pct=(o/p)*100,c=gcol(pct);
        return <span style={{fontSize:12,fontWeight:700,color:c,fontFamily:"'Fira Code',monospace"}}>{pct.toFixed(2)}%</span>;
      }},
    {key:"notes",label:"Notes",width:"1fr",
      render:(row,onU)=><EditCell value={row.notes} onSave={v=>onU(row.id,"notes",v)} displayStyle={{fontSize:12,color:"#475569",fontStyle:row.notes?"normal":"italic"}}/>},
  ];

  assessCols[1].render=(row,onU)=><SubjectCell row={row} onU={onU}/>;

  /* ── todo columns ── */
  const todoCols=[
    {key:"name",label:"Name",icon:"Aα",width:"2fr",
      render:(row,onU)=><EditCell value={row.name} onSave={v=>onU(row.id,"name",v)} displayStyle={{fontSize:13,color:row.done?"#334155":"#f1f5f9",fontWeight:600,textDecoration:row.done?"line-through":"none"}}/>},
    {key:"subject",label:"Subject",icon:"≔",width:"140px",
      render:(row,onU)=><SubjectCell row={row} onU={onU}/>},
    {key:"date",label:"Due Date",icon:"📅",width:"160px",
      render:(row,onU)=>{
        const d=daysDiff(row.date);const ov=d!==null&&d<0&&!row.done;
        return(<div>
          <EditCell value={row.date} onSave={v=>onU(row.id,"date",v)} type="date" displayStyle={{fontSize:12,color:"#94a3b8"}}/>
          {row.date&&<div style={{fontSize:10,color:ov?"#ef4444":d===0?"#f59e0b":"#334155",marginTop:2}}>{d===0?"Today!":d>0?`${d}d left`:ov?`${Math.abs(d)}d overdue`:""}</div>}
        </div>);
      }},
    {key:"priority",label:"Priority",icon:"⊙",width:"110px",
      render:(row,onU)=><PriorityCell row={row} onU={onU}/>},
    {key:"notes",label:"Notes",width:"1fr",
      render:(row,onU)=><EditCell value={row.notes} onSave={v=>onU(row.id,"notes",v)} displayStyle={{fontSize:12,color:"#475569",fontStyle:row.notes?"normal":"italic"}}/>},
  ];

  return(
    <div style={{minHeight:"100vh",background:"#040b18",color:"#cbd5e1",fontFamily:"'Outfit',sans-serif",display:"flex"}}>
      {toast&&<Toast msg={toast.msg} color={toast.color}/>}

      {/* SIDEBAR */}
      <nav style={{width:220,background:"#050d1c",borderRight:"1px solid #0d1b33",padding:"28px 0",display:"flex",flexDirection:"column",position:"fixed",top:0,bottom:0,left:0,zIndex:100}}>
        <div style={{padding:"0 22px 22px",borderBottom:"1px solid #0d1b33"}}>
          <div style={{fontSize:10,fontWeight:800,letterSpacing:4,color:"#3b82f6",fontFamily:"'Fira Code',monospace"}}>BVG · IAN LUK</div>
          <div style={{fontSize:20,fontWeight:900,color:"#f1f5f9",marginTop:4,letterSpacing:-.5}}>StudyHub</div>
          <div style={{fontSize:11,color:"#1e3a5f",marginTop:3}}>{todayStr}</div>
        </div>
        <div style={{marginTop:14,flex:1}}>
          {navs.map(([k,ic,lb])=>(
            <div key={k} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 22px",cursor:"pointer",fontSize:13,fontWeight:tab===k?700:500,color:tab===k?"#f1f5f9":"#3d5270",background:tab===k?"#1e3a8a1a":"transparent",borderLeft:tab===k?"2px solid #3b82f6":"2px solid transparent",transition:"all .15s"}} onClick={()=>setTab(k)}>
              <span style={{fontSize:15}}>{ic}</span><span>{lb}</span>
              {k==="assessments"&&dueWeek>0&&<span style={{marginLeft:"auto",background:"#ef4444",color:"#fff",borderRadius:10,fontSize:10,fontWeight:900,padding:"1px 7px"}}>{dueWeek}</span>}
            </div>
          ))}
        </div>
        <div style={{padding:"16px 22px",borderTop:"1px solid #0d1b33"}}>
          <div style={{fontSize:10,color:"#253554",fontWeight:800,letterSpacing:2,textTransform:"uppercase",marginBottom:7}}>Overall Average</div>
          <div style={{display:"flex",alignItems:"baseline",gap:12,marginBottom:4}}>
            <div>
              <div style={{fontSize:9,color:"#253554",fontWeight:700,letterSpacing:1,marginBottom:1}}>UNROUNDED</div>
              <div style={{fontSize:20,fontWeight:900,color:gcol(unrounded),fontFamily:"'Fira Code',monospace"}}>{unrounded.toFixed(2)}%</div>
            </div>
            <div style={{width:1,height:28,background:"#1e3a5f"}}/>
            <div>
              <div style={{fontSize:9,color:"#253554",fontWeight:700,letterSpacing:1,marginBottom:1}}>ROUNDED</div>
              <div style={{fontSize:20,fontWeight:900,color:"#22c55e",fontFamily:"'Fira Code',monospace"}}>{rounded.toFixed(2)}%</div>
            </div>
          </div>
          <div style={{fontSize:11,color:"#253554",marginBottom:4}}>Tasks: <strong style={{color:"#3b82f6"}}>{doneT}/{todos.length}</strong></div>
          <div style={{fontSize:11,color:"#253554"}}>Assessments done: <strong style={{color:"#22c55e"}}>{assessments.filter(a=>a.done).length}/{assessments.length}</strong></div>
        </div>
      </nav>

      {/* MAIN */}
      <main style={{marginLeft:220,flex:1,padding:"32px 36px 80px",minHeight:"100vh"}}>

        {/* ══ ASSESSMENTS ══ */}
        {tab==="assessments"&&<>
          <div style={{fontSize:24,fontWeight:900,color:"#f1f5f9",letterSpacing:-.5,marginBottom:3}}>Assessment Tracker</div>
          <div style={{fontSize:12,color:"#253554",marginBottom:20}}>Double-click any cell to edit · Drag ⠿ to reorder · Check ✓ when done</div>

          {/* Filter bar */}
          <div style={{display:"flex",gap:8,marginBottom:16,flexWrap:"wrap",alignItems:"center"}}>
            <select style={selS} value={fSubject} onChange={e=>setFSubject(e.target.value)}>
              <option>All</option>{SUBJECT_KEYS.map(s=><option key={s}>{s}</option>)}
            </select>
            <select style={selS} value={fDone} onChange={e=>setFDone(e.target.value)}>
              <option value="All">All</option><option value="Pending">Pending</option><option value="Done">Done</option>
            </select>
            <div style={{flex:1}}/>
            <button style={btn("#060d1e","#3b82f6")} onClick={()=>setShowEdsby(true)}>🎓 Import Edsby</button>
          </div>

          {/* Edsby panel */}
          {showEdsby&&<div style={{...cardS,padding:22,marginBottom:14,border:"1px solid #ef444422"}}>
            <div style={{fontWeight:800,fontSize:14,marginBottom:8,color:"#f1f5f9"}}>🎓 Import from Edsby</div>
            <div style={{background:"#060d1e",borderRadius:9,padding:13,marginBottom:12,fontSize:12,color:"#3d5270",fontFamily:"'Fira Code',monospace",lineHeight:1.9,border:"1px solid #0d1b33"}}>
              <span style={{color:"#3b82f6"}}>1</span> → Log into bayviewglen.edsby.com<br/>
              <span style={{color:"#3b82f6"}}>2</span> → Assessments page → Ctrl+A → Ctrl+C<br/>
              <span style={{color:"#22c55e"}}>✓</span> Auto-filters therapy dogs, spirit days, social events
            </div>
            <textarea style={{...inp,width:"100%",height:120,resize:"vertical",fontFamily:"monospace",fontSize:12}} placeholder="Paste Edsby content…" value={eText} onChange={e=>setEText(e.target.value)}/>
            <div style={{display:"flex",gap:8,marginTop:10}}>
              <button style={btn(eLoad?"#1e3a8a":"#3b82f6")} onClick={importEdsby} disabled={eLoad}>{eLoad?"⏳ Parsing…":"⚡ Import from Edsby"}</button>
              <button style={btn("#0b1425","#475569")} onClick={()=>setShowEdsby(false)}>Cancel</button>
            </div>
          </div>}

          <NotionTable
            rows={filtA}
            onUpdateRow={uA}
            onDeleteRow={dA}
            onReorder={r=>setAssessments(r)}
            columns={assessCols}
            addRowLabel={`${filtA.length} assessments`}
            onAddRow={addA}
            filterBar={null}
          />
        </>}

        {/* ══ TO-DO ══ */}
        {tab==="todo"&&<>
          <div style={{fontSize:24,fontWeight:900,color:"#f1f5f9",letterSpacing:-.5,marginBottom:3}}>To-Do List</div>
          <div style={{fontSize:12,color:"#253554",marginBottom:20}}>Double-click any cell to edit · Drag ⠿ to reorder · AI-powered quick add</div>

          {/* AI quick add */}
          <div style={{...cardS,padding:16,marginBottom:16,border:"1px solid #1d4ed81a"}}>
            <div style={{fontSize:10,color:"#253554",fontWeight:800,letterSpacing:2,textTransform:"uppercase",marginBottom:8}}>Quick Add</div>
            <div style={{display:"flex",gap:8}}>
              <input style={{...inp,flex:1}} placeholder="e.g. 'study for chemistry test Thursday' or 'soccer practice tomorrow'" value={tInput} onChange={e=>setTInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addTAI()}/>
              <button style={btn(tLoad?"#1e3a8a":"#3b82f6")} onClick={addTAI} disabled={tLoad}>{tLoad?"⏳":"+ Add"}</button>
            </div>
          </div>

          {/* Filter bar */}
          <div style={{display:"flex",gap:8,marginBottom:16,flexWrap:"wrap",alignItems:"center"}}>
            <select style={selS} value={tSubject} onChange={e=>setTSubject(e.target.value)}>
              <option>All</option>{SUBJECT_KEYS.map(s=><option key={s}>{s}</option>)}
            </select>
            <select style={selS} value={tPriority} onChange={e=>setTPriority(e.target.value)}>
              <option value="All">All Priorities</option>{PRIORITIES.map(p=><option key={p}>{p}</option>)}
            </select>
            <div style={{flex:1}}/>
            <span style={{fontSize:11,color:"#253554"}}>{doneT}/{todos.length} done</span>
          </div>

          <NotionTable
            rows={filtT}
            onUpdateRow={uT}
            onDeleteRow={dT}
            onReorder={r=>setTodos(r)}
            columns={todoCols}
            addRowLabel={`${filtT.length} tasks`}
            onAddRow={addT}
            filterBar={null}
          />
        </>}

        {/* ══ GRADES ══ */}
        {tab==="grades"&&<>
          <div style={{fontSize:24,fontWeight:900,color:"#f1f5f9",letterSpacing:-.5,marginBottom:3}}>Grade Tracker</div>
          <div style={{fontSize:12,color:"#253554",marginBottom:20}}>Click to expand · Double-click cells to edit · Drag ⠿ to reorder · All marks to 2 decimal places</div>

          {/* Overall hero */}
          <div style={{background:"linear-gradient(135deg,#07101f,#0c1830)",border:"1px solid #1e3a5f33",borderRadius:18,padding:"20px 26px",marginBottom:20,display:"flex",alignItems:"center",gap:22,flexWrap:"wrap"}}>
            <div style={{position:"relative",flexShrink:0}}>
              <Donut pct={unrounded} color={gcol(unrounded)} size={88}/>
              <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
                <span style={{fontSize:10,fontWeight:900,color:gcol(unrounded),fontFamily:"'Fira Code',monospace"}}>{ltr(unrounded)}</span>
              </div>
            </div>
            <div style={{flex:1,minWidth:180}}>
              <div style={{fontSize:10,color:"#253554",fontWeight:800,letterSpacing:2,textTransform:"uppercase",marginBottom:6}}>Term 1 Overall Average</div>
              <div style={{display:"flex",alignItems:"baseline",gap:18,marginBottom:5,flexWrap:"wrap"}}>
                <div>
                  <div style={{fontSize:9,color:"#475569",fontWeight:700,letterSpacing:1,marginBottom:1}}>UNROUNDED</div>
                  <div style={{fontSize:34,fontWeight:900,color:gcol(unrounded),fontFamily:"'Fira Code',monospace",lineHeight:1}}>{unrounded.toFixed(2)}<span style={{fontSize:15}}>%</span></div>
                </div>
                <div style={{width:1,height:40,background:"#1e3a5f",flexShrink:0}}/>
                <div>
                  <div style={{fontSize:9,color:"#475569",fontWeight:700,letterSpacing:1,marginBottom:1}}>ROUNDED</div>
                  <div style={{fontSize:34,fontWeight:900,color:"#22c55e",fontFamily:"'Fira Code',monospace",lineHeight:1}}>{rounded.toFixed(2)}<span style={{fontSize:15}}>%</span></div>
                </div>
              </div>
              <div style={{fontSize:11,color:"#253554"}}>Each course rounded to nearest % → averaged → rounded</div>
            </div>
            <div style={{display:"flex",flexWrap:"wrap",gap:6,maxWidth:380}}>
              {courses.map(c=>{const sp=calcScore(c)*100,rnd=Math.round(sp);return(
                <div key={c.id} style={{display:"flex",alignItems:"center",gap:5,background:"#0a1525",borderRadius:8,padding:"4px 9px",border:`1px solid ${c.color}22`}}>
                  <div style={{width:6,height:6,borderRadius:"50%",background:c.color}}/>
                  <span style={{fontSize:10,color:"#475569",fontWeight:600}}>{c.code}</span>
                  <span style={{fontSize:10,fontWeight:800,color:gcol(sp),fontFamily:"'Fira Code',monospace"}}>{sp.toFixed(2)}%</span>
                  <span style={{fontSize:10,color:"#22c55e",fontWeight:700}}>→{rnd}%</span>
                </div>
              );})}
            </div>
          </div>

          {courses.map(c=><CourseCard key={c.id} course={c} onUpdate={updateCourse}/>)}
        </>}

        {/* ══ EDSBY ══ */}
        {tab==="edsby"&&<>
          <div style={{fontSize:24,fontWeight:900,color:"#f1f5f9",letterSpacing:-.5,marginBottom:3}}>Edsby Import</div>
          <div style={{fontSize:12,color:"#253554",marginBottom:22}}>Smart filter — extracts only real academic items</div>
          <div style={{...cardS,padding:26,maxWidth:660}}>
            <div style={{background:"#060d1e",borderRadius:10,padding:14,marginBottom:18,fontSize:12,color:"#3d5270",fontFamily:"'Fira Code',monospace",lineHeight:2,border:"1px solid #0d1b33"}}>
              <span style={{color:"#3b82f6"}}>1</span> → Open bayviewglen.edsby.com and log in<br/>
              <span style={{color:"#3b82f6"}}>2</span> → Go to your Assessments page<br/>
              <span style={{color:"#3b82f6"}}>3</span> → Ctrl+A → Ctrl+C to copy all text<br/>
              <span style={{color:"#3b82f6"}}>4</span> → Paste below and Import<br/>
              <span style={{color:"#22c55e"}}>✓ AI removes:</span> <span style={{color:"#334155"}}>therapy dogs, spirit days, announcements</span>
            </div>
            <textarea style={{...inp,width:"100%",height:200,resize:"vertical",fontFamily:"monospace",fontSize:12,lineHeight:1.6}} placeholder="Paste Edsby page text here…" value={eText} onChange={e=>setEText(e.target.value)}/>
            <button style={{...btn(eLoad?"#1e3a8a":"#3b82f6"),marginTop:12,width:"100%",padding:"12px 0",fontSize:14}} onClick={importEdsby} disabled={eLoad}>
              {eLoad?"⏳ AI filtering…":"⚡ Import from Edsby → Assessment Tracker"}
            </button>
          </div>
        </>}
      </main>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&family=Fira+Code:wght@400;700&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}body{background:#040b18;}
        ::-webkit-scrollbar{width:5px;height:5px;}::-webkit-scrollbar-track{background:#040b18;}::-webkit-scrollbar-thumb{background:#0d1b33;border-radius:3px;}
        input:focus,textarea:focus,select:focus{border-color:#3b82f6!important;outline:none;}
        @keyframes su{from{opacity:0;transform:translateY(10px);}to{opacity:1;transform:translateY(0);}}
        @keyframes fadeDown{from{opacity:0;transform:translateY(-6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
    </div>
  );
}