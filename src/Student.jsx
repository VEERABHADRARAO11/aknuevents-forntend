import {useEffect,useState} from 'react';
import {useNavigate,useParams,Link} from 'react-router-dom';
import {api,err,dl,useApp,getAssetUrl} from './api';
const D=s=>{const d=new Date(s+'T00:00');return isNaN(d)?['','']:[d.getDate(),d.toLocaleString('en',{month:'short'})]};
const img = (src) =>
  new Promise((resolve) => {
    if (!src) return resolve(null);
    const i = new Image();
    if (!src.startsWith('data:') && !src.startsWith('blob:')) {
      i.crossOrigin = 'anonymous';
    }
    i.onload = () => resolve(i);
    i.onerror = () => {
      const retry = new Image();
      retry.onload = () => resolve(retry);
      retry.onerror = () => resolve(null);
      retry.src = src;
    };
    i.src = src;
  });

async function makePass(r, cfg, name) {
  try {
    const c = document.createElement('canvas');
    c.width = 800;
    c.height = 1200;
    const x = c.getContext('2d'), mid = 400;

    // Background & Top Banner
    x.fillStyle = '#ffffff';
    x.fillRect(0, 0, 800, 1200);
    x.fillStyle = '#0b1d3a';
    x.fillRect(0, 0, 800, 230);
    x.fillStyle = '#f2b134';
    x.fillRect(0, 230, 800, 10);

    const logoSrc = cfg?.logo || '/assets/college-logo.png';
    const [lg, qr] = await Promise.all([img(logoSrc), img(r.qr)]);

    let logoDrawn = false;
    if (lg) {
      try {
        const aspect = lg.width / lg.height;
        x.drawImage(lg, 40, 40, Math.min(150 * aspect, 160), 150);
        logoDrawn = true;
      } catch (e) {
        console.warn('Canvas logo draw warning:', e);
      }
    }

    const textLeft = logoDrawn ? 220 : 40;
    x.fillStyle = '#ffffff';
    x.font = '700 32px sans-serif';
    x.fillText(cfg?.collegeName || 'Adikavi Nannaya University', textLeft, 100, 760 - textLeft);

    x.fillStyle = '#f2b134';
    x.font = '22px sans-serif';
    x.fillText(cfg?.address || 'Rajamahendravaram, Andhra Pradesh', textLeft, 145, 760 - textLeft);

    x.fillStyle = '#0b1d3a';
    x.font = '700 44px sans-serif';
    x.fillText(r.event?.title || 'Event Pass', 40, 315, 720);

    x.fillStyle = '#5d6785';
    x.font = '26px sans-serif';
    x.fillText(`${r.event?.date || ''}  |  ${r.event?.time || ''}`, 40, 368, 720);
    x.fillText(r.event?.venue || '', 40, 410, 720);

    x.fillStyle = '#0b1d3a';
    x.font = '700 32px sans-serif';
    x.fillText(name || 'Student', 40, 474, 720);

    if (qr) {
      x.drawImage(qr, mid - 240, 520, 480, 480);
    } else {
      x.strokeStyle = '#dde3f0';
      x.lineWidth = 3;
      x.strokeRect(mid - 240, 520, 480, 480);
      x.fillStyle = '#0b1d3a';
      x.font = '700 28px sans-serif';
      x.textAlign = 'center';
      x.fillText('AKNU EVENT PASS', mid, 760);
      x.textAlign = 'left';
    }

    x.textAlign = 'center';
    x.fillStyle = '#5d6785';
    x.font = '24px sans-serif';
    x.fillText('Ticket ID', mid, 1070);

    x.fillStyle = '#0b1d3a';
    x.font = '700 58px monospace';
    x.fillText(r.ticket || '', mid, 1140);

    const filename = `pass-${r.ticket || 'event'}.png`;

    if (c.toBlob) {
      c.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.style.display = 'none';
          a.href = url;
          a.download = filename;
          document.body.appendChild(a);
          a.click();
          setTimeout(() => {
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
          }, 3000);
        } else {
          const a = document.createElement('a');
          a.style.display = 'none';
          a.href = c.toDataURL('image/png');
          a.download = filename;
          document.body.appendChild(a);
          a.click();
          setTimeout(() => document.body.removeChild(a), 2000);
        }
      }, 'image/png');
    } else {
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = c.toDataURL('image/png');
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      setTimeout(() => document.body.removeChild(a), 2000);
    }
  } catch (err) {
    console.error('Error generating pass:', err);
    try {
      const c2 = document.createElement('canvas');
      c2.width = 800;
      c2.height = 1200;
      const x2 = c2.getContext('2d'), mid = 400;
      x2.fillStyle = '#ffffff';
      x2.fillRect(0, 0, 800, 1200);
      x2.fillStyle = '#0b1d3a';
      x2.fillRect(0, 0, 800, 230);
      x2.fillStyle = '#f2b134';
      x2.fillRect(0, 230, 800, 10);
      x2.fillStyle = '#ffffff';
      x2.font = '700 36px sans-serif';
      x2.fillText(cfg?.collegeName || 'Adikavi Nannaya University', 40, 100, 720);
      x2.fillStyle = '#f2b134';
      x2.font = '24px sans-serif';
      x2.fillText(cfg?.address || 'Rajamahendravaram, Andhra Pradesh', 40, 145, 720);
      x2.fillStyle = '#0b1d3a';
      x2.font = '700 44px sans-serif';
      x2.fillText(r.event?.title || 'Event Pass', 40, 315, 720);
      x2.fillStyle = '#5d6785';
      x2.font = '26px sans-serif';
      x2.fillText(`${r.event?.date || ''}  |  ${r.event?.time || ''}`, 40, 368, 720);
      x2.fillText(r.event?.venue || '', 40, 410, 720);
      x2.fillStyle = '#0b1d3a';
      x2.font = '700 32px sans-serif';
      x2.fillText(name || 'Student', 40, 474, 720);
      const qrImg = await img(r.qr);
      if (qrImg) x2.drawImage(qrImg, mid - 240, 520, 480, 480);
      x2.textAlign = 'center';
      x2.fillStyle = '#5d6785';
      x2.font = '24px sans-serif';
      x2.fillText('Ticket ID', mid, 1070);
      x2.fillStyle = '#0b1d3a';
      x2.font = '700 58px monospace';
      x2.fillText(r.ticket || '', mid, 1140);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = c2.toDataURL('image/png');
      a.download = `pass-${r.ticket || 'event'}.png`;
      document.body.appendChild(a);
      a.click();
      setTimeout(() => document.body.removeChild(a), 2000);
    } catch (e2) {
      alert('Could not download pass image. Please take a screenshot of your ticket QR code.');
    }
  }
}

