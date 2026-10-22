import { useEffect, useState } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useLocation,
  Navigate
} from 'react-router-dom';

import { api, Ctx, useApp } from './api';
import {
  Home,
  Events,
  Login,
  Register,
  Dashboard,
  Verify,
  Gallery,
  Contact
} from './Student';
import { Admin, AdminLogin } from './Admin';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function Nav() {
  const { cfg, user, logout } = useApp();
  const location = useLocation();
  const [profileOpen, setProfileOpen] = useState(false);

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!profileOpen) return;
    const close = (e) => {
      if (!e.target.closest('.profile-dropdown-wrap')) setProfileOpen(false);
    };
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, [profileOpen]);

  // Close dropdown on route change
  useEffect(() => {
    setProfileOpen(false);
  }, [location.pathname]);

  if (location.pathname.startsWith('/admin') && location.pathname !== '/admin/login') {
    return null;
  }

  return (
    <header className="nav">
      <Link to="/" className="brand" title={cfg.collegeName}>
        <img src={cfg.logo} alt={cfg.collegeName || 'AKNU'} />
        <span><b>{cfg.collegeName || 'AKNU'}</b></span>
      </Link>

      <div className="nav-center-menu">
        <Link to="/" className={`nav-menu-link ${location.pathname === '/' ? 'active' : ''}`}>
          Home
        </Link>
        <Link to="/events" className={`nav-menu-link ${location.pathname === '/events' ? 'active' : ''}`}>
          Events
        </Link>
        <Link to="/gallery" className={`nav-menu-link ${location.pathname === '/gallery' ? 'active' : ''}`}>
          Gallery
        </Link>
        <Link to="/contact" className={`nav-menu-link ${location.pathname === '/contact' ? 'active' : ''}`}>
          Contact
        </Link>
      </div>

      <nav className="nav-right">
        {user ? (
          <div className="profile-dropdown-wrap" style={{position:'relative'}}>
            <button
              className="nav-user-pill"
              onClick={(e) => { e.stopPropagation(); setProfileOpen(!profileOpen); }}
              title="Profile menu"
              style={{cursor:'pointer'}}
            >
              <div className="nav-user-avatar">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="nav-user-text">
                <span className="nav-user-name">{user?.name || 'Student'}</span>
                <span className="nav-user-sub">Profile edit</span>
              </div>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="nav-user-icon" style={{transform: profileOpen ? 'rotate(180deg)' : 'none', transition:'transform .2s ease'}}>
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </button>

            {profileOpen && (
              <div className="profile-dropdown">
                <Link to="/me" className="profile-dropdown-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                  <span>Profile</span>
                </Link>
                <Link to="/passes" className="profile-dropdown-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="5" width="20" height="14" rx="2"/>
                    <path d="M2 10h20"/>
                  </svg>
                  <span>Download Pass</span>
                </Link>
                <Link to="/certificates" className="profile-dropdown-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="8" r="6"/>
                    <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/>
                  </svg>
                  <span>Download Certificate</span>
                </Link>
                <div className="profile-dropdown-divider"/>
                <button className="profile-dropdown-item logout" onClick={logout}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                    <polyline points="16 17 21 12 16 7"/>
                    <line x1="21" y1="12" x2="9" y2="12"/>
                  </svg>
                  <span>Log out</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link to="/login" className="nav-login-btn">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            <span>Login</span>
          </Link>
        )}
      </nav>
    </header>
  );
}

function Foot() {
  const location = useLocation();

  if (
    location.pathname.startsWith('/admin') ||
    location.pathname === '/login' ||
    location.pathname === '/register'
  ) {
    return null;
  }

  return (
    <footer className="foot-credit">
      <span>© 2026 Developed by <strong>Bhadra</strong></span>
    </footer>
  );
}

function StudentRoute({ children }) {
  const { user } = useApp();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function AdminRoute({ children }) {
  const { admin } = useApp();

  if (!admin) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}

export default function App() {
  const [cfg, setCfg] = useState({
    collegeName: '',
    logo: '',
    hero: '',
    address: ''
  });

  const readUser = key =>
    JSON.parse(localStorage.getItem('usr_' + key) || 'null');

  const [user, setUser] = useState(() => readUser('student'));
  const [admin, setAdmin] = useState(() => readUser('admin'));

  const load = () =>
    api.get('/settings').then(response => {
      setCfg(response.data);
    }).catch(error => {
      console.error('Settings loading failed:', error.message);
    });

  useEffect(() => {
    load();
  }, []);

  const login = data => {
    const key = data.user.role === 'admin' ? 'admin' : 'student';

    localStorage.setItem('tok_' + key, data.token);
    localStorage.setItem('usr_' + key, JSON.stringify(data.user));

    if (key === 'admin') {
      setAdmin(data.user);
    } else {
      setUser(data.user);
    }
  };

  const logout = () => {
    localStorage.removeItem('tok_student');
    localStorage.removeItem('usr_student');
    setUser(null);
    window.location.href = '/login';
  };

  const logoutAdmin = () => {
    localStorage.removeItem('tok_admin');
    localStorage.removeItem('usr_admin');
    setAdmin(null);
    window.location.href = '/admin/login';
  };

  const updateAdmin = newUser => {
    localStorage.setItem('usr_admin', JSON.stringify(newUser));
    setAdmin(newUser);
  };

  const updateUser = newUser => {
    localStorage.setItem('usr_student', JSON.stringify(newUser));
    setUser(newUser);
  };

  return (
    <Ctx.Provider
      value={{
        cfg,
        load,
        user,
        admin,
        login,
        logout,
        logoutAdmin,
        updateAdmin,
        updateUser
      }}
    >
      <BrowserRouter>
        <ScrollToTop />
        <Nav />

        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/events" element={<Events />} />

          <Route path="/gallery" element={<Gallery />} />

          <Route path="/contact" element={<Contact />} />

          <Route path="/login" element={<Login />} />

          <Route path="/register" element={<Register />} />

          <Route
            path="/me"
            element={
              <StudentRoute>
                <Dashboard defaultTab="all" />
              </StudentRoute>
            }
          />

          <Route
            path="/passes"
            element={
              <StudentRoute>
                <Dashboard defaultTab="passes" />
              </StudentRoute>
            }
          />

          <Route
            path="/certificates"
            element={
              <StudentRoute>
                <Dashboard defaultTab="certs" />
              </StudentRoute>
            }
          />

          <Route path="/verify/:cid" element={<Verify />} />

          <Route
            path="/admin/login"
            element={admin ? <Navigate to="/admin" replace /> : <AdminLogin />}
          />

          <Route
            path="/admin"
            element={
              <AdminRoute>
                <Admin />
              </AdminRoute>
            }
          />

          <Route
            path="/admin/*"
            element={<Navigate to="/admin" replace />}
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        <Foot />
      </BrowserRouter>
    </Ctx.Provider>
  );
}