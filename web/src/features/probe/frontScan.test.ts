import { describe, expect, it } from 'vitest';
import { formScanScript, frontScanScript, scanForms, scanFrontend } from './frontScan';

describe('scanFrontend', () => {
  it('đếm từ khoá trong file JS của trang và lấy đoạn quanh nó', async () => {
    const files: Record<string, string> = { 'http://f/a.js': 'var o=[{value:"1",label:"XY"},{value:"2",label:"KXHL"}];kmFactory', 'http://f/b.json': '{"x":1}' };
    const clicks: string[] = [];
    const doc = { scripts: [{ src: 'http://f/a.js' }], createElement: () => ({ click() { clicks.push('dl'); }, set href(_v: string) { /* */ }, set download(v: string) { clicks.push(v); } }) };
    const g: any = globalThis; g.URL.createObjectURL = () => 'blob:x'; g.URL.revokeObjectURL = () => undefined;
    const win = { document: doc, location: { origin: 'http://f' }, console: { log() { /* */ } }, performance: { getEntriesByType: () => [{ name: 'http://f/b.json' }, { name: 'http://other/c.js' }] },
      fetch: async (u: string) => ({ text: async () => files[u] ?? '' }) };
    const out = await scanFrontend(win);
    expect(out.keys.KXHL.total).toBe(1); expect(out.keys.KXHL.samples[0]).toContain('XY'); expect(out.keys.kmFactory.total).toBe(1); expect(out.keys.powerProtocol.total).toBe(0);
    expect(out.files.map((f: { url: string }) => f.url).sort()).toEqual(['http://f/a.js', 'http://f/b.json']);   // file ngoài origin bị bỏ qua
    expect(clicks.some(c => c.startsWith('fonda-frontend-scan-'))).toBe(true);
  });
  it('script tự chứa, không tham chiếu biến ngoài', () => { expect(frontScanScript()).toMatch(/^\(.*scanFrontend|^\(function|^\(.*=>/s); expect(frontScanScript().endsWith('(window);')).toBe(true); });
  it('scanForms: lấy rules, dataForm, ô nhập theo loại và hàm save', async () => {
    const js = 'x={data:function(){return{rules:{"deviceConfig.gatewayTypes":[{required:!0,message:"G"}],deviceTypeId:[{required:!0}]},dataForm:{protocolId:"",protocolValue:-1,useTag:null,deviceTypeValue:null,deviceConfig:{a:1}}}},'
      + 'render:[3===e.dataForm.deviceTypeValue?a("el-form-item",{attrs:{label:e.$t("x.gw"),prop:"deviceConfig.gatewayTypes"}},[a("el-select",{model:{value:e.dataForm.deviceConfig.gatewayTypes,expression:"dataForm.deviceConfig.gatewayTypes"}})]):e._e()],save:function(e){return 1}}';
    const win: any = { document: { scripts: [{ src: 'http://f/a.js' }], createElement: () => ({ click() { /* */ }, set href(_v: string) { /* */ }, set download(_v: string) { /* */ } }) },
      location: { origin: 'http://f' }, console: { log() { /* */ } }, performance: { getEntriesByType: () => [] }, fetch: async () => ({ text: async () => js }) };
    const out = await scanForms(win);
    expect(out.forms).toHaveLength(1);
    expect(out.forms[0].rules).toContain('deviceConfig.gatewayTypes'); expect(out.forms[0].dataForm).toContain('protocolValue:-1');
    expect(Object.keys(out.forms[0].fields)).toEqual(['dataForm.deviceConfig.gatewayTypes']); expect(out.forms[0].fields['dataForm.deviceConfig.gatewayTypes'].before).toContain('3===e.dataForm.deviceTypeValue');
    expect(out.forms[0].typeConditions).toEqual(['3===e.dataForm.deviceTypeValue']); expect(out.forms[0].save).toContain('save:function');
    expect(formScanScript().endsWith('(window);')).toBe(true);
  });
});