export function AuthShell({title,sub,children}){
 const{cfg}=useApp();
 return <div className="split">
  <div className="side" style={{backgroundImage:`linear-gradient(160deg,rgba(11,29,58,.8),rgba(11,29,58,.96)),url(${cfg?.hero || '/assets/college-gate.png'})`}}>
   <img
     src={cfg?.logo || '/assets/college-logo.png'}
     alt={cfg?.collegeName || 'AKNU'}
     onError={(e) => {
       if (e.target.src !== window.location.origin + '/assets/college-logo.png') {
         e.target.src = '/assets/college-logo.png';
       }
     }}
   />
   <h2>{cfg?.collegeName || 'Adikavi Nannaya University'}</h2>
   <p>{cfg?.address || 'Rajamahendravaram, Andhra Pradesh'}</p>
  </div>
  <div className="formside"><div className="fbox"><h1>{title}</h1><p className="mut">{sub}</p>{children}</div></div>
 </div>;
}

export function Home(){
 const{cfg,user}=useApp(),nav=useNavigate(),[ev,setEv]=useState([]),[mine,setMine]=useState([]),[msg,setMsg]=useState(null),[cat,setCat]=useState('All');
 const load=()=>api.get('/events').then(r=>setEv(r.data));useEffect(()=>{load()},[]);
 useEffect(()=>{if(user)api.get('/my/regs').then(r=>setMine(r.data.map(x=>x.event._id))).catch(()=>{})},[user]);
 const reg=async e=>{if(!user)return nav('/login');try{await api.post(`/events/${e._id}/register`);setMine([...mine,e._id]);setMsg({ok:1,t:`You are registered for ${e.title}. Download your QR pass from My dashboard.`});load()}catch(x){setMsg({t:err(x)})}};
 const next=ev.filter(e=>!e.completed).sort((a,b)=>a.date.localeCompare(b.date))[0],cats=['All',...new Set(ev.map(e=>e.category).filter(Boolean))],list=ev.filter(e=>cat==='All'||e.category===cat);
 const Btn=({e})=>mine.includes(e._id)?<button className="btn" disabled>Registered</button>:<button className="btn" disabled={e.completed} onClick={()=>reg(e)}>{e.completed?'Completed':'Register'}</button>;
 return <>
 <section className="hero" style={{backgroundImage:`linear-gradient(90deg,rgba(11,29,58,.95) 10%,rgba(11,29,58,.4) 75%),url(${cfg?.hero || '/assets/college-gate.png'})`}}><div className="hero-in">
  <div><h1>{cfg?.collegeName || 'Adikavi Nannaya University'}</h1><p>Events, fests and competitions. Register once, walk in with a QR pass, and collect your certificate online.</p><Link to="/events" className="btn big">Browse events</Link></div>
  {next&&<aside className="next"><span>Happening next</span><h3>{next.title}</h3><p>{D(next.date)[0]} {D(next.date)[1]} · {next.time}<br/>{next.venue}</p><Btn e={next}/></aside>}</div></section>
 <main id="events" className="wrap"><div className="head"><h2>Events</h2><div className="chips">{cats.map(c=><button key={c} className={c===cat?'on':''} onClick={()=>setCat(c)}>{c}</button>)}</div></div>
 {msg&&<div className={'note '+(msg.ok?'':'bad')}>{msg.t}</div>}
 <div className="grid">{list.map(e=><article className="card ev" key={e._id}>
  <div className="bn">{e.banner?<img src={getAssetUrl(e.banner)} alt=""/>:<div className="ph">{e.category||'Event'}</div>}<div className="dt"><b>{D(e.date)[0]}</b>{D(e.date)[1]}</div>{e.category&&<span className="cat">{e.category}</span>}</div>
  <div className="pad"><h3>{e.title}</h3><p className="mut">{e.time} · {e.venue}</p><p>{e.description}</p>
  <div className="row"><span className="mut">{e.seats?Math.max(e.seats-e.taken,0)+' seats left':'Open seating'}</span><Btn e={e}/></div></div></article>)}
 {!list.length&&<p className="mut">No events here yet. Check back soon.</p>}</div></main>
 <section id="gallery" style={{borderTop:'1px solid var(--line)',background:'#fff',padding:'20px 0'}}><Gallery isSection/></section>
 <section id="contact" style={{borderTop:'1px solid var(--line)',background:'var(--mist)',padding:'20px 0'}}><Contact isSection/></section>
 </>}

