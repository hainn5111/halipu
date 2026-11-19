import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useRef } from 'react';

/** Chọn toạ độ trên bản đồ: bấm để đặt điểm, kéo ghim để chỉnh. lat/lng là chuỗi (đồng bộ với ô nhập). */
export default function MapPicker({ lat, lng, onPick, center }: { lat: string; lng: string; onPick: (lat: string, lng: string) => void; center?: [number, number] }) {
  const el = useRef<HTMLDivElement>(null), map = useRef<L.Map | null>(null), pin = useRef<L.Marker | null>(null), cb = useRef(onPick);
  cb.current = onPick;
  const la = Number(lat), ln = Number(lng), ok = lat.trim() !== '' && lng.trim() !== '' && Number.isFinite(la) && Number.isFinite(ln) && Math.abs(la) <= 90 && Math.abs(ln) <= 180;

  useEffect(() => {
    const m = L.map(el.current!).setView(ok ? [la, ln] : center ?? [16, 106], ok ? 17 : center ? 15 : 5);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution: '© OpenStreetMap' }).addTo(m);
    const fmt = (p: L.LatLng) => cb.current(p.lat.toFixed(6), p.lng.toFixed(6));
    m.on('click', e => fmt(e.latlng));
    map.current = m; setTimeout(() => m.invalidateSize(), 0);
    return () => { m.remove(); map.current = null; pin.current = null; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {   // ghim theo ô nhập
    const m = map.current; if (!m) return;
    if (!ok) { pin.current?.remove(); pin.current = null; return; }
    const p = L.latLng(la, ln);
    if (!pin.current) {
      pin.current = L.marker(p, { draggable: true }).addTo(m);
      pin.current.on('dragend', () => { const q = pin.current!.getLatLng(); cb.current(q.lat.toFixed(6), q.lng.toFixed(6)); });
    } else pin.current.setLatLng(p);
    if (!m.getBounds().contains(p)) m.panTo(p);
  }, [ok, la, ln]);

  return <div ref={el} style={{ height: 260, borderRadius: 8, border: '1px solid var(--line)', marginTop: 4 }} />;
}
