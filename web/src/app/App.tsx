import { Suspense, useEffect, useState } from 'react';
import { HashRouter, Navigate, NavLink, Route, Routes, useLocation } from 'react-router-dom';
import { useAuth } from '../core/auth';
import { config, FIXED_KEY, fixedSource, parseProjectIds } from '../core/config';
import { useRealtime, type RtStatus } from '../core/realtime';
import Login from '../features/login/Login';
import { ALL_TABS, TABS } from './tabs';

const BUILD = (import.meta.env.VITE_BUILD_INFO as string | undefined) || 'dev';

const RT_LABEL: Record<RtStatus, string> = { off: 'Realtime: tắt', connecting: 'Realtime: đang kết nối', open: 'Realtime: đang đăng nhập', authed: 'Realtime: đã kết nối', closed: 'Realtime: đã ngắt', error: 'Realtime: lỗi' };

function RealtimeBadge() {
  const { status, message, frames } = useRealtime();
  return <span className={`rt rt-${status}`} title={`${message}${frames ? ` · ${frames} khung` : ''}`}>● {RT_LABEL[status]}</span>;
}

const NAV_KEY = 'nav_open';
function loadOpen(): Record<string, boolean> { try { return JSON.parse(localStorage.getItem(NAV_KEY) || '{}'); } catch { return {}; } }

function fixedLabel() { const ids = parseProjectIds(config().projectId); return ids.length ? ids[0].slice(0, 8) + (ids.length > 1 ? ` +${ids.length - 1}` : '') : ''; }

function Shell() {
  const startRt = useRealtime(s => s.start), stopRt = useRealtime(s => s.stop);
  useEffect(() => { startRt(); return stopRt; }, [startRt, stopRt]);   // một kết nối WebSocket dùng chung, sống cùng phiên đăng nhập
  const { user, signOut } = useAuth();
  const loc = useLocation();
  const cur = ALL_TABS.find(t => loc.pathname === `/${t.id}`);
  // Nhóm điều hướng xổ/thu được; nhóm chứa tab đang mở luôn xổ. Trạng thái nhớ trong localStorage.
  const [open, setOpen] = useState<Record<string, boolean>>(loadOpen);
  const toggle = (g: string) => setOpen(o => { const n = { ...o, [g]: !(o[g] ?? false) }; try { localStorage.setItem(NAV_KEY, JSON.stringify(n)); } catch { /* bị chặn */ } return n; });
  return (
    <div className="app">
      <header className="top"><b>SLCP</b><small>{BUILD}</small><RealtimeBadge />{(fixedSource === 'scan' || fixedSource === 'url') && (
          <span className="fixed" title="Đang khoá theo projectId nhập ở GIS / chọn ở scan.html / ?pid=">Dự án cố định {fixedLabel()}
            <button className="b" onClick={() => { try { localStorage.removeItem(FIXED_KEY); } catch { /* bị chặn */ } location.reload(); }}>Bỏ</button></span>
        )}
        <span>Xin chào, <b>{user}</b></span><button onClick={signOut}>Đăng xuất</button></header>
      <nav className="nav">
        {TABS.map(g => {
          const isOpen = g.group === cur?.group || !!open[g.group];
          return (
            <div key={g.group}>
              <button className="grp" aria-expanded={isOpen} onClick={() => toggle(g.group)}><span>{isOpen ? '▾' : '▸'}</span> {g.group}</button>
              {isOpen && g.tabs.map(t => t.view
                ? <NavLink key={t.id} to={`/${t.id}`} className={({ isActive }) => 'tab' + (isActive ? ' on' : '')}>{t.label}</NavLink>
                : <span key={t.id} className="tab soon">{t.label} · sắp có</span>)}
            </div>
          );
        })}
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