export function Events(){
 const{cfg,user}=useApp(),nav=useNavigate();
 const[ev,setEv]=useState([]);
 const[mine,setMine]=useState([]);
 const[msg,setMsg]=useState(null);
 const[cat,setCat]=useState('All');
 const[search,setSearch]=useState('');
 const[selected,setSelected]=useState(null);
 const[loading,setLoading]=useState(true);
 const load=()=>api.get('/events').then(r=>{setEv(r.data);setLoading(false)}).catch(()=>setLoading(false));
 useEffect(()=>{load()},[]);
 useEffect(()=>{if(user)api.get('/my/regs').then(r=>setMine(r.data.map(x=>x.event._id))).catch(()=>{})},[user]);
 const reg=async e=>{if(!user)return nav('/login');try{await api.post(`/events/${e._id}/register`);setMine([...mine,e._id]);setMsg({ok:1,t:`You are registered for ${e.title}. Download your QR pass from My dashboard.`});load()}catch(x){setMsg({t:err(x)})}};
 const cats=['All',...new Set(ev.map(e=>e.category).filter(Boolean))];
 const list=ev.filter(e=>(cat==='All'||e.category===cat)&&(!search||e.title.toLowerCase().includes(search.toLowerCase())||e.description?.toLowerCase().includes(search.toLowerCase())));
 const upcoming=list.filter(e=>!e.completed);
 const completed=list.filter(e=>e.completed);
 const Btn=({e,big})=>mine.includes(e._id)?<button className={`btn${big?' big':''}`} disabled style={{opacity:.7}}>✓ Registered</button>:<button className={`btn${big?' big':''}`} disabled={e.completed} onClick={()=>reg(e)}>{e.completed?'Completed':'Register Now'}</button>;

 return <>
  {/* Hero banner */}
  <section className="events-hero">
   <div className="events-hero-bg" style={{backgroundImage:`url(${cfg.hero})`}}/>
   <div className="events-hero-content">
    <span className="events-hero-badge">🎪 University Events</span>
    <h1>Discover & Register</h1>
    <p>Explore all upcoming events, fests, hackathons, workshops and competitions at {cfg.collegeName || 'our university'}. Register with one click and walk in with your QR pass.</p>
    <div className="events-hero-search">
     <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
     <input placeholder="Search events by name or keyword..." value={search} onChange={e=>setSearch(e.target.value)}/>
    </div>
    <div className="events-hero-stats">
     <div className="events-stat-item"><b>{ev.length}</b><span>Total Events</span></div>
     <div className="events-stat-divider"/>
     <div className="events-stat-item"><b>{ev.filter(e=>!e.completed).length}</b><span>Upcoming</span></div>
     <div className="events-stat-divider"/>
     <div className="events-stat-item"><b>{ev.filter(e=>e.completed).length}</b><span>Completed</span></div>
    </div>
   </div>
  </section>

  {/* Main content */}
  <main className="wrap events-main">
   {msg&&<div className={'note '+(msg.ok?'':'bad')} style={{marginBottom:20}}>{msg.t}<button onClick={()=>setMsg(null)} style={{float:'right',background:'none',border:0,cursor:'pointer',fontSize:'1.1rem'}}>✕</button></div>}

   {/* Category filters */}
   <div className="events-filters">
    <div className="chips">{cats.map(c=><button key={c} className={c===cat?'on':''} onClick={()=>setCat(c)}>{c}</button>)}</div>
    <span className="mut">{list.length} event{list.length!==1?'s':''} found</span>
   </div>

   {loading&&<div style={{textAlign:'center',padding:'60px 0'}}><div className="events-loader"/><p className="mut" style={{marginTop:16}}>Loading events...</p></div>}

   {/* Upcoming events */}
   {!loading&&upcoming.length>0&&<>
    <div className="events-section-header">
     <div className="events-section-dot upcoming"/>
     <h2>Upcoming Events</h2>
     <span className="mut">({upcoming.length})</span>
    </div>
    <div className="events-gallery">
     {upcoming.map((e,i)=>(
      <article className={`events-gallery-card${i===0&&upcoming.length>2?' featured':''}`} key={e._id} onClick={()=>setSelected(e)}>
       <div className="events-gallery-img">
        {e.banner?<img src={getAssetUrl(e.banner)} alt={e.title}/>:<div className="events-gallery-ph"><span>{e.category||'Event'}</span></div>}
        <div className="events-gallery-overlay">
         <span className="events-gallery-view">View Details</span>
        </div>
        <div className="events-gallery-date"><b>{D(e.date)[0]}</b><span>{D(e.date)[1]}</span></div>
        {e.category&&<span className="events-gallery-cat">{e.category}</span>}
       </div>
       <div className="events-gallery-info">
        <h3>{e.title}</h3>
        <div className="events-gallery-meta">
         <span>🕐 {e.time}</span>
         <span>📍 {e.venue}</span>
        </div>
        <p className="events-gallery-desc">{e.description}</p>
        <div className="events-gallery-footer">
         <span className="events-seats">{e.seats?<><b>{Math.max(e.seats-e.taken,0)}</b> seats left</>:'Open seating'}</span>
         <Btn e={e}/>
        </div>
       </div>
      </article>
     ))}
    </div>
   </>}

   {/* Completed events */}
   {!loading&&completed.length>0&&<>
    <div className="events-section-header" style={{marginTop:48}}>
     <div className="events-section-dot completed"/>
     <h2>Past Events</h2>
     <span className="mut">({completed.length})</span>
    </div>
    <div className="events-gallery">
     {completed.map(e=>(
      <article className="events-gallery-card past" key={e._id} onClick={()=>setSelected(e)}>
       <div className="events-gallery-img">
        {e.banner?<img src={getAssetUrl(e.banner)} alt={e.title}/>:<div className="events-gallery-ph"><span>{e.category||'Event'}</span></div>}
        <div className="events-gallery-overlay">
         <span className="events-gallery-view">View Details</span>
        </div>
        <div className="events-gallery-date"><b>{D(e.date)[0]}</b><span>{D(e.date)[1]}</span></div>
        {e.category&&<span className="events-gallery-cat">{e.category}</span>}
        <div className="events-completed-badge">Completed</div>
       </div>
       <div className="events-gallery-info">
        <h3>{e.title}</h3>
        <div className="events-gallery-meta">
         <span>🕐 {e.time}</span>
         <span>📍 {e.venue}</span>
        </div>
        <p className="events-gallery-desc">{e.description}</p>
       </div>
      </article>
     ))}
    </div>
   </>}

   {!loading&&!list.length&&<div style={{textAlign:'center',padding:'60px 0'}}>
    <div style={{fontSize:'3rem',marginBottom:12}}>🔍</div>
    <h3 style={{color:'var(--ink)',margin:'0 0 6px'}}>No events found</h3>
    <p className="mut">Try adjusting your search or category filter.</p>
   </div>}
  </main>

  {/* Event detail modal */}
  {selected&&<div className="modal" onClick={()=>setSelected(null)}>
   <div className="events-detail-modal" onClick={e=>e.stopPropagation()}>
    <button className="events-detail-close" onClick={()=>setSelected(null)}>✕</button>
    <div className="events-detail-banner">
     {selected.banner?<img src={getAssetUrl(selected.banner)} alt={selected.title}/>:<div className="events-gallery-ph" style={{height:260}}><span>{selected.category||'Event'}</span></div>}
     {selected.category&&<span className="events-gallery-cat" style={{top:16,right:16,fontSize:'.9rem',padding:'5px 16px'}}>{selected.category}</span>}
    </div>
    <div className="events-detail-body">
     <h2 style={{margin:'0 0 8px',fontSize:'1.8rem'}}>{selected.title}</h2>
     <div className="events-gallery-meta" style={{fontSize:'1rem',marginBottom:16}}>
      <span>📅 {selected.date}</span>
      <span>🕐 {selected.time}</span>
      <span>📍 {selected.venue}</span>
     </div>
     <p style={{lineHeight:1.7,color:'var(--ink)',fontSize:'1.02rem'}}>{selected.description}</p>
     <div className="events-detail-footer">
      <div className="events-seats" style={{fontSize:'1rem'}}>
       {selected.seats?<><b>{Math.max(selected.seats-selected.taken,0)}</b> of {selected.seats} seats remaining</>:'Open seating — no limit'}
      </div>
      <Btn e={selected} big/>
     </div>
    </div>
   </div>
  </div>}
 </>;
}

