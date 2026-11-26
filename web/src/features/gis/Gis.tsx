import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useRef, useState } from 'react';
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
  const markers = useRef(new Map<string, L.CircleMarker>());
  const fitted = useRef(false);
  const [open, setOpen] = useState(false);
  const [pidText, setPidText] = useState(fixedSource ? config().projectId : '');

  useEffect(() => { void load(); }, [load]);

  useEffect(() => {   // bản đồ: tạo 1 lần
    const m = L.map(el.current!).setView([16, 106], 5);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution: '© OpenStreetMap' }).addTo(m);
    layer.current = L.layerGroup().addTo(m); map.current = m;
    setTimeout(() => m.invalidateSize(), 0);
    return () => { m.remove(); map.current = null; markers.current.clear(); fitted.current = false; };
  }, []);

  useEffect(() => {   // đồng bộ marker theo kho dữ liệu
    const m = map.current, g = layer.current; if (!m || !g) return;
    g.clearLayers(); markers.current.clear();
    const pts: L.LatLngTuple[] = [], cv = L.canvas({ padding: 0.5 });
    for (const l of lcus) {
      if (!validGeo(l.lat === undefined || l.lng === undefined ? null : { lat: l.lat, lng: l.lng })) continue;
      const p: L.LatLngTuple = [l.lat!, l.lng!]; pts.push(p);
      const mk = L.circleMarker(p, { renderer: cv, fillOpacity: 0.95, ...BASE }).bindTooltip(l.name || l.uid).on('click', () => select(l.uid));
      mk.addTo(g); markers.current.set(l.uid, mk);
    }
    if (pts.length && !fitted.current) { m.fitBounds(pts, { padding: [40, 40], maxZoom: 18 }); fitted.current = true; }
  }, [lcus, select]);

  useEffect(() => {   // viền cho LCU đang chọn
    markers.current.forEach((mk, uid) => { const on = uid === selectedUid; mk.setStyle(on ? SEL : BASE); mk.setRadius(on ? SEL.radius : BASE.radius); if (on) mk.bringToFront(); });
    const mk = selectedUid ? markers.current.get(selectedUid) : undefined; if (mk) map.current?.panTo(mk.getLatLng());
  }, [selectedUid, lcus]);

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
          {lcus.map(l => (
            <div key={l.uid} className={'it' + (l.lat === undefined ? ' nogeo' : '') + (l.uid === selectedUid ? ' sel' : '')}
              onClick={() => { select(l.uid); setOpen(false); const mk = markers.current.get(l.uid); if (mk) map.current?.setView(mk.getLatLng(), Math.max(map.current.getZoom(), 17)); }}>
              <b>{l.name || l.uid}</b>
              <small>{l.code || l.lcuId} · {l.lat !== undefined ? `${l.lat.toFixed(5)}, ${l.lng!.toFixed(5)}` : 'chưa có toạ độ'}</small>
            </div>
          ))}
        </div>}
      </div>
      {sel && <LcuPanel lcu={sel} onClose={() => select(null)} />}
    </div>
  );
}
