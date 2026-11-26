import { config } from './config';

// Nguồn ô bản đồ dùng chung (tab GIS và ô chọn vị trí). Mặc định CARTO Voyager (CDN nhanh); đổi bằng mapTileUrl/mapAttribution/mapSubdomains trong config.json. (Hàm thuần, không kéo Leaflet.)
export const DEFAULT_TILES = { url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', attribution: '© OpenStreetMap © CARTO', subdomains: 'abcd' };

export function tileOptions(c = config()) {
  return { url: c.mapTileUrl || DEFAULT_TILES.url, attribution: c.mapAttribution || (c.mapTileUrl ? '' : DEFAULT_TILES.attribution), subdomains: c.mapSubdomains || DEFAULT_TILES.subdomains };
}