const GALLERY_ITEMS=[
 {id:1,title:'University Grand Entrance',cat:'Campus',img:'/assets/college-gate.png',desc:'The magnificent main gate and lush academic campus of Adikavi Nannaya University.'},
 {id:2,title:'Annual Cultural Fest - Youth Tarang',cat:'Cultural',img:'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80',desc:'Students celebrating arts, traditional classical dance, and folk music on stage.'},
 {id:3,title:'Hackathon & Tech Wiz Competition',cat:'Technical',img:'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&auto=format&fit=crop&q=80',desc:'Inter-college competitive programming, robotics exhibitions, and innovative tech projects.'},
 {id:4,title:'Annual Sports Day & Athletics Meet',cat:'Sports',img:'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&auto=format&fit=crop&q=80',desc:'Track and field events, football, cricket tournaments, and athletic championship ceremonies.'},
 {id:5,title:'Grand University Auditorium',cat:'Campus',img:'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80',desc:'Air-conditioned modern auditorium hosting national conferences, workshops, and guest summits.'},
 {id:6,title:'Convocation & Degree Felicitations',cat:'Academic',img:'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&auto=format&fit=crop&q=80',desc:'Honoring outstanding graduates, medal winners, and celebrating university milestone achievements.'}
];

export function Gallery({isSection}){
 const[items,setItems]=useState([]);
 const[cat,setCat]=useState('All');
 const[loading,setLoading]=useState(true);

 useEffect(()=>{
  api.get('/gallery')
   .then(r=>setItems(r.data))
   .catch(()=>setItems(GALLERY_ITEMS))
   .finally(()=>setLoading(false));
 },[]);

 const effectiveItems = items.length ? items : GALLERY_ITEMS;
 const cats = ['All', ...new Set(effectiveItems.map(x => x.category || x.cat).filter(Boolean))];
 const list = cat === 'All' ? effectiveItems : effectiveItems.filter(x => (x.category || x.cat) === cat);

 return <div className="wrap" style={{minHeight:isSection?'auto':'80vh',paddingTop:isSection?'30px':'40px'}}>
  <div className="head" style={{marginBottom:'24px'}}>
   <div>
    <h2>Campus Gallery</h2>
    <p className="mut" style={{margin:'4px 0 0'}}>Glimpses of memorable campus fests, workshops, cultural celebrations, and sports meets.</p>
   </div>
   <div className="chips">
    {cats.map(c=><button key={c} className={c===cat?'on':''} onClick={()=>setCat(c)}>{c}</button>)}
   </div>
  </div>

  <div className="grid" style={{gridTemplateColumns:'repeat(auto-fill,minmax(320px,1fr))',gap:'24px'}}>
   {list.map(item=>(
    <div className="card ev" key={item._id||item.id} style={{display:'flex',flexDirection:'column'}}>
     <div className="bn" style={{height:'220px'}}>
      {(item.image||item.img)?(
       <img src={getAssetUrl(item.image||item.img)} alt={item.title} style={{height:'220px',width:'100%',objectFit:'cover'}} onError={e=>{e.target.style.display='none'}}/>
      ):(
       <div className="ph">{item.category||item.cat||'Campus'}</div>
      )}
      <span className="cat">{item.category||item.cat||'Campus'}</span>
     </div>
     <div className="pad" style={{flex:1,display:'flex',flexDirection:'column'}}>
      <h3 style={{fontSize:'1.2rem',margin:'0 0 6px'}}>{item.title}</h3>
      <p className="mut" style={{fontSize:'.9rem',margin:0}}>{item.description||item.desc}</p>
     </div>
    </div>
   ))}
   {!list.length&&!loading&&<p className="mut" style={{gridColumn:'1/-1',textAlign:'center',padding:'30px 0'}}>No photos found in this category.</p>}
  </div>
 </div>;
}

