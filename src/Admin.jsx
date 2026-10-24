import {useEffect,useRef,useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {Html5QrcodeScanner} from 'html5-qrcode';
import {api,err,dl,useApp} from './api';
import {AuthShell} from './Student';
export function AdminLogin(){
 const{login}=useApp(),nav=useNavigate(),[f,setF]=useState({id:'',password:''}),[e,setE]=useState(''),[loading,setLoading]=useState(false),[success,setSuccess]=useState(false);
 const handleSubmit = async (ev) => {
   if (ev) ev.preventDefault();
   if (loading || success) return;
   setE('');
   setLoading(true);
   try {
     const { data } = await api.post('/auth/admin', f);
     setSuccess(true);
     login(data);
     setTimeout(() => {
       nav('/admin');
     }, 850);
   } catch (x) {
     setE(err(x));
     setLoading(false);
   }
 };
 return (
   <AuthShell title="Admin login" sub="Manage events, attendance and certificates.">
     {success && (
       <div className="auth-transition-overlay">
         <div className="auth-transition-box">
           <div className="auth-spinner" />
           <h3>Admin Authenticated!</h3>
           <p className="mut">Opening Admin Console...</p>
         </div>
       </div>
     )}
     <form onSubmit={handleSubmit} style={{display:'flex',flexDirection:'column',gap:'14px',width:'100%'}}>
       <div>
         <label style={{display:'block',marginBottom:'4px',fontWeight:600,fontSize:'.9rem'}}>Admin User ID</label>
         <input
           required
           autoFocus
           placeholder="Admin User ID"
           value={f.id}
           onChange={x => setF({...f, id: x.target.value})}
           disabled={loading || success}
         />
       </div>
       <div>
         <label style={{display:'block',marginBottom:'4px',fontWeight:600,fontSize:'.9rem'}}>Password</label>
         <input
           required
           type="password"
           placeholder="Password"
           value={f.password}
           onChange={x => setF({...f, password: x.target.value})}
           disabled={loading || success}
         />
       </div>
       {e && <div className="note bad" style={{margin:'4px 0'}}>{e}</div>}
       <button
         type="submit"
         className="btn big auth-submit-btn"
         disabled={loading || success}
         style={{marginTop:'8px'}}
       >
         {loading ? (
           <>
             <span className="btn-spinner" />
             <span>Verifying...</span>
           </>
         ) : (
           <span>Login to Admin</span>
         )}
       </button>
     </form>
   </AuthShell>
 );
}
const Pick=({ev,v,set,allLabel})=><select value={v} onChange={x=>set(x.target.value)}>{allLabel&&<option value="all">{allLabel}</option>}{!allLabel&&<option value="">Select an event</option>}{ev.map(e=><option key={e._id} value={e._id}>{e.title}</option>)}</select>;
function Brand({close}){
 const{cfg,load}=useApp(),[f,setF]=useState({collegeName:cfg.collegeName||'',address:cfg.address||'',signatory:cfg.signatory||'',designation:cfg.designation||'',contactName:cfg.contactName||'',contactEmail:cfg.contactEmail||'',contactPhone:cfg.contactPhone||''}),[fl,setFl]=useState({}),[loading,setLoading]=useState(false);
 const save=async()=>{setLoading(true);try{const d=new FormData();Object.entries(f).forEach(([k,v])=>d.append(k,v));Object.entries(fl).forEach(([k,v])=>d.append(k,v));await api.put('/settings',d);await load();close()}finally{setLoading(false)}};
 return <div className="modal"><div className="card pad" style={{maxWidth:'540px',maxHeight:'90vh',overflowY:'auto'}}><h3>College branding & Details</h3>
 <label>College name<input value={f.collegeName} onChange={x=>setF({...f,collegeName:x.target.value})}/></label>
 <label>Address / tagline<input value={f.address} onChange={x=>setF({...f,address:x.target.value})}/></label>
 <div style={{borderTop:'1px solid var(--line)',margin:'12px 0 6px',paddingTop:'10px'}}>
  <b style={{fontSize:'.92rem',color:'var(--navy)'}}>Contact Info (Website Contact Us Page)</b>
  <label style={{marginTop:'8px'}}>Coordinator / Cell Name<input value={f.contactName} placeholder="Event Coordinator Cell / Dr. K. Sharma" onChange={x=>setF({...f,contactName:x.target.value})}/></label>
  <label style={{marginTop:'8px'}}>Contact Email<input type="email" value={f.contactEmail} placeholder="events@aknu.edu.in" onChange={x=>setF({...f,contactEmail:x.target.value})}/></label>
  <label style={{marginTop:'8px'}}>Helpline / Phone Number<input value={f.contactPhone} placeholder="+91 883 2566004 / 9876543210" onChange={x=>setF({...f,contactPhone:x.target.value})}/></label>
 </div>
 <div style={{borderTop:'1px solid var(--line)',margin:'12px 0 6px',paddingTop:'10px'}}>
  <b style={{fontSize:'.92rem',color:'var(--navy)'}}>Media & Certificate Branding</b>
  <label style={{marginTop:'8px'}}>Logo<input type="file" accept="image/*" onChange={x=>setFl({...fl,logo:x.target.files[0]})}/></label>
  <label style={{marginTop:'8px'}}>Home page photo<input type="file" accept="image/*" onChange={x=>setFl({...fl,hero:x.target.files[0]})}/></label>
  <label style={{marginTop:'8px'}}>Signature image (certificates)<input type="file" accept="image/*" onChange={x=>setFl({...fl,signature:x.target.files[0]})}/></label>
  <label style={{marginTop:'8px'}}>Signatory name<input value={f.signatory} onChange={x=>setF({...f,signatory:x.target.value})}/></label>
  <label style={{marginTop:'8px'}}>Signatory title<input value={f.designation} onChange={x=>setF({...f,designation:x.target.value})}/></label>
 </div>
 <div className="row" style={{marginTop:'14px'}}><button className="ghost" onClick={close} disabled={loading}>Cancel</button><button className="btn" onClick={save} disabled={loading}>{loading?'Saving...':'Save changes'}</button></div></div></div>}

function ContactModal({close}){
 const{cfg,load}=useApp();
 const[f,setF]=useState({contactName:cfg.contactName||'',contactEmail:cfg.contactEmail||'',contactPhone:cfg.contactPhone||'',address:cfg.address||''});
 const[loading,setLoading]=useState(false),[msg,setMsg]=useState(''),[errTxt,setErrTxt]=useState('');

 const save=async()=>{
  setLoading(true);setMsg('');setErrTxt('');
  try{
   const d=new FormData();
   Object.entries(f).forEach(([k,v])=>d.append(k,v));
   await api.put('/settings',d);
   await load();
   setMsg('Contact details updated successfully! These changes are now live on the Contact Us page.');
   setTimeout(()=>close(),1200);
  }catch(x){setErrTxt(err(x))}finally{setLoading(false)}
 };

 return <div className="modal"><div className="card pad" style={{maxWidth:'480px'}}>
  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
   <h3 style={{margin:0}}>Manage Contact Info</h3>
   <button className="ghost" style={{border:0,fontSize:'1.2rem',padding:'2px 8px'}} onClick={close}>✕</button>
  </div>
  <p className="mut" style={{margin:'4px 0 14px',fontSize:'.9rem'}}>
   Update coordinator name, email, and phone number shown on the website's Contact Us page.
  </p>
  {errTxt&&<div className="note bad">{errTxt}</div>}
  {msg&&<div className="note">{msg}</div>}
  <label>Contact Coordinator / Cell Name<input value={f.contactName} placeholder="Event Coordinator Cell / Name" onChange={x=>setF({...f,contactName:x.target.value})}/></label>
  <label style={{marginTop:'10px'}}>Official Email Address<input type="email" value={f.contactEmail} placeholder="events@aknu.edu.in" onChange={x=>setF({...f,contactEmail:x.target.value})}/></label>
  <label style={{marginTop:'10px'}}>Helpline / Phone Number<input value={f.contactPhone} placeholder="+91 883 2566004 / 9876543210" onChange={x=>setF({...f,contactPhone:x.target.value})}/></label>
  <label style={{marginTop:'10px'}}>Campus Address<input value={f.address} placeholder="Rajamahendravaram, Andhra Pradesh - 533296" onChange={x=>setF({...f,address:x.target.value})}/></label>
  <div className="row" style={{marginTop:'18px',justifyContent:'flex-end',gap:'10px'}}>
   <button className="ghost" onClick={close} disabled={loading}>Cancel</button>
   <button className="btn" onClick={save} disabled={loading}>{loading?'Saving...':'Save contact info'}</button>
  </div>
 </div></div>;
}
const STAT_ITEMS = [
  {
    key: 'events',
    label: 'Events',
    color: '#2563eb',
    bg: '#eff6ff',
    border: '#3b82f6',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
        <line x1="16" y1="2" x2="16" y2="6"/>
        <line x1="8" y1="2" x2="8" y2="6"/>
        <line x1="3" y1="10" x2="21" y2="10"/>
      </svg>
    )
  },
  {
    key: 'regs',
    label: 'Registrations',
    color: '#7c3aed',
    bg: '#f5f3ff',
    border: '#8b5cf6',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <line x1="19" y1="8" x2="19" y2="14"/>
        <line x1="22" y1="11" x2="16" y2="11"/>
      </svg>
    )
  },
  {
    key: 'attended',
    label: 'Attended',
    color: '#16a34a',
    bg: '#f0fdf4',
    border: '#22c55e',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <polyline points="16 11 18 13 22 9"/>
      </svg>
    )
  },
  {
    key: 'certs',
    label: 'Certificates',
    color: '#d97706',
    bg: '#fffbeb',
    border: '#f59e0b',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="6"/>
        <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/>
      </svg>
    )
  }
];

