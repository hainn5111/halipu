import L from 'leaflet';
import { tileOptions } from './tileOptions';

export const tileLayer = () => { const o = tileOptions(); return L.tileLayer(o.url, { maxZoom: 19, attribution: o.attribution, subdomains: o.subdomains, keepBuffer: 4, updateWhenIdle: false }); };