export function Contact({isSection}){
 const{cfg}=useApp();
 const[f,setF]=useState({name:'',email:'',phone:'',subject:'',msg:''});
 const[sent,setSent]=useState(false);

 const handleSubmit=(e)=>{
  e.preventDefault();
  if(!f.name||!f.email||!f.msg){alert('Please fill in your name, email, and message.');return}
  setSent(true);
 };

 return <div className="wrap" style={{minHeight:isSection?'auto':'80vh',paddingTop:isSection?'30px':'40px'}}>
  <div style={{textAlign:'center',maxWidth:'660px',margin:'0 auto 36px'}}>
   <h2>Contact Us</h2>
   <p className="mut" style={{fontSize:'1.05rem',margin:'6px 0 0'}}>
    Have questions regarding upcoming university events, student registrations, or event certificates? Get in touch with our event cell.
   </p>
  </div>

  <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(330px,1fr))',gap:'26px',alignItems:'start'}}>
   <div className="card pad" style={{borderLeft:'6px solid var(--gold)'}}>
    <h3 style={{fontSize:'1.35rem',margin:'0 0 16px'}}>{cfg.collegeName||'Adikavi Nannaya University'}</h3>
    
    <div style={{display:'flex',flexDirection:'column',gap:'16px'}}>
     <div style={{display:'flex',gap:'12px',alignItems:'flex-start'}}>
      <div style={{width:'38px',height:'38px',borderRadius:'10px',background:'#e8edf8',color:'var(--navy)',display:'grid',placeItems:'center',flexShrink:0,fontWeight:700}}>👤</div>
      <div>
       <b style={{display:'block',fontSize:'.92rem'}}>Contact Coordinator / Cell</b>
       <span className="mut" style={{fontSize:'.9rem'}}>{cfg.contactName||'Event Coordinator Cell'}</span>
      </div>
     </div>

     <div style={{display:'flex',gap:'12px',alignItems:'flex-start'}}>
      <div style={{width:'38px',height:'38px',borderRadius:'10px',background:'#e8edf8',color:'var(--navy)',display:'grid',placeItems:'center',flexShrink:0,fontWeight:700}}>✉️</div>
      <div>
       <b style={{display:'block',fontSize:'.92rem'}}>Email Address</b>
       <a href={`mailto:${cfg.contactEmail||'events@aknu.edu.in'}`} style={{fontSize:'.9rem',color:'var(--navy)',textDecoration:'none',fontWeight:600}}>{cfg.contactEmail||'events@aknu.edu.in'}</a>
      </div>
     </div>

     <div style={{display:'flex',gap:'12px',alignItems:'flex-start'}}>
      <div style={{width:'38px',height:'38px',borderRadius:'10px',background:'#e8edf8',color:'var(--navy)',display:'grid',placeItems:'center',flexShrink:0,fontWeight:700}}>📞</div>
      <div>
       <b style={{display:'block',fontSize:'.92rem'}}>Helpline & Phone Number</b>
       <a href={`tel:${(cfg.contactPhone||'+91 883 2566004').split('/')[0].trim()}`} style={{fontSize:'.9rem',color:'var(--navy)',textDecoration:'none',fontWeight:600}}>{cfg.contactPhone||'+91 883 2566004 / 2566009'}</a>
      </div>
     </div>

     <div style={{display:'flex',gap:'12px',alignItems:'flex-start'}}>
      <div style={{width:'38px',height:'38px',borderRadius:'10px',background:'#e8edf8',color:'var(--navy)',display:'grid',placeItems:'center',flexShrink:0,fontWeight:700}}>📍</div>
      <div>
       <b style={{display:'block',fontSize:'.92rem'}}>Campus Address</b>
       <span className="mut" style={{fontSize:'.9rem'}}>{cfg.address||'Rajamahendravaram, Andhra Pradesh - 533296'}</span>
      </div>
     </div>

     <div style={{display:'flex',gap:'12px',alignItems:'flex-start'}}>
      <div style={{width:'38px',height:'38px',borderRadius:'10px',background:'#e8edf8',color:'var(--navy)',display:'grid',placeItems:'center',flexShrink:0,fontWeight:700}}>⏰</div>
      <div>
       <b style={{display:'block',fontSize:'.92rem'}}>Office Working Hours</b>
       <span className="mut" style={{fontSize:'.9rem'}}>Monday – Saturday: 9:30 AM to 5:00 PM</span>
      </div>
     </div>
    </div>
   </div>

   <div className="card pad">
    <h3 style={{fontSize:'1.35rem',margin:'0 0 8px'}}>Send us a message</h3>
    <p className="mut" style={{margin:'0 0 16px',fontSize:'.92rem'}}>Our event committee will respond to your query promptly.</p>

    {sent?(
     <div className="note" style={{margin:'14px 0',padding:'18px'}}>
      <b style={{display:'block',color:'var(--ok)',fontSize:'1.1rem',marginBottom:'4px'}}>✓ Message Sent Successfully!</b>
      <span>Thank you for reaching out. The university event team will contact you shortly via email.</span>
     </div>
    ):(
     <form onSubmit={handleSubmit} style={{display:'flex',flexDirection:'column',gap:'12px'}}>
      <div>
       <label style={{fontSize:'.88rem'}}>Your Name *</label>
       <input required value={f.name} onChange={e=>setF({...f,name:e.target.value})} placeholder="Full name"/>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px'}}>
       <div>
        <label style={{fontSize:'.88rem'}}>Email *</label>
        <input required type="email" value={f.email} onChange={e=>setF({...f,email:e.target.value})} placeholder="name@email.com"/>
       </div>
       <div>
        <label style={{fontSize:'.88rem'}}>Phone</label>
        <input value={f.phone} onChange={e=>setF({...f,phone:e.target.value})} placeholder="Contact number"/>
       </div>
      </div>
      <div>
       <label style={{fontSize:'.88rem'}}>Subject</label>
       <input value={f.subject} onChange={e=>setF({...f,subject:e.target.value})} placeholder="Event registration / inquiry"/>
      </div>
      <div>
       <label style={{fontSize:'.88rem'}}>Message *</label>
       <textarea required rows="4" value={f.msg} onChange={e=>setF({...f,msg:e.target.value})} placeholder="Write your message here..."/>
      </div>
      <button type="submit" className="btn" style={{alignSelf:'flex-start',marginTop:'6px'}}>
       Send Message
      </button>
     </form>
    )}
   </div>
  </div>
 </div>;
}
function Auth({reg}){
 const{login}=useApp(),nav=useNavigate(),[f,setF]=useState({name:'',email:'',password:''}),[e,setE]=useState(''),[loading,setLoading]=useState(false),[success,setSuccess]=useState(false);
 const handleSubmit = async (ev) => {
   if (ev) ev.preventDefault();
   if (loading || success) return;
   setE('');
   setLoading(true);
   try {
     const { data } = await api.post(reg ? '/auth/register' : '/auth/login', f);
     setSuccess(true);
     login(data);
     setTimeout(() => {
       nav('/passes');
     }, 850);
   } catch (x) {
     setE(err(x));
     setLoading(false);
   }
 };
 const set = (k) => (v) => setF({ ...f, [k]: v.target.value });

 return (
   <AuthShell
     title={reg ? 'Create your account' : 'Welcome back'}
     sub={reg ? 'Register to join events and get your QR pass.' : 'Login to register for events and download certificates.'}
   >
     {success && (
       <div className="auth-transition-overlay">
         <div className="auth-transition-box">
           <div className="auth-spinner" />
           <h3>{reg ? 'Account Created!' : 'Login Successful!'}</h3>
           <p className="mut">Loading your passes dashboard...</p>
         </div>
       </div>
     )}

     <form onSubmit={handleSubmit} style={{display:'flex',flexDirection:'column',gap:'14px',width:'100%'}}>
       {reg && (
         <div>
           <label style={{display:'block',marginBottom:'4px',fontWeight:600,fontSize:'.9rem'}}>Full Name</label>
           <input
             required
             autoFocus
             placeholder="e.g. Veera Bhadra Rao"
             value={f.name}
             onChange={set('name')}
             disabled={loading || success}
           />
         </div>
       )}
       <div>
         <label style={{display:'block',marginBottom:'4px',fontWeight:600,fontSize:'.9rem'}}>Email Address</label>
         <input
           required
           type="email"
           autoFocus={!reg}
           placeholder="name@email.com"
           value={f.email}
           onChange={set('email')}
           disabled={loading || success}
         />
       </div>
       <div>
         <label style={{display:'block',marginBottom:'4px',fontWeight:600,fontSize:'.9rem'}}>Password</label>
         <input
           required
           type="password"
           placeholder="Enter your password"
           value={f.password}
           onChange={set('password')}
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
             <span>{reg ? 'Creating account...' : 'Signing in...'}</span>
           </>
         ) : (
           <span>{reg ? 'Register' : 'Login'}</span>
         )}
       </button>
     </form>

     <p className="mut" style={{marginTop:'14px'}}>
       {reg ? (
         <>Already have an account? <Link to="/login" style={{fontWeight:700}}>Login</Link></>
       ) : (
         <>New here? <Link to="/register" style={{fontWeight:700}}>Create an account</Link></>
       )}
     </p>
   </AuthShell>
 );
}
export const Login=()=><Auth/>;export const Register=()=><Auth reg/>;