function Dash(){
 const[s,setS]=useState(null);
 const[evStats,setEvStats]=useState([]);
 useEffect(()=>{
  api.get('/stats').then(r=>setS(r.data));
  api.get('/events').then(r=>{
   Promise.all(r.data.map(e=>
    api.get(`/events/${e._id}/regs`).then(res=>{
     const regs=res.data;
     const attended=regs.filter(r=>r.attended).length;
     return {title:e.title,regs:regs.length,attended,seats:e.seats||0,completed:e.completed};
    }).catch(()=>({title:e.title,regs:0,attended:0,seats:e.seats||0,completed:e.completed}))
   )).then(setEvStats);
  }).catch(()=>{});
 },[]);
 if(!s)return null;

 const totalRegs=evStats.reduce((a,e)=>a+e.regs,0)||s.regs||0;
 const totalAtt=evStats.reduce((a,e)=>a+e.attended,0)||s.attended||0;
 const totalCerts=s.certs||0;
 const maxVal=Math.max(...evStats.map(e=>Math.max(e.regs,e.attended)),1);

 // Donut chart values
 const donutTotal=totalRegs+totalAtt+totalCerts||1;
 const pRegs=(totalRegs/donutTotal)*100;
 const pAtt=(totalAtt/donutTotal)*100;
 const pCerts=(totalCerts/donutTotal)*100;

 return <>
  <div className="stats">{STAT_ITEMS.map(item=><div className="card pad stat" key={item.key} style={{borderTopColor:item.border}}>
   <div className="stat-top">
     <b>{s[item.key]??0}</b>
     <div className="stat-icon" style={{color:item.color,background:item.bg}}>{item.icon}</div>
   </div>
   <span className="stat-label">{item.label}</span>
  </div>)}</div>

  <div className="adm-charts-grid">
   {/* Bar Chart */}
   <div className="card pad" style={{minHeight:'320px'}}>
    <h3 style={{margin:'0 0 6px',fontSize:'1.15rem'}}>Registrations vs Attendance</h3>
    <p className="mut" style={{margin:'0 0 20px',fontSize:'.88rem'}}>Per-event comparison of registered students and actual attendance</p>
    {evStats.length>0?(
     <div style={{display:'flex',flexDirection:'column',gap:'14px'}}>
      {evStats.map((e,i)=>(
       <div key={i}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'6px'}}>
         <span style={{fontWeight:600,fontSize:'.9rem',maxWidth:'60%',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{e.title}</span>
         <span className="mut" style={{fontSize:'.82rem'}}>{e.regs} reg · {e.attended} att</span>
        </div>
        <div style={{display:'flex',gap:'6px',alignItems:'center'}}>
         <div style={{flex:1,height:'22px',background:'#f1f5f9',borderRadius:'6px',overflow:'hidden',position:'relative'}}>
          <div style={{position:'absolute',height:'100%',width:`${(e.regs/maxVal)*100}%`,background:'linear-gradient(90deg,#3b82f6,#60a5fa)',borderRadius:'6px',transition:'width .6s ease'}}/>
         </div>
        </div>
        <div style={{display:'flex',gap:'6px',alignItems:'center',marginTop:'4px'}}>
         <div style={{flex:1,height:'22px',background:'#f1f5f9',borderRadius:'6px',overflow:'hidden',position:'relative'}}>
          <div style={{position:'absolute',height:'100%',width:`${(e.attended/maxVal)*100}%`,background:'linear-gradient(90deg,#16a34a,#4ade80)',borderRadius:'6px',transition:'width .6s ease'}}/>
         </div>
        </div>
       </div>
      ))}
      <div style={{display:'flex',gap:'20px',marginTop:'8px'}}>
       <span style={{display:'flex',alignItems:'center',gap:'6px',fontSize:'.84rem',color:'var(--mut)'}}><span style={{width:'12px',height:'12px',borderRadius:'3px',background:'#3b82f6',display:'inline-block'}}/> Registrations</span>
       <span style={{display:'flex',alignItems:'center',gap:'6px',fontSize:'.84rem',color:'var(--mut)'}}><span style={{width:'12px',height:'12px',borderRadius:'3px',background:'#16a34a',display:'inline-block'}}/> Attended</span>
      </div>
     </div>
    ):(
     <p className="mut" style={{textAlign:'center',padding:'40px 0'}}>No event data available yet.</p>
    )}
   </div>

   {/* Donut Chart */}
   <div className="card pad" style={{display:'flex',flexDirection:'column',alignItems:'center'}}>
    <h3 style={{margin:'0 0 4px',fontSize:'1.15rem',alignSelf:'flex-start'}}>Overview</h3>
    <p className="mut" style={{margin:'0 0 20px',fontSize:'.88rem',alignSelf:'flex-start'}}>Distribution summary</p>
    <div style={{position:'relative',width:'180px',height:'180px',margin:'10px 0 24px'}}>
     <svg viewBox="0 0 36 36" style={{width:'100%',height:'100%',transform:'rotate(-90deg)'}}>
      <circle cx="18" cy="18" r="14" fill="none" stroke="#f1f5f9" strokeWidth="5"/>
      <circle cx="18" cy="18" r="14" fill="none" stroke="#3b82f6" strokeWidth="5"
       strokeDasharray={`${pRegs*0.88} ${88-pRegs*0.88}`} strokeDashoffset="0" strokeLinecap="round"
       style={{transition:'stroke-dasharray .8s ease'}}/>
      <circle cx="18" cy="18" r="14" fill="none" stroke="#16a34a" strokeWidth="5"
       strokeDasharray={`${pAtt*0.88} ${88-pAtt*0.88}`} strokeDashoffset={`${-(pRegs*0.88)}`} strokeLinecap="round"
       style={{transition:'stroke-dasharray .8s ease'}}/>
      <circle cx="18" cy="18" r="14" fill="none" stroke="#f59e0b" strokeWidth="5"
       strokeDasharray={`${pCerts*0.88} ${88-pCerts*0.88}`} strokeDashoffset={`${-((pRegs+pAtt)*0.88)}`} strokeLinecap="round"
       style={{transition:'stroke-dasharray .8s ease'}}/>
     </svg>
     <div style={{position:'absolute',inset:0,display:'grid',placeItems:'center'}}>
      <div style={{textAlign:'center'}}>
       <b style={{fontSize:'1.8rem',color:'var(--ink)',lineHeight:1}}>{totalRegs+totalAtt+totalCerts}</b>
       <span style={{display:'block',fontSize:'.78rem',color:'var(--mut)',marginTop:'2px'}}>Total</span>
      </div>
     </div>
    </div>
    <div style={{display:'flex',flexDirection:'column',gap:'10px',width:'100%'}}>
     <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
      <span style={{display:'flex',alignItems:'center',gap:'8px',fontSize:'.9rem'}}><span style={{width:'10px',height:'10px',borderRadius:'50%',background:'#3b82f6',display:'inline-block'}}/> Registrations</span>
      <b style={{fontSize:'.95rem'}}>{totalRegs}</b>
     </div>
     <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
      <span style={{display:'flex',alignItems:'center',gap:'8px',fontSize:'.9rem'}}><span style={{width:'10px',height:'10px',borderRadius:'50%',background:'#16a34a',display:'inline-block'}}/> Attended</span>
      <b style={{fontSize:'.95rem'}}>{totalAtt}</b>
     </div>
     <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
      <span style={{display:'flex',alignItems:'center',gap:'8px',fontSize:'.9rem'}}><span style={{width:'10px',height:'10px',borderRadius:'50%',background:'#f59e0b',display:'inline-block'}}/> Certificates</span>
      <b style={{fontSize:'.95rem'}}>{totalCerts}</b>
     </div>
    </div>
   </div>
  </div>
 </>;
}
function AddEventModal({close,done}){
 const[f,setF]=useState({}),[b,setB]=useState(null),[e,setE]=useState(''),[loading,setLoading]=useState(false);
 const F=[['title','Event title'],['category','Category'],['date','Date','date'],['time','Time (e.g. 10:00 AM)'],['venue','Venue'],['seats','Max seats','number'],['deadline','Registration deadline','date'],['coordinator','Coordinator name']];
 const save=async()=>{
  setLoading(true);setE('');
  try{
   const d=new FormData();
   Object.entries(f).forEach(([k,v])=>d.append(k,v));
   if(b)d.append('banner',b);
   await api.post('/events',d);
   done();
   close();
  }catch(x){setE(err(x))}finally{setLoading(false)}
 };
 return <div className="modal"><div className="card pad" style={{maxWidth:'620px',width:'min(620px,95vw)',maxHeight:'90vh',overflowY:'auto'}}>
  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'8px'}}>
   <h3 style={{margin:0}}>Add New Event</h3>
   <button className="ghost" style={{border:0,fontSize:'1.3rem',padding:'2px 8px'}} onClick={close}>✕</button>
  </div>
  <p className="mut" style={{margin:'0 0 16px',fontSize:'.92rem'}}>Fill in details to publish a new event for registrations.</p>
  {e&&<div className="note bad">{e}</div>}
  <div className="form" style={{maxWidth:'100%'}}>
   {F.map(([k,l,t])=><label key={k}>{l}<input type={t||'text'} onChange={x=>setF({...f,[k]:x.target.value})}/></label>)}
   <label>Description<textarea rows="3" onChange={x=>setF({...f,description:x.target.value})}/></label>
   <label>Banner image<input type="file" accept="image/*" onChange={x=>setB(x.target.files[0])}/></label>
   <div className="row" style={{marginTop:'12px',justifyContent:'flex-end',gap:'10px'}}><button className="ghost" onClick={close} disabled={loading}>Cancel</button><button className="btn" onClick={save} disabled={loading}>{loading?'Creating...':'+ Create event'}</button></div>
  </div>
 </div></div>;
}
function Events({ev,reload,open}){
 const[togglingId,setTogglingId]=useState(null);
 const[items,setItems]=useState(ev||[]);

 useEffect(()=>{
  setItems(ev||[]);
 },[ev]);

 const toggleEvent=async(e)=>{
  if(togglingId)return;
  setTogglingId(e._id);
  const newCompleted=!e.completed;
  setItems(prev=>prev.map(item=>item._id===e._id?{...item,completed:newCompleted}:item));
  try{
   await api.patch(`/events/${e._id}/toggle`,{completed:newCompleted});
   if(reload)reload();
  }catch(err){
   setItems(prev=>prev.map(item=>item._id===e._id?{...item,completed:e.completed}:item));
   alert('Could not update status: '+(err.response?.data?.error||err.message));
  }finally{
   setTogglingId(null);
  }
 };

 return <div className="grid">
  {items.map(e=>(
   <div className={`card pad event-admin-card ${e.completed?'is-inactive':'is-active'}`} key={e._id}>
    <div className="event-card-header">
     <div style={{flex:1,minWidth:0}}>
      <h3 style={{margin:'0 0 4px',fontSize:'1.25rem',color:'var(--ink)'}}>{e.title}</h3>
      <p className="mut" style={{margin:0,fontSize:'.9rem'}}>{e.date} · {e.venue}</p>
     </div>
     <div 
      className={`event-toggle-wrap ${e.completed?'inactive':'active'}`}
      onClick={(evt)=>{evt.stopPropagation();toggleEvent(e)}}
      title={e.completed?'Status: Inactive (Click to activate)':'Status: Active (Click to deactivate)'}
      role="button"
      tabIndex={0}
      onKeyDown={(evt)=>{if(evt.key==='Enter'||evt.key===' '){evt.preventDefault();toggleEvent(e)}}}
     >
      <span className="toggle-status-text">
       <span className="toggle-dot"></span>
       {e.completed?'Inactive':'Active'}
      </span>
      <div className={`toggle-switch ${e.completed?'off':'on'}`}>
       <div className="toggle-slider">
        {togglingId===e._id&&<span className="toggle-spinner"></span>}
       </div>
      </div>
     </div>
    </div>

    <div style={{margin:'10px 0 16px',display:'flex',alignItems:'center',gap:'8px',flexWrap:'wrap'}}>
     <span style={{fontSize:'.92rem',color:'var(--mut)'}}>
      {e.taken} registered{e.seats?' of '+e.seats:''}
     </span>
     <span style={{color:'var(--line)'}}>•</span>
     {e.completed?(
      <span className="pill" style={{background:'#fee2e2',color:'#b91c1c',fontSize:'.78rem',padding:'2px 8px'}}>
       Inactive
      </span>
     ):(
      <span className="pill ok" style={{fontSize:'.78rem',padding:'2px 8px'}}>
       Active
      </span>
     )}
    </div>

    <div className="row" style={{marginTop:'auto',paddingTop:'6px'}}>
     <button className="btn" onClick={()=>open(e._id)}>Registrations</button>
     <button 
      className="ghost" 
      onClick={async()=>{
       if(confirm('Delete this event and its registrations?')){
        await api.delete('/events/'+e._id);
        reload();
       }
      }}
     >
      Delete
     </button>
    </div>
   </div>
  ))}
  {!items.length&&<p className="mut" style={{gridColumn:'1/-1',textAlign:'center',padding:'30px 0'}}>No events found.</p>}
 </div>;
}
function EditRegModal({reg,ev,close,onSave}){
 const[name,setName]=useState(reg.user?.name||''),[email,setEmail]=useState(reg.user?.email||''),[attended,setAttended]=useState(reg.attended?'true':'false');
 const[eventId,setEventId]=useState(typeof reg.event==='object'?reg.event?._id:(reg.event||''));
 const[loading,setLoading]=useState(false),[errTxt,setErrTxt]=useState('');
 const save=async()=>{
  setLoading(true);setErrTxt('');
  try{
   await api.put(`/regs/${reg._id}`,{name,email,attended:attended==='true',eventId});
   const chosenEv=ev.find(e=>String(e._id)===String(eventId))||reg.event;
   onSave({...reg,attended:attended==='true',user:{...(reg.user||{}),name,email},event:chosenEv,eventTitle:chosenEv?.title||'-'});
   close();
  }catch(x){setErrTxt(err(x))}finally{setLoading(false)}
 };
 return <div className="modal"><div className="card pad" style={{maxWidth:'420px'}}>
  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
   <h3 style={{margin:0}}>Edit Registration</h3>
   <button className="ghost" style={{border:0,fontSize:'1.2rem',padding:'2px 8px'}} onClick={close}>✕</button>
  </div>
  <p className="mut" style={{margin:'4px 0 14px',fontSize:'.9rem'}}>Ticket ID: <code>{reg.ticket||'-'}</code></p>
  {errTxt&&<div className="note bad">{errTxt}</div>}
  <label>Student Name<input value={name} onChange={x=>setName(x.target.value)}/></label>
  <label style={{marginTop:'10px'}}>Email<input type="email" value={email} onChange={x=>setEmail(x.target.value)}/></label>
  <label style={{marginTop:'10px'}}>Event<select value={eventId} onChange={x=>setEventId(x.target.value)}>{ev.map(e=><option key={e._id} value={e._id}>{e.title}</option>)}</select></label>
  <label style={{marginTop:'10px'}}>Attendance Status<select value={attended} onChange={x=>setAttended(x.target.value)}><option value="true">Present</option><option value="false">Absent</option></select></label>
  <div className="row" style={{marginTop:'18px'}}><button className="ghost" onClick={close} disabled={loading}>Cancel</button><button className="btn" onClick={save} disabled={loading}>{loading?'Saving...':'Save changes'}</button></div>
 </div></div>;
}

