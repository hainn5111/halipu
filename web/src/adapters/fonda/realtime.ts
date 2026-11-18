// Phân tích khung tin WebSocket của Fonda → sự kiện của mình. Hàm THUẦN, có kiểm thử (docs/11 §2).
type Rec = Record<string, unknown>;
const isRec = (v: unknown): v is Rec => !!v && typeof v === 'object' && !Array.isArray(v);
const asList = (d: unknown): unknown[] => (Array.isArray(d) ? d : d ? [d] : []);
const num = (v: unknown): number | undefined => { const x = typeof v === 'number' ? v : parseFloat(String(v ?? '')); return Number.isFinite(x) ? x : undefined; };

export interface LampState { num: number; dim?: number; on?: boolean }
export interface LampData { num: number; power?: number; voltage?: number; current?: number; pf?: number; lux?: number; fault?: number; energy?: number; time?: string }

export type RtEvent =
  | { kind: 'status'; lcuId: string; lamps: LampState[] }
  | { kind: 'data'; lcuId: string; data: LampData[] }
  | { kind: 'unicast'; lcuId: string; text: string };

/** Khoá loại khung: "cmd/ctrl" (khung bọc trong data.cmd hoặc ở gốc). */
export function frameKey(m: unknown): string {
  if (!isRec(m)) return 'khác';
  const inner = isRec(m.data) && m.data.cmd ? m.data : m;
  return inner.cmd || inner.ctrl ? `${inner.cmd}/${inner.ctrl}` : 'khác';
}

/** Một khung có thể chứa nhiều thiết bị → nhiều sự kiện. Khung không thuộc 3 loại đèn thì trả mảng rỗng. */
export function parseFrame(m: unknown): RtEvent[] {
  if (!isRec(m)) return [];
  const inner = isRec(m.data) && m.data.cmd ? m.data : m;
  const key = frameKey(m), out: RtEvent[] = [];
  if (!/^lampControl\/(status|unicastStatus|data)$/.test(key)) return out;
  for (const it of asList(inner.data)) {
    if (!isRec(it)) continue;
    const lcuId = String(it.deviceId ?? it.lcuId ?? ''); if (!lcuId) continue;
    if (Array.isArray(it.lampStatus)) {
      out.push({ kind: 'status', lcuId, lamps: it.lampStatus.filter(isRec).map(l => ({ num: Number(l.num), dim: num(l.dimming), on: l.ls === undefined ? undefined : Number(l.ls) === 1 })) });
    } else if (key === 'lampControl/unicastStatus') {
      out.push({ kind: 'unicast', lcuId, text: JSON.stringify(it).slice(0, 200) });
    } else if (key === 'lampControl/data' && Array.isArray(it.lcuData)) {
      out.push({ kind: 'data', lcuId, data: it.lcuData.filter(isRec).map(d => ({ num: Number(d.num), power: num(d.power), voltage: num(d.voltage), current: num(d.current), pf: num(d.powerFactor), lux: num(d.lux), fault: num(d.fault), energy: num(d.energy), time: d.dtime == null ? undefined : String(d.dtime) })) });
    }
  }
  return out;
}

/** Các dạng khung đăng nhập WebSocket (docs 08 §4 và 11 §2 khác nhau): thử lần lượt tới khi hết 401. */
export function loginVariants(token: string, user: string): Rec[] {
  return [
    { cmd: 'session', ctrl: 'login', Authorization: token },
    { cmd: 'session', Authorization: token },
    { cmd: 'session', ctrl: 'login', data: { Authorization: token } },
    { cmd: 'session', ctrl: 'login', Authorization: token.replace(/^Bearer\s+/i, '') },
    { cmd: 'session', ctrl: 'login', Authorization: token, clientType: 'app', userAccount: user },
    { cmd: 'session', ctrl: 'login', authorization: token },
  ];
}

export type SessionReply = 'logged-in' | 'unauthorized' | 'other';
/** Phân loại phản hồi cho khung đăng nhập. */
export function sessionReply(m: unknown): SessionReply {
  if (!isRec(m)) return 'other';
  const inner = isRec(m.data) && m.data.cmd ? m.data : {};
  if (m.code === 200 && inner.cmd === 'session' && inner.ctrl === 'login') return 'logged-in';
  if (m.code === 401) return 'unauthorized';
  return 'other';
}