export function Dashboard({ defaultTab = 'all' }){
 const { user, cfg, updateUser } = useApp();
 const [regs, setR] = useState([]);
 const [certs, setC] = useState([]);
 const [tab, setTab] = useState(defaultTab);
 const [showProfile, setShowProfile] = useState(false);
 const [pForm, setPForm] = useState({ name: user?.name || '', currentPassword: '', newPassword: '' });
 const [pMsg, setPMsg] = useState(null);
 const [pBusy, setPBusy] = useState(false);
 const [downloadingId, setDownloadingId] = useState(null);

 const handleDownloadPass = async (r) => {
   setDownloadingId(r._id);
   try {
     await makePass(r, cfg, user?.name);
   } catch (e) {
     console.error(e);
   } finally {
     setTimeout(() => setDownloadingId(null), 1500);
   }
 };

 useEffect(() => {
   setTab(defaultTab);
 }, [defaultTab]);

 useEffect(() => {
   if (user) {
     api.get('/my/regs').then(r => setR(r.data)).catch(() => {});
     api.get('/my/certs').then(r => setC(r.data)).catch(() => {});
     setPForm(f => ({ ...f, name: user.name || '' }));
   }
 }, [user]);

 if (!user) return <div className="wrap"><Link to="/login">Login</Link> to see your dashboard.</div>;

 const saveProfile = async e => {
   e.preventDefault();
   setPBusy(true);
   setPMsg(null);
   try {
     const { data } = await api.put('/auth/profile', pForm);
     if (updateUser) updateUser(data.user);
     setPMsg({ ok: 1, text: 'Profile updated successfully!' });
     setTimeout(() => {
       setShowProfile(false);
       setPMsg(null);
       setPForm(f => ({ ...f, currentPassword: '', newPassword: '' }));
     }, 1200);
   } catch (x) {
     setPMsg({ ok: 0, text: err(x) });
   } finally {
     setPBusy(false);
   }
 };

 return (
   <main className="wrap">
     <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:'16px',marginBottom:'20px'}}>
       <div>
         <h2 style={{margin:0,fontSize:'1.85rem'}}>Hello, {user.name}</h2>
         <p className="mut" style={{margin:'4px 0 0',fontSize:'.95rem'}}>
           {tab === 'passes' ? 'Download your event entry passes with QR codes.' : tab === 'certs' ? 'Download your event participation and winner certificates.' : 'Access and download your event passes and certificates.'}
         </p>
       </div>
       <button
         className="ghost"
         onClick={() => setShowProfile(true)}
         style={{display:'inline-flex',alignItems:'center',gap:'8px',background:'#fff',borderColor:'var(--line)',padding:'8px 16px',borderRadius:'99px',cursor:'pointer',fontWeight:600}}
         title="Edit Profile"
       >
         <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
           <path d="M12 20h9"/>
           <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
         </svg>
         <span>Edit Profile</span>
       </button>
     </div>

     {/* Filter / Category Chips */}
     <div className="chips" style={{marginBottom:'24px'}}>
       <button className={tab === 'all' ? 'on' : ''} onClick={() => setTab('all')}>
         All
       </button>
       <button className={tab === 'passes' ? 'on' : ''} onClick={() => setTab('passes')}>
         🎫 Download Pass ({regs.length})
       </button>
       <button className={tab === 'certs' ? 'on' : ''} onClick={() => setTab('certs')}>
         🏆 Download Certificate ({certs.length})
       </button>
     </div>

     {/* Passes Section */}
     {(tab === 'all' || tab === 'passes') && (
       <section style={{marginBottom:'36px'}}>
         <div style={{display:'flex',justifyContent:'space-between',alignItems:'baseline',marginBottom:'12px'}}>
           <h3 style={{margin:0,fontSize:'1.35rem'}}>My event passes</h3>
           <span className="mut" style={{fontSize:'.88rem'}}>Click "Download pass" to save ticket image</span>
         </div>
         <div className="tickets">
           {regs.map(r => (
             <div className="ticket" key={r._id}>
               <div className="tk-main">
                 <h3>{r.event.title}</h3>
                 <p className="mut">{r.event.date} · {r.event.time}<br />{r.event.venue}</p>
                 <span className={'pill ' + (r.attended ? 'ok' : '')}>
                   {r.attended ? 'Attended' : 'Not checked in yet'}
                 </span>
                 <button
                    className="btn"
                    disabled={downloadingId === r._id}
                    onClick={() => handleDownloadPass(r)}
                  >
                    {downloadingId === r._id ? 'Generating pass...' : 'Download pass'}
                  </button>
               </div>
               <div className="tk-qr">
                 <img src={r.qr} alt="QR pass" />
                 <b>{r.ticket}</b>
               </div>
             </div>
           ))}
           {!regs.length && (
             <div className="card pad" style={{gridColumn:'1/-1',textAlign:'center',padding:'36px 20px',background:'#fff'}}>
               <p className="mut" style={{fontSize:'1rem',margin:'0 0 14px'}}>You have not registered for any event yet.</p>
               <Link to="/#events" className="btn">Browse events</Link>
             </div>
           )}
         </div>
       </section>
     )}

     {/* Certificates Section */}
     {(tab === 'all' || tab === 'certs') && (
       <section style={{marginBottom:'36px'}}>
         <div style={{display:'flex',justifyContent:'space-between',alignItems:'baseline',marginBottom:'12px'}}>
           <h3 style={{margin:0,fontSize:'1.35rem'}}>My certificates</h3>
           <span className="mut" style={{fontSize:'.88rem'}}>Official verified certificates</span>
         </div>
         <div className="grid">
           {certs.map(c => (
             <div className="card pad cert" key={c._id}>
               <div className="seal">{c.type === 'Participation' ? 'P' : c.type.replace('Winner ', '')}</div>
               <h3>{c.type === 'Participation' ? 'Certificate of Participation' : 'Winner certificate'}</h3>
               <p style={{fontWeight:600}}>{c.event?.title}</p>
               <p className="mut">{c.type}</p>
               <button className="btn" onClick={() => dl(`/cert/${c.cid}.pdf`, `certificate-${c.cid}.pdf`)}>
                 Download PDF
               </button>
             </div>
           ))}
           {!certs.length && (
             <div className="card pad" style={{gridColumn:'1/-1',textAlign:'center',padding:'36px 20px',background:'#fff'}}>
               <p className="mut" style={{fontSize:'1rem',margin:0}}>Certificates appear here after the organiser publishes them.</p>
             </div>
           )}
         </div>
       </section>
     )}

     {/* Edit Profile Modal */}
     {showProfile && (
       <div className="modal" onClick={() => setShowProfile(false)}>
         <div className="card pad" onClick={e => e.stopPropagation()} style={{maxWidth:'420px',width:'100%'}}>
           <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'8px'}}>
             <h3 style={{margin:0}}>Edit Profile</h3>
             <button type="button" className="ghost" onClick={() => setShowProfile(false)} style={{border:0,fontSize:'1.2rem',cursor:'pointer',padding:'2px 8px'}}>✕</button>
           </div>
           {pMsg && <div className={'note ' + (pMsg.ok ? '' : 'bad')}>{pMsg.text}</div>}
           <form onSubmit={saveProfile} style={{display:'flex',flexDirection:'column',gap:'12px'}}>
             <div>
               <label>Full Name</label>
               <input value={pForm.name} onChange={e => setPForm({ ...pForm, name: e.target.value })} required />
             </div>
             <div>
               <label>Current Password <span className="mut">(optional)</span></label>
               <input type="password" value={pForm.currentPassword} onChange={e => setPForm({ ...pForm, currentPassword: e.target.value })} placeholder="Required only if changing password" />
             </div>
             <div>
               <label>New Password <span className="mut">(optional)</span></label>
               <input type="password" value={pForm.newPassword} onChange={e => setPForm({ ...pForm, newPassword: e.target.value })} placeholder="At least 6 characters" />
             </div>
             <div style={{display:'flex',gap:'10px',justifyContent:'flex-end',marginTop:'8px'}}>
               <button type="button" className="ghost" onClick={() => setShowProfile(false)}>Cancel</button>
               <button type="submit" className="btn" disabled={pBusy}>{pBusy ? 'Saving...' : 'Save Changes'}</button>
             </div>
           </form>
         </div>
       </div>
     )}
   </main>
 );
}
export function Verify(){
 const{cid}=useParams(),{cfg}=useApp(),[d,setD]=useState(null),[e,setE]=useState('');
 useEffect(()=>{api.get('/verify/'+cid).then(r=>setD(r.data)).catch(x=>setE(err(x)))},[cid]);
 return <div className="wrap vf"><div className="card pad"><img src={cfg.logo} height="70" alt=""/>{d?<><h2>Valid certificate</h2><p className="big"><b>{d.name}</b></p><p>{d.type} in {d.event}</p><p className="mut">{d.date} · {cfg.collegeName}</p></>:<h2>{e||'Checking...'}</h2>}</div></div>}
closed