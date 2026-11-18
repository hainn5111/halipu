import { useEffect } from 'react';
import { useLcus } from '../../core/store';
import LcuPanel from '../lcu-panel/LcuPanel';

export default function Lcus() {
  const { lcus, status, progress, error, selectedUid, load, select } = useLcus();
  useEffect(() => { void load(true); }, [load]);   // mở tab = tải lại danh sách
  const sel = lcus.find(l => l.uid === selectedUid);
  return (
    <div className="lcus">
      <div className="listwrap">
        <p id="s" className="sub">{status === 'loading' ? progress || 'Đang tải…' : status === 'error' ? '' : `${lcus.length} LCU`}</p>
        {status === 'error' && <div className="err">{error}</div>}
        <table><thead><tr><th>#</th><th>UID (luid)</th><th>Tên</th><th>Mã</th><th>lcuId</th><th>Dự án</th><th>Toạ độ</th></tr></thead>
          <tbody>{lcus.map((l, i) => (
            <tr key={l.uid} className={'lrow' + (l.uid === selectedUid ? ' sel' : '')} onClick={() => select(l.uid)}>
              <td>{i + 1}</td><td><b>{l.uid}</b></td><td>{l.name}</td><td>{l.code}</td><td>{l.lcuId}</td><td>{l.projectId.slice(0, 8)}</td>
              <td>{l.lat !== undefined ? `${l.lat.toFixed(5)}, ${l.lng!.toFixed(5)}` : '–'}</td></tr>))}</tbody></table>
      </div>
      {sel && <LcuPanel lcu={sel} onClose={() => select(null)} />}
    </div>
  );
}
