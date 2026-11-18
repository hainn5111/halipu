import { Suspense } from 'react';
import { HashRouter, Navigate, NavLink, Route, Routes, useLocation } from 'react-router-dom';
import { useAuth } from '../core/auth';
import { config, FIXED_KEY, fixedSource } from '../core/config';
import Login from '../features/login/Login';
import { ALL_TABS, TABS } from './tabs';

const BUILD = (import.meta.env.VITE_BUILD_INFO as string | undefined) || 'dev';

function Shell() {
  const { user, signOut } = useAuth();
  const loc = useLocation();
  const cur = ALL_TABS.find(t => loc.pathname === `/${t.id}`);
  return (
    <div className="app">
      <header className="top"><b>SLCP</b><small>{BUILD}</small>{fixedSource === 'scan' && (
          <span className="fixed" title="Đang khoá theo dự án chọn ở trang scan">Dự án cố định {config().projectId.slice(0, 8)}
            <button className="b" onClick={() => { try { localStorage.removeItem(FIXED_KEY); } catch { /* bị chặn */ } location.reload(); }}>Bỏ</button></span>
        )}
        <span>Xin chào, <b>{user}</b></span><button onClick={signOut}>Đăng xuất</button></header>
      <nav className="nav">
        {TABS.map(g => (
          <div key={g.group}>
            <div className="grp">{g.group}</div>
            {g.tabs.map(t => t.view
              ? <NavLink key={t.id} to={`/${t.id}`} className={({ isActive }) => 'tab' + (isActive ? ' on' : '')}>{t.label}</NavLink>
              : <span key={t.id} className="tab soon">{t.label} · sắp có</span>)}
          </div>
        ))}
      </nav>
      <section className="main">
        <div className="crumb">{cur ? <>{cur.group} › <b>{cur.label}</b></> : ''}</div>
        <div className="pane">
          <Suspense fallback={<div className="empty">Đang tải…</div>}>
            <Routes>
              {ALL_TABS.filter(t => t.view).map(t => { const V = t.view!; return <Route key={t.id} path={t.id} element={<V />} />; })}
              <Route path="*" element={<Navigate to="/gis" replace />} />
            </Routes>
          </Suspense>
        </div>
      </section>
    </div>
  );
}

export default function App() {
  const signedIn = useAuth(s => s.signedIn);
  return (
    <HashRouter>
      <Routes>
        <Route path="/login" element={signedIn ? <Navigate to="/gis" replace /> : <Login />} />
        <Route path="/*" element={signedIn ? <Shell /> : <Navigate to="/login" replace />} />
      </Routes>
    </HashRouter>
  );
}