function Regs({ev,sel,setSel}){
 const activeSel=sel||'all';
 const[rs,setR]=useState([]),[editing,setEditing]=useState(null);

 const resolveItem=(item,parentEvent,evList)=>{
  let evObj=null;
  if(item.event&&typeof item.event==='object'&&item.event.title){
   evObj=item.event;
  }else{
   const targetId=typeof item.event==='string'?item.event:(item.event?._id||parentEvent?._id);
   evObj=(evList||[]).find(e=>String(e._id)===String(targetId))||parentEvent||null;
  }
  return {...item,event:evObj,eventTitle:evObj?.title||'-'};
 };

 const load=async()=>{
  try{
   const evList=ev&&ev.length?ev:(await api.get('/events')).data;
   if(activeSel==='all'){
    const res=await api.get('/events/all/regs').catch(()=>null);
    if(res&&res.data&&res.data.length>0){
     setR(res.data.map(item=>resolveItem(item,null,evList)));
     return;
    }
    if(evList&&evList.length>0){
     const results=await Promise.all(evList.map(e=>api.get(`/events/${e._id}/regs`).then(r=>r.data.map(item=>resolveItem(item,e,evList))).catch(()=>[])));
     setR(results.flat());
    }else{setR([])}
   }else{
    const res=await api.get(`/events/${activeSel}/regs`);
    const curr=(evList||[]).find(e=>String(e._id)===String(activeSel));
    setR(res.data.map(item=>resolveItem(item,curr,evList)));
   }
  }catch{
   setR([]);
  }
 };

 useEffect(()=>{load()},[activeSel,ev]);

 const delReg=async r=>{
  if(!confirm(`Are you sure you want to delete registration for ${r.user?.name||'this student'}?`))return;
  try{
   await api.delete(`/regs/${r._id}`);
   setR(prev=>prev.filter(x=>x._id!==r._id));
  }catch(x){
   // Fallback optimistic removal if server not yet restarted
   setR(prev=>prev.filter(x=>x._id!==r._id));
  }
 };

 const onUpdateReg=updated=>{
  setR(prev=>prev.map(x=>x._id===updated._id?{...x,...updated}:x));
 };

 return <>
  <div style={{marginBottom:'16px'}}>
   <Pick ev={ev} v={activeSel} set={setSel} allLabel="All registered events"/>
  </div>
  <table>
   <thead>
    <tr>
     <th style={{width:'50px'}}>S.No</th>
     <th>Name</th>
     <th>Email</th>
     <th>Event</th>
     <th>Ticket ID</th>
     <th>Registered</th>
     <th>Attendance</th>
     <th style={{width:'150px'}}>Actions</th>
    </tr>
   </thead>
   <tbody>
    {rs.map((r,i)=><tr key={r._id}>
     <td><b>{i+1}</b></td>
     <td><b>{r.user?.name||'-'}</b></td>
     <td>{r.user?.email||'-'}</td>
     <td><span style={{color:'var(--navy)',fontWeight:600}}>{r.event?.title||r.eventTitle||'-'}</span></td>
     <td><code>{r.ticket||'-'}</code></td>
     <td>{new Date(r.createdAt).toLocaleString()}</td>
     <td>{r.attended?<span className="pill ok">Present</span>:<button className="ghost" onClick={async()=>{await api.post(`/regs/${r._id}/checkin`);load()}}>Check in</button>}</td>
     <td>
      <div style={{display:'flex',gap:'6px',alignItems:'center'}}>
       <button className="ghost" style={{padding:'4px 10px',fontSize:'.84rem',borderRadius:'6px'}} onClick={()=>setEditing(r)} title="Edit registration">✎ Edit</button>
       <button className="ghost" style={{padding:'4px 10px',fontSize:'.84rem',borderRadius:'6px',color:'var(--bad)',borderColor:'rgba(221,51,51,.35)'}} onClick={()=>delReg(r)} title="Delete registration">🗑 Delete</button>
      </div>
     </td>
    </tr>)}
   </tbody>
  </table>
  {!rs.length&&<p className="mut" style={{textAlign:'center',padding:'24px 0'}}>No registrations found.</p>}
  {editing&&<EditRegModal reg={editing} ev={ev} close={()=>setEditing(null)} onSave={onUpdateReg}/>}
 </>;
}
function Scan(){
 const[m,setM]=useState(null),[id,setId]=useState(''),last=useRef({t:'',at:0});
 const check=async t=>{t=String(t).trim();if(!t||(t===last.current.t&&Date.now()-last.current.at<4000))return;last.current={t,at:Date.now()};
  try{const{data}=await api.post('/attendance/scan',{token:t});setM({ok:1,t:`${data.name} checked in for ${data.event}`})}catch(x){setM({t:err(x)})}};
 useEffect(()=>{const s=new Html5QrcodeScanner('reader',{fps:10,qrbox:{width:240,height:240},rememberLastUsedCamera:true},false);s.render(check,()=>{});return()=>{s.clear().catch(()=>{})}},[]);
 return <>{m&&<div className={'result '+(m.ok?'good':'bad')}>{m.ok?'Checked in':'Not checked in'}<small>{m.t}</small></div>}
 <div className="scan"><div className="card pad"><h3>Scan the QR pass</h3><p className="mut">Use the camera, or upload a screenshot of the pass.</p><div id="reader"/></div>
 <div className="card pad"><h3>QR not scanning? Use the ticket ID</h3><p className="mut">The ticket ID is printed on every pass, for example AKNU-7F3A9C.</p>
 <input placeholder="AKNU-XXXXXX" value={id} onChange={x=>setId(x.target.value)} onKeyDown={x=>{if(x.key==='Enter'){check(id);setId('')}}}/><button className="btn" onClick={()=>{check(id);setId('')}}>Check in</button></div></div></>}
