import L from 'leaflet';
import { tileLayer } from '../../core/mapTiles';
import 'leaflet/dist/leaflet.css';
import { useEffect, useMemo, useRef, useState } from 'react';
import { buildIndex, clustersIn, type Index } from './clusters';
import { validGeo } from '../../adapters/fonda/mappers';
import { applyFixedProjects, config, fixedSource } from '../../core/config';
import { PREVIEW_TOOLS } from '../../core/flags';
import { useLcus } from '../../core/store';
import LcuPanel from '../lcu-panel/LcuPanel';

const BASE = { color: '#0f172a', weight: 1.5, radius: 8, fillColor: '#f59e0b' };
const SEL = { color: '#ffffff', weight: 4, radius: 11, fillColor: '#ef4444' };

export default function Gis() {
  const { lcus, status, progress, error, selectedUid, load, select } = useLcus();
  const el = useRef<HTMLDivElement>(null), map = useRef<L.Map | null>(null), layer = useRef<L.LayerGroup | null>(null);
  const markers = useRef(new Map<string, L.CircleMarker>()), canvas = useRef<L.Canvas | null>(null), index = useRef<Index | null>(null), draw = useRef<() => void>(() => undefined);
  const [q, setQ] = useState('');
  const fitted = useRef(false);
  const [open, setOpen] = useState(false);
  const [pidText, setPidText] = useState(fixedSource ? config().projectId : '');

  useEffect(() => { void load(); }, [load]);

  const selRef = useRef<string | null>(null); selRef.current = selectedUid;
  const lcusRef = useRef(lcus); lcusRef.current = lcus;

  useEffect(() => {   // bản đồ: tạo 1 lần; vẽ lại cụm/điểm khi kéo/phóng
    const m = L.map(el.current!, { preferCanvas: true }).setView([16, 106], 5);
    tileLayer().addTo(m);
    layer.current = L.layerGroup().addTo(m); map.current = m;
    canvas.current = L.canvas({ padding: 0.5 });
    const render = () => {
      const g = layer.current, idx = index.current; if (!g) return;
      g.clearLayers(); markers.current.clear();
      if (!idx) return;
      const b = m.getBounds().pad(0.15), z = m.getZoom();
      const items = clustersIn(idx, [b.getWest(), b.getSouth(), b.getEast(), b.getNorth()], z);
      let selDrawn = false;
      for (const f of items) {
        const [lng, lat] = f.geometry.coordinates as [number, number], pr = f.properties as { cluster?: boolean; cluster_id?: number; point_count?: number; uid?: string; name?: string };
        if (pr.cluster) {
          const n = pr.point_count ?? 0, size = n > 1000 ? 46 : n > 100 ? 40 : 34;
          L.marker([lat, lng], { icon: L.divIcon({ className: '', iconSize: [size, size], html: `<div style="width:${size}px;height:${size}px;border-radius:50%;background:#f59e0bcc;border:2px solid #0f172a;color:#111;font:700 12px sans-serif;display:flex;align-items:center;justify-content:center">${n >= 1000 ? Math.round(n / 100) / 10 + 'k' : n}</div>` }) })
            .on('click', () => m.flyTo([lat, lng], Math.min(idx.getClusterExpansionZoom(pr.cluster_id!), 18))).addTo(g);
          continue;
        }
        const uid = pr.uid!, on = uid === selRef.current; if (on) selDrawn = true;
        const mk = L.circleMarker([lat, lng], { renderer: canvas.current!, fillOpacity: 0.95, ...(on ? SEL : BASE) }).bindTooltip(pr.name || uid).on('click', () => select(uid));
        mk.addTo(g); markers.current.set(uid, mk); if (on) mk.bringToFront();
      }
      void selDrawn;
    };
    draw.current = render;
    m.on('moveend', render);
    setTimeout(() => { m.invalidateSize(); render(); }, 0);
    return () => { m.off('moveend', render); m.remove(); map.current = null; markers.current.clear(); canvas.current = null; index.current = null; fitted.current = false; };
  }, [select]);

  // Dựng chỉ mục gom nhóm khi danh sách/toạ độ đổi (gom nhiều cập nhật liên tiếp vào một lần)
  const geoKey = useMemo(() => { let n = 0; for (const l of lcus) if (l.lat !== undefined) n++; return `${lcus.length}:${n}`; }, [lcus]);
  useEffect(() => {
    const t = window.setTimeout(() => {
      const pts = lcusRef.current.filter(l => validGeo(l.lat === undefined || l.lng === undefined ? null : { lat: l.lat, lng: l.lng })).map(l => ({ uid: l.uid, name: l.name || l.uid, lat: l.lat!, lng: l.lng! }));
      index.current = buildIndex(pts);
      const m = map.current; if (m && pts.length && !fitted.current) { m.fitBounds(pts.map(p => [p.lat, p.lng] as L.LatLngTuple), { padding: [40, 40], maxZoom: 18 }); fitted.current = true; }
      draw.current();
    }, 250);
    return () => clearTimeout(t);
  }, [geoKey]);

  useEffect(() => {   // chọn LCU: viền đỏ; nếu đang nằm trong cụm thì phóng tới điểm (moveend sẽ vẽ điểm lẻ)
    markers.current.forEach((mk, uid) => { const on = uid === selectedUid; mk.setStyle(on ? SEL : BASE); mk.setRadius(on ? SEL.radius : BASE.radius); if (on) mk.bringToFront(); });
    if (!selectedUid) return;
    const mk = markers.current.get(selectedUid), m = map.current; if (!m) return;
    if (mk) { m.panTo(mk.getLatLng()); return; }
    const l = lcusRef.current.find(x => x.uid === selectedUid); if (l && l.lat !== undefined && l.lng !== undefined) m.setView([l.lat, l.lng], Math.max(m.getZoom(), 17));
  }, [selectedUid]);

  const list = useMemo(() => { const t = q.trim().toLowerCase(); return (t ? lcus.filter(l => `${l.name} ${l.uid} ${l.code}`.toLowerCase().includes(t)) : lcus); }, [lcus, q]);

  const sel = lcus.find(l => l.uid === selectedUid);
  return (
    <div className="gis">
      <div ref={el} className="map" />
      <div className="dd">
        {PREVIEW_TOOLS && <form className="pidbar" onSubmit={e => { e.preventDefault(); applyFixedProjects(pidText); }}>
          <input value={pidText} onChange={e => setPidText(e.target.value)} placeholder="ProjectID (nhiều ID: cách nhau dấu phẩy)" spellCheck={false} autoComplete="off" />
          <button type="submit" title="Ghim projectId rồi tải lại LCU của dự án đó">Tải</button>
          {fixedSource && <button type="button" className="b" title="Bỏ ghim, quay về tự dò toàn bộ dự án" onClick={() => applyFixedProjects('')}>Bỏ</button>}
        </form>}
        <button id="ddb" onClick={() => setOpen(o => !o)}>Danh sách LCU ({lcus.length}) ▾</button>
        {open && <div className="menu">
          {status === 'loading' && <div className="empty">{progress || 'Đang tải…'}</div>}
          {status === 'error' && <div className="empty bad">{error}</div>}
          <input style={{ width: '100%', boxSizing: 'border-box', margin: '4px 0' }} placeholder="Lọc theo tên / UID / mã…" value={q} onChange={e => setQ(e.target.value)} />
          {list.slice(0, 100).map(l => (
            <div key={l.uid} className={'it' + (l.lat === undefined ? ' nogeo' : '') + (l.uid === selectedUid ? ' sel' : '')}
              onClick={() => { select(l.uid); setOpen(false); }}>
              <b>{l.name || l.uid}</b>
              <small>{l.code || l.lcuId} · {l.lat !== undefined ? `${l.lat.toFixed(5)}, ${l.lng!.toFixed(5)}` : 'chưa có toạ độ'}</small>
            </div>
          ))}
          {list.length > 100 && <div className="empty">Hiển thị 100/{list.length} — gõ để lọc.</div>}
        </div>}
      </div>
      {sel && <LcuPanel lcu={sel} onClose={() => select(null)} />}
    </div>
  );
}
