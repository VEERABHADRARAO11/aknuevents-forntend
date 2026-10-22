import axios from 'axios';import {createContext,useContext} from 'react';
const side=()=>location.pathname.startsWith('/admin')?'admin':'student';
export const api=axios.create({baseURL:'/api'});
api.interceptors.request.use(c=>{const t=localStorage.getItem('tok_'+side());if(t)c.headers.Authorization='Bearer '+t;return c});
api.interceptors.response.use(r=>r,e=>{if(e.response?.status===401){const k=side();localStorage.removeItem('tok_'+k);localStorage.removeItem('usr_'+k);location.href=k==='admin'?'/admin/login':'/login'}return Promise.reject(e)});
export const err=e=>e.response?.data?.error||e.message;
export const dl=async(url,name)=>{try{const r=await api.get(url,{responseType:'blob'});const a=document.createElement('a');a.href=URL.createObjectURL(r.data);a.download=name;a.click()}catch(x){let m=x.message;try{m=JSON.parse(await x.response.data.text()).error||m}catch{}alert('Download failed: '+m)}};
export const Ctx=createContext();export const useApp=()=>useContext(Ctx);