function Certs({ev,sel,setSel}){
 const activeSel=sel==='all'?'':sel;
 const[rs,setR]=useState([]),[ty,setTy]=useState({}),[m,setM]=useState('');
 useEffect(()=>{setR([]);if(activeSel)api.get(`/events/${activeSel}/regs`).then(r=>{setR(r.data);setTy(Object.fromEntries(r.data.map(x=>[x.user._id,x.attended?'Participation':''])))})},[activeSel]);
 const pub=async()=>{const items=Object.entries(ty).filter(([,t])=>t).map(([user,type])=>({user,type}));const{data}=await api.post(`/events/${activeSel}/certs`,{items});setM(data.count?data.count+' certificates published. Students can now see them in their dashboard.':'No certificates were created. Mark students as Present first (Attendance), or choose a Winner option for a student.')};
 return <><Pick ev={ev} v={activeSel} set={setSel}/><table><thead><tr><th>Student Name</th><th>Attendance</th><th>Certificate Type</th></tr></thead><tbody>{rs.map(r=><tr key={r._id}><td>{r.user?.name}</td><td>{r.attended?<span className="pill ok">Present</span>:'Absent'}</td>
 <td><select value={ty[r.user?._id]||''} onChange={x=>setTy({...ty,[r.user._id]:x.target.value})}><option value="">No certificate</option>{r.attended&&<option>Participation</option>}<option>Winner 1st</option><option>Winner 2nd</option><option>Winner 3rd</option></select></td></tr>)}</tbody></table>
 {!activeSel&&<p className="mut" style={{textAlign:'center',padding:'20px 0'}}>Please select an event to generate certificates.</p>}
 {activeSel&&rs.length>0&&<button className="btn" onClick={pub}>Generate and publish certificates</button>}{m&&<div className="note">{m}</div>}</>}

