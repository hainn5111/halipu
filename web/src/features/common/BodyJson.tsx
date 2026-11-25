import { useEffect, useMemo, useState } from 'react';

// Sửa tay JSON body trước khi gửi — để thử vượt các kiểm tra/khoá của giao diện (xem server có nhận không).
type Rec = Record<string, unknown>;
export function useBodyJson(built: Rec | null) {
  const [text, setText] = useState(''), [dirty, setDirty] = useState(false);
  const key = built ? JSON.stringify(built) : '';
  useEffect(() => { if (!dirty) setText(built ? JSON.stringify(built, null, 2) : ''); }, [key, dirty]);   // eslint-disable-line react-hooks/exhaustive-deps
  const parsed = useMemo<Rec | null>(() => { if (!text.trim()) return null; try { const v = JSON.parse(text); return v && typeof v === 'object' && !Array.isArray(v) ? (v as Rec) : null; } catch { return null; } }, [text]);
  return { text, edit: (t: string) => { setText(t); setDirty(true); }, dirty, reset: () => setDirty(false), parsed };
}
export type BodyJson = ReturnType<typeof useBodyJson>;

/** Body thực sự sẽ gửi: JSON đã sửa tay (nếu có) hoặc body dựng từ form. */
export const finalBody = (bj: BodyJson, built: Rec | null): Rec | null => (bj.dirty ? bj.parsed : built);
/** Cho phép gửi: bình thường cần form hợp lệ; khi tick "bỏ qua kiểm tra" chỉ cần JSON hợp lệ. */
export const canSend = (bj: BodyJson, built: Rec | null, formOk: boolean, skip: boolean): boolean => (skip ? !!(bj.dirty ? bj.parsed : bj.parsed ?? built) : formOk && !!finalBody(bj, built));

export function BodyJsonBox({ bj, skip, setSkip }: { bj: BodyJson; skip: boolean; setSkip: (v: boolean) => void }) {
  return (<>
    <details style={{ marginTop: 10 }}><summary className="sub" style={{ cursor: 'pointer' }}>Body JSON (sửa tay nếu cần){bj.dirty ? ' — đã sửa tay' : ''}</summary>
      <textarea value={bj.text} onChange={e => bj.edit(e.target.value)} style={{ width: '100%', height: 220, fontFamily: 'monospace', fontSize: 12 }} />
      {bj.text.trim() && !bj.parsed && <div className="err">JSON không hợp lệ (phải là một object)</div>}
      {bj.dirty && <button className="b" style={{ marginTop: 6 }} onClick={bj.reset}>Đặt lại theo form</button>}
    </details>
    <label className="sub" style={{ display: 'block', marginTop: 8 }}><input type="checkbox" checked={skip} onChange={e => setSkip(e.target.checked)} /> Bỏ qua kiểm tra của form — gửi nguyên JSON (để thử vượt các ràng buộc)</label>
  </>);
}
