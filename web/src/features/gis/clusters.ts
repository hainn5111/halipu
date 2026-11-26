import Supercluster from 'supercluster';

// Gom nhóm điểm LCU để bản đồ chịu được hàng chục nghìn điểm: chỉ vẽ cụm/điểm trong khung nhìn hiện tại (vài trăm phần tử), không vẽ cả 25k.
export interface Pt { uid: string; name: string; lat: number; lng: number }
export type Props = { uid: string; name: string };
export type Index = Supercluster<Props>;

export function buildIndex(pts: Pt[]): Index {
  const idx = new Supercluster<Props>({ radius: 60, maxZoom: 17, minPoints: 2 });
  idx.load(pts.map(p => ({ type: 'Feature' as const, properties: { uid: p.uid, name: p.name }, geometry: { type: 'Point' as const, coordinates: [p.lng, p.lat] as [number, number] } })));
  return idx;
}
/** Cụm/điểm trong khung nhìn [west, south, east, north] ở mức zoom (làm tròn). */
export const clustersIn = (idx: Index, bounds: [number, number, number, number], zoom: number) => idx.getClusters(bounds, Math.max(0, Math.min(18, Math.round(zoom))));