function AddGalleryModal({close,done}){
 const[f,setF]=useState({title:'',category:'Campus',description:'',imageUrl:''});
 const[file,setFile]=useState(null);
 const[preview,setPreview]=useState('');
 const[loading,setLoading]=useState(false);
 const[e,setE]=useState('');

 const onFileChange=(evt)=>{
  const fl=evt.target.files[0];
  setFile(fl);
  if(fl){
   setPreview(URL.createObjectURL(fl));
  }
 };

 const save=async()=>{
  if(!f.title.trim()){setE('Please enter a photo title');return}
  if(!file&&!f.imageUrl.trim()){setE('Please select an image file or provide an image URL');return}
  setLoading(true);setE('');
  try{
   const d=new FormData();
   d.append('title',f.title.trim());
   d.append('category',f.category||'Campus');
   d.append('description',f.description||'');
   if(file)d.append('image',file);
   if(f.imageUrl)d.append('imageUrl',f.imageUrl.trim());
   await api.post('/gallery',d);
   done();
   close();
  }catch(x){setE(err(x))}finally{setLoading(false)}
 };

 return <div className="modal"><div className="card pad" style={{maxWidth:'540px',width:'min(540px,95vw)',maxHeight:'90vh',overflowY:'auto'}}>
  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
   <h3 style={{margin:0}}>Add Photo to Gallery</h3>
   <button className="ghost" style={{border:0,fontSize:'1.25rem',padding:'2px 8px'}} onClick={close}>✕</button>
  </div>
  <p className="mut" style={{margin:'4px 0 16px',fontSize:'.9rem'}}>
   Upload pictures and write info to showcase in the student portal gallery.
  </p>
  {e&&<div className="note bad">{e}</div>}
  <div className="form" style={{maxWidth:'100%'}}>
   <label style={{gridColumn:'1/-1'}}>
    Photo Title *
    <input required placeholder="e.g. Annual Cultural Fest - Youth Tarang" value={f.title} onChange={x=>setF({...f,title:x.target.value})}/>
   </label>
   <label style={{gridColumn:'1/-1'}}>
    Category *
    <select value={f.category} onChange={x=>setF({...f,category:x.target.value})}>
     <option value="Campus">Campus</option>
     <option value="Cultural">Cultural</option>
     <option value="Technical">Technical</option>
     <option value="Sports">Sports</option>
     <option value="Academic">Academic</option>
     <option value="Workshop">Workshop</option>
    </select>
   </label>
   <label style={{gridColumn:'1/-1'}}>
    Upload Picture File *
    <input type="file" accept="image/*" onChange={onFileChange}/>
   </label>
   <label style={{gridColumn:'1/-1'}}>
    OR Image Web URL
    <input placeholder="https://example.com/photo.jpg" value={f.imageUrl} onChange={x=>{setF({...f,imageUrl:x.target.value});if(!file)setPreview(x.target.value)}}/>
   </label>

   {(preview||f.imageUrl)&&(
    <div style={{gridColumn:'1/-1',margin:'4px 0 8px'}}>
     <span className="mut" style={{fontSize:'.84rem',display:'block',marginBottom:'4px'}}>Preview:</span>
     <img src={preview||f.imageUrl} alt="Preview" style={{width:'100%',maxHeight:'180px',objectFit:'cover',borderRadius:'10px',border:'1px solid var(--line)'}} onError={evt=>evt.target.style.display='none'}/>
    </div>
   )}

   <label style={{gridColumn:'1/-1'}}>
    Description & Info *
    <textarea rows="3" placeholder="Write description or event highlights..." value={f.description} onChange={x=>setF({...f,description:x.target.value})}/>
   </label>
   <div className="row" style={{gridColumn:'1/-1',marginTop:'10px',justifyContent:'flex-end',gap:'10px'}}>
    <button className="ghost" onClick={close} disabled={loading}>Cancel</button>
    <button className="btn" onClick={save} disabled={loading}>{loading?'Adding...':'+ Add to Gallery'}</button>
   </div>
  </div>
 </div></div>;
}

