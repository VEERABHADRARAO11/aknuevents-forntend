import axios from 'axios';
import { createContext, useContext } from 'react';

const side = () => location.pathname.startsWith('/admin') ? 'admin' : 'student';

const rawApi = import.meta.env.VITE_API_URL || '/api';
const API_BASE = rawApi.replace(/\/+$/, '');

export const api = axios.create({ baseURL: API_BASE });

api.interceptors.request.use(c => {
  const t = localStorage.getItem('tok_' + side());
  if (t) c.headers.Authorization = 'Bearer ' + t;
  return c;
});

api.interceptors.response.use(
  r => r,
  e => {
    if (e.response?.status === 401) {
      const k = side();
      localStorage.removeItem('tok_' + k);
      localStorage.removeItem('usr_' + k);
      location.href = k === 'admin' ? '/admin/login' : '/login';
    }
    return Promise.reject(e);
  }
);

export const err = (e) => {
  if (!e) return 'An unknown error occurred';
  if (typeof e === 'string') return e;
  const d = e.response?.data;
  if (d) {
    if (typeof d === 'string') return d;
    if (d.error) {
      if (typeof d.error === 'string') return d.error;
      if (typeof d.error === 'object' && d.error !== null) {
        if (d.error.message && typeof d.error.message === 'string') return d.error.message;
        if (d.error.code) return `Error: ${d.error.code}`;
      }
    }
    if (d.message && typeof d.message === 'string') return d.message;
  }
  if (e.message && typeof e.message === 'string') return e.message;
  return 'An unexpected error occurred';
};

export const dl = async (url, name) => {
  try {
    const r = await api.get(url, { responseType: 'blob' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(r.data);
    a.download = name;
    a.click();
  } catch (x) {
    let m = err(x);
    try {
      m = JSON.parse(await x.response.data.text()).error || m;
    } catch {}
    alert('Download failed: ' + m);
  }
};

export const getServerUrl = () => {
  const s = import.meta.env.VITE_SERVER_URL || '';
  return s.replace(/\/+$/, '');
};

export const getAssetUrl = (url) => {
  if (!url) return '';
  if (/^https?:\/\/|^data:|^blob:/i.test(url)) return url;
  const server = getServerUrl();
  if (server && url.startsWith('/')) {
    return `${server}${url}`;
  }
  return url;
};

export const Ctx = createContext();
export const useApp = () => useContext(Ctx);

