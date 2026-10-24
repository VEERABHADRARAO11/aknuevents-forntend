import { useEffect, useState } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useLocation,
  Navigate
} from 'react-router-dom';

import { api, Ctx, useApp, getAssetUrl } from './api';
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

const DEFAULT_CFG = {
  collegeName: 'Adikavi Nannaya University',
  logo: '/assets/college-logo.png',
  hero: '/assets/college-gate.png',
  address: 'Rajamahendravaram, Andhra Pradesh',
  signature: '/assets/signature.png',
  signatory: 'Registrar',
  designation: 'Adikavi Nannaya University',
  contactName: 'Event Coordinator Cell',
  contactEmail: 'events@aknu.edu.in',
  contactPhone: '+91 883 2566004 / 2566009'
};

function Nav() {
  const { cfg, user, logout } = useApp();
  const location = useLocation();
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!profileOpen) return;
    const close = (e) => {
      if (!e.target.closest('.profile-dropdown-wrap')) setProfileOpen(false);
    };
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, [profileOpen]);

  // Close dropdown and mobile menu on route change
  useEffect(() => {
    setProfileOpen(false);
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  if (location.pathname.startsWith('/admin') && location.pathname !== '/admin/login') {
    return null;
  }

  return (
    <header className="nav">
      <div className="nav-bar-inner">
        <Link to="/" className="brand" title={cfg.collegeName}>
          <img
            src={cfg.logo || '/assets/college-logo.png'}
            alt={cfg.collegeName || 'AKNU'}
            onError={(e) => {
              if (e.target.src !== window.location.origin + '/assets/college-logo.png') {
                e.target.src = '/assets/college-logo.png';
              }
            }}
          />
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

          <button
            className="mobile-hamburger-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Side Menu"
            title="Open Menu"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          </button>
        </nav>
      </div>

      {/* Off-canvas Side Drawer Backdrop */}
      <div
        className={`mobile-sidebar-backdrop ${mobileMenuOpen ? 'open' : ''}`}
        onClick={() => setMobileMenuOpen(false)}
        aria-hidden="true"
      />

      {/* Off-canvas Side Navigation Drawer */}
      <aside className={`mobile-sidebar ${mobileMenuOpen ? 'open' : ''}`} aria-label="Mobile Navigation">
        <div className="mobile-sidebar-head">
          <Link to="/" className="mobile-sidebar-brand" onClick={() => setMobileMenuOpen(false)}>
            <img
              src={cfg.logo || '/assets/college-logo.png'}
              alt={cfg.collegeName || 'AKNU'}
              onError={(e) => {
                if (e.target.src !== window.location.origin + '/assets/college-logo.png') {
                  e.target.src = '/assets/college-logo.png';
                }
              }}
            />
            <b>{cfg.collegeName || 'AKNU Events'}</b>
          </Link>
          <button
            className="mobile-sidebar-close"
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Close Side Menu"
            title="Close"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div className="mobile-sidebar-body">
          {user && (
            <div className="mobile-sidebar-user">
              <div className="mobile-sidebar-avatar">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="mobile-sidebar-user-info">
                <span className="mobile-sidebar-user-name">{user?.name || 'Student'}</span>
                <span className="mobile-sidebar-user-badge">Student Account</span>
              </div>
            </div>
          )}

          <div className="mobile-sidebar-group">
            <span className="mobile-sidebar-title">Navigation</span>
            <Link
              to="/"
              className={`mobile-sidebar-link ${location.pathname === '/' ? 'active' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                <polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
              <span>Home</span>
            </Link>
            <Link
              to="/events"
              className={`mobile-sidebar-link ${location.pathname === '/events' ? 'active' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              <span>Events & Fests</span>
            </Link>
            <Link
              to="/gallery"
              className={`mobile-sidebar-link ${location.pathname === '/gallery' ? 'active' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <polyline points="21 15 16 10 5 21"/>
              </svg>
              <span>Photo Gallery</span>
            </Link>
            <Link
              to="/contact"
              className={`mobile-sidebar-link ${location.pathname === '/contact' ? 'active' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
              </svg>
              <span>Contact Us</span>
            </Link>
          </div>

          {user ? (
            <div className="mobile-sidebar-group" style={{marginTop:'8px'}}>
              <span className="mobile-sidebar-title">Student Dashboard</span>
              <Link
                to="/me"
                className={`mobile-sidebar-link ${location.pathname === '/me' ? 'active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
                <span>My Profile</span>
              </Link>
              <Link
                to="/passes"
                className={`mobile-sidebar-link ${location.pathname === '/passes' ? 'active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="5" width="20" height="14" rx="2"/>
                  <path d="M2 10h20"/>
                </svg>
                <span>Download Pass</span>
              </Link>
              <Link
                to="/certificates"
                className={`mobile-sidebar-link ${location.pathname === '/certificates' ? 'active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="8" r="6"/>
                  <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/>
                </svg>
                <span>Download Certificates</span>
              </Link>
              <button
                className="mobile-sidebar-logout"
                onClick={() => { setMobileMenuOpen(false); logout(); }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                  <polyline points="16 17 21 12 16 7"/>
                  <line x1="21" y1="12" x2="9" y2="12"/>
                </svg>
                <span>Log Out</span>
              </button>
            </div>
          ) : (
            <div className="mobile-sidebar-auth" style={{marginTop:'12px'}}>
              <span className="mobile-sidebar-title">Student Account</span>
              <Link
                to="/login"
                className="btn"
                style={{textAlign:'center',padding:'12px',borderRadius:'10px',display:'block'}}
                onClick={() => setMobileMenuOpen(false)}
              >
                Student Login
              </Link>
              <Link
                to="/register"
                className="ghost"
                style={{textAlign:'center',padding:'11px',borderRadius:'10px',color:'#fff',borderColor:'rgba(255,255,255,.25)',display:'block'}}
                onClick={() => setMobileMenuOpen(false)}
              >
                Create Account
              </Link>
            </div>
          )}
        </div>

        <div className="mobile-sidebar-footer">
          <div><strong>{cfg.collegeName || 'Adikavi Nannaya University'}</strong></div>
          <div>📍 {cfg.address || 'Rajamahendravaram, AP'}</div>
        </div>
      </aside>
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
  const [cfg, setCfg] = useState(() => {
    try {
      const cached = localStorage.getItem('cached_cfg');
      if (cached) {
        const parsed = JSON.parse(cached);
        return { ...DEFAULT_CFG, ...parsed };
      }
    } catch {}
    return DEFAULT_CFG;
  });

  const readUser = key =>
    JSON.parse(localStorage.getItem('usr_' + key) || 'null');

  const [user, setUser] = useState(() => readUser('student'));
  const [admin, setAdmin] = useState(() => readUser('admin'));

  const load = () =>
    api.get('/settings').then(response => {
      const data = response.data || {};
      const updated = {
        collegeName: data.collegeName || DEFAULT_CFG.collegeName,
        address: data.address || DEFAULT_CFG.address,
        signatory: data.signatory || DEFAULT_CFG.signatory,
        designation: data.designation || DEFAULT_CFG.designation,
        contactName: data.contactName || DEFAULT_CFG.contactName,
        contactEmail: data.contactEmail || DEFAULT_CFG.contactEmail,
        contactPhone: data.contactPhone || DEFAULT_CFG.contactPhone,
        logo: getAssetUrl(data.logo) || DEFAULT_CFG.logo,
        hero: getAssetUrl(data.hero) || DEFAULT_CFG.hero,
        signature: getAssetUrl(data.signature) || DEFAULT_CFG.signature
      };
      setCfg(updated);
      try {
        localStorage.setItem('cached_cfg', JSON.stringify(updated));
      } catch {}
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