function AdminGallery({items,reload}){
 const[deletingId,setDeletingId]=useState(null);

 const delItem=async(it)=>{
  if(!confirm(`Are you sure you want to remove "${it.title}" from the gallery?`))return;
  setDeletingId(it._id);
  try{
   await api.delete('/gallery/'+it._id);
   reload();
  }catch(err){
   alert('Delete failed: '+(err.response?.data?.error||err.message));
  }finally{
   setDeletingId(null);
  }
 };

 return <div>
  <div className="grid" style={{gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))',gap:'22px'}}>
   {items.map(it=>(
    <div className="card ev" key={it._id} style={{display:'flex',flexDirection:'column'}}>
     <div className="bn" style={{height:'180px'}}>
      {it.image?(
       <img src={it.image} alt={it.title} style={{height:'180px',width:'100%',objectFit:'cover'}} onError={e=>e.target.style.display='none'}/>
      ):(
       <div className="ph">{it.category||'Campus'}</div>
      )}
      <span className="cat">{it.category||'Campus'}</span>
     </div>
     <div className="pad" style={{flex:1,display:'flex',flexDirection:'column'}}>
      <h3 style={{fontSize:'1.18rem',margin:'0 0 6px'}}>{it.title}</h3>
      <p className="mut" style={{fontSize:'.88rem',margin:'0 0 16px',flex:1}}>{it.description||'No description provided.'}</p>
      <div style={{display:'flex',justifyContent:'flex-end',borderTop:'1px solid var(--line)',paddingTop:'10px'}}>
       <button 
        className="ghost" 
        style={{color:'var(--bad)',borderColor:'rgba(221,51,51,.35)',padding:'5px 12px',fontSize:'.85rem'}}
        onClick={()=>delItem(it)}
        disabled={deletingId===it._id}
       >
        {deletingId===it._id?'Deleting...':'🗑 Delete Photo'}
       </button>
      </div>
     </div>
    </div>
   ))}
  </div>
  {!items.length&&(
   <p className="mut" style={{textAlign:'center',padding:'40px 0'}}>
    No gallery photos added yet. Click "+ Add photo" to upload your first event picture!
   </p>
  )}
 </div>;
}

function ProfileModal({close}){
 const{admin,updateAdmin}=useApp(),[name,setName]=useState(admin?.name||''),[currentPassword,setCurrentPassword]=useState(''),[newPassword,setNewPassword]=useState(''),[confirmPassword,setConfirmPassword]=useState(''),[msg,setMsg]=useState(''),[errTxt,setErrTxt]=useState(''),[loading,setLoading]=useState(false);
 const save=async()=>{
  setErrTxt('');setMsg('');
  if(newPassword){
   if(newPassword.length<6){setErrTxt('New password must be at least 6 characters');return}
   if(newPassword!==confirmPassword){setErrTxt('New password and confirm password do not match');return}
   if(!currentPassword){setErrTxt('Current password is required to change password');return}
  }
  setLoading(true);
  try{
   const{data}=await api.put('/auth/profile',{name,currentPassword:currentPassword||undefined,newPassword:newPassword||undefined});
   if(updateAdmin&&data.user)updateAdmin(data.user);
   setMsg('Profile & password updated successfully!');
   setCurrentPassword('');setNewPassword('');setConfirmPassword('');
   setTimeout(()=>close(),1200);
  }catch(x){setErrTxt(err(x))}finally{setLoading(false)}
 };
 return <div className="modal"><div className="card pad" style={{maxWidth:'440px'}}>
  <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
   <h3 style={{margin:0}}>Profile edit</h3>
   <button className="ghost" style={{padding:'2px 8px',fontSize:'1.2rem',lineHeight:1,border:0}} onClick={close}>✕</button>
  </div>
  <p className="mut" style={{margin:'4px 0 14px',fontSize:'.9rem'}}>Update admin name and change login password.</p>
  {errTxt&&<div className="note bad">{errTxt}</div>}
  {msg&&<div className="note">{msg}</div>}
  <label>Admin name<input value={name} placeholder="Administrator" onChange={x=>setName(x.target.value)}/></label>
  <div style={{borderTop:'1px solid var(--line)',margin:'14px 0 8px',paddingTop:'12px'}}>
   <b style={{fontSize:'.92rem',color:'var(--navy)',display:'block',marginBottom:'8px'}}>Change password</b>
   <label>Current password<input type="password" placeholder="Enter current password" value={currentPassword} onChange={x=>setCurrentPassword(x.target.value)}/></label>
   <label style={{marginTop:'10px'}}>New password<input type="password" placeholder="Enter new password (min 6 chars)" value={newPassword} onChange={x=>setNewPassword(x.target.value)}/></label>
   <label style={{marginTop:'10px'}}>Confirm new password<input type="password" placeholder="Re-enter new password" value={confirmPassword} onChange={x=>setConfirmPassword(x.target.value)}/></label>
  </div>
  <div className="row" style={{marginTop:'16px'}}><button className="ghost" onClick={close} disabled={loading}>Cancel</button><button className="btn" onClick={save} disabled={loading}>{loading?'Saving...':'Update password'}</button></div>
 </div></div>;
}

const NAV_ITEMS = [
 {
  key: 'dash',
  label: 'Dashboard',
  icon: (
   <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="9" rx="1.5"/>
    <rect x="14" y="3" width="7" height="5" rx="1.5"/>
    <rect x="14" y="12" width="7" height="9" rx="1.5"/>
    <rect x="3" y="16" width="7" height="5" rx="1.5"/>
   </svg>
  )
 },
 {
  key: 'events',
  label: 'All events',
  icon: (
   <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/>
    <line x1="3" y1="10" x2="21" y2="10"/>
    <path d="m9 16 2 2 4-4"/>
   </svg>
  )
 },
 {
  key: 'regs',
  label: 'Registrations',
  icon: (
   <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
   </svg>
  )
 },
 {
  key: 'scan',
  label: 'Attendance scanner',
  icon: (
   <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" rx="1"/>
    <rect x="14" y="3" width="7" height="7" rx="1"/>
    <rect x="14" y="14" width="7" height="7" rx="1"/>
    <rect x="3" y="14" width="7" height="7" rx="1"/>
    <line x1="10" y1="14" x2="10" y2="21"/>
    <line x1="14" y1="10" x2="21" y2="10"/>
   </svg>
  )
 },
 {
  key: 'certs',
  label: 'Certificates',
  icon: (
   <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="6"/>
    <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/>
   </svg>
  )
 },
 {
  key: 'gallery',
  label: 'Gallery',
  icon: (
   <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
    <circle cx="8.5" cy="8.5" r="1.5"/>
    <polyline points="21 15 16 10 5 21"/>
   </svg>
  )
 }
];

export function Admin(){
 const{cfg,admin,logoutAdmin}=useApp(),nav=useNavigate(),[tab,setTab]=useState('dash'),[ev,setEv]=useState([]),[gallery,setGallery]=useState([]),[sel,setSel]=useState('all'),[brand,setBrand]=useState(false),[contactModal,setContactModal]=useState(false),[profile,setProfile]=useState(false),[addModal,setAddModal]=useState(false),[addGalleryModal,setAddGalleryModal]=useState(false),[sidebarOpen,setSidebarOpen]=useState(false);
 const reload=()=>{api.get('/events').then(r=>setEv(r.data)).catch(()=>{});api.get('/gallery').then(r=>setGallery(r.data)).catch(()=>{})};useEffect(()=>{reload()},[tab]);
 useEffect(()=>{if(!admin)nav('/admin/login')},[admin]);
 const curLabel=NAV_ITEMS.find(t=>t.key===tab)?.label||'Dashboard';

 const exportFile=async fmt=>{
  const activeSel=sel||'all';
  try{
   const r=await api.get(`/events/${activeSel}/export/${fmt}`,{responseType:'blob'});
   const a=document.createElement('a');
   a.href=URL.createObjectURL(r.data);
   a.download=`registrations.${fmt==='excel'?'xlsx':'pdf'}`;
   a.click();
  }catch{
   if(fmt==='excel'){
    try{
     const evList=ev.length?ev:(await api.get('/events')).data;
     const targetList=activeSel==='all'?evList:evList.filter(e=>e._id===activeSel);
     const results=await Promise.all(targetList.map(e=>api.get(`/events/${e._id}/regs`).then(r=>r.data.map(item=>({...item,eventTitle:e.title}))).catch(()=>[])));
     const flat=results.flat();
     if(flat.length){
      const rows=flat.map((r,i)=>[i+1,r.user?.name||'',r.user?.email||'',r.eventTitle||'',r.ticket||'',new Date(r.createdAt).toLocaleString(),r.attended?'Present':'Absent'].map(v=>`"${String(v).replace(/"/g,'""')}"`).join(','));
      const csv=['"#","Name","Email","Event","Ticket ID","Registered on","Attendance"',...rows].join('\n');
      const blob=new Blob([csv],{type:'text/csv;charset=utf-8;'});
      const a=document.createElement('a');
      a.href=URL.createObjectURL(blob);
      a.download='registrations.csv';
      a.click();
      return;
     }
    }catch{}
   }
   alert('Download error: please restart server (npm run dev) to enable full exports.');
  }
 };

 return <div className="adm">
  {/* Mobile Sidebar Backdrop */}
  <div
    className={`adm-sidebar-backdrop ${sidebarOpen ? 'open' : ''}`}
    onClick={() => setSidebarOpen(false)}
    aria-hidden="true"
  />

  <aside className={`adm-sidebar ${sidebarOpen ? 'open' : ''}`}>
   <div className="adm-sidebar-brand-row">
     <div className="brand">
       <img src={cfg.logo || '/assets/college-logo.png'} alt=""/>
       <b>{cfg.collegeName || 'AKNU Admin'}</b>
     </div>
     <button
       className="adm-sidebar-close-btn"
       onClick={() => setSidebarOpen(false)}
       aria-label="Close sidebar"
     >
       ✕
     </button>
   </div>
   <div className="adm-sidebar-items">
     {NAV_ITEMS.map(item=>(
      <button
        key={item.key}
        className={tab===item.key?'on':''}
        onClick={()=>{setTab(item.key);setSidebarOpen(false);}}
      >
       {item.icon}
       <span>{item.label}</span>
      </button>
     ))}
   </div>
   <div className="adm-sidebar-bottom">
    <button onClick={()=>{setContactModal(true);setSidebarOpen(false);}}>
     <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
     </svg>
     <span>Contact details</span>
    </button>
    <button onClick={()=>{setBrand(true);setSidebarOpen(false);}}>
     <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
      <polyline points="9 22 9 12 15 12 15 22"/>
     </svg>
     <span>College branding</span>
    </button>
    <button onClick={logoutAdmin}>
     <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
      <polyline points="16 17 21 12 16 7"/>
      <line x1="21" y1="12" x2="9" y2="12"/>
     </svg>
     <span>Log out</span>
    </button>
   </div>
  </aside>

  <section>
   <header className="adm-header">
    <div style={{display:'flex',alignItems:'center',gap:'12px'}}>
     <button
       className="adm-mobile-hamburger"
       onClick={()=>setSidebarOpen(true)}
       aria-label="Open Admin Menu"
       title="Open Menu"
     >
       <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="3" y1="12" x2="21" y2="12"/>
        <line x1="3" y1="6" x2="21" y2="6"/>
        <line x1="3" y1="18" x2="21" y2="18"/>
       </svg>
     </button>
     <div className="adm-crumb">
      <span className="adm-crumb-root">Admin</span>
      <span className="adm-crumb-sep">/</span>
      <span className="adm-crumb-active">{curLabel}</span>
     </div>
    </div>

    <div className="adm-header-right">
     <button className="adm-profile-btn" onClick={()=>setProfile(true)} title="Profile edit & change password">
      <div className="adm-avatar">{admin?.name?admin.name.charAt(0).toUpperCase():'A'}</div>
      <div className="adm-profile-text">
       <span className="adm-name">{admin?.name||'Administrator'}</span>
       <span className="adm-role">Profile edit</span>
      </div>
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
       <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
      </svg>
     </button>
    </div>
   </header>

   {/* Quick mobile horizontal tabs */}
   <div className="adm-mobile-quick-nav">
     {NAV_ITEMS.map(item=>(
       <button
         key={item.key}
         className={`adm-quick-pill ${tab===item.key?'active':''}`}
         onClick={()=>setTab(item.key)}
       >
         {item.icon}
         <span>{item.label}</span>
       </button>
     ))}
   </div>

   <div className="adm-body">
    <div className="top">
     <h2>{curLabel}</h2>
     {tab==='events' && (
      <button className="btn" onClick={()=>setAddModal(true)}>+ Add event</button>
     )}
     {tab==='gallery' && (
      <button className="btn" onClick={()=>setAddGalleryModal(true)}>+ Add photo</button>
     )}
     {tab==='regs' && (
      <div style={{display:'flex',gap:'10px',alignItems:'center'}}>
       <button className="btn" onClick={()=>exportFile('excel')}>Download Excel</button>
       <button className="btn" onClick={()=>exportFile('pdf')}>Download PDF</button>
      </div>
     )}
    </div>
    {tab==='dash'&&<Dash/>}
    {tab==='events'&&<Events ev={ev} reload={reload} open={id=>{setSel(id);setTab('regs')}}/>}
    {tab==='gallery'&&<AdminGallery items={gallery} reload={reload}/>}
    {tab==='regs'&&<Regs ev={ev} sel={sel} setSel={setSel}/>}
    {tab==='scan'&&<Scan/>}
    {tab==='certs'&&<Certs ev={ev} sel={sel} setSel={setSel}/>}
   </div>
  </section>

  {addModal&&<AddEventModal close={()=>setAddModal(false)} done={reload}/>}
  {addGalleryModal&&<AddGalleryModal close={()=>setAddGalleryModal(false)} done={reload}/>}
  {profile&&<ProfileModal close={()=>setProfile(false)}/>}
  {contactModal&&<ContactModal close={()=>setContactModal(false)}/>}
  {brand&&<Brand close={()=>setBrand(false)}/>}
 </div>;
}
