import { config } from './config';

// Nguồn ô bản đồ dùng chung (tab GIS và ô chọn vị trí). Mặc định OpenStreetMap (không cần key; CARTO đã yêu cầu API key); đổi bằng mapTileUrl/mapAttribution/mapSubdomains trong config.json. (Hàm thuần, không kéo Leaflet.)
export const DEFAULT_TILES = { url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', attribution: '© OpenStreetMap', subdomains: 'abc' };

export function tileOptions(c = config()) {
  return { url: c.mapTileUrl || DEFAULT_TILES.url, attribution: c.mapAttribution || (c.mapTileUrl ? '' : DEFAULT_TILES.attribution), subdomains: c.mapSubdomains || DEFAULT_TILES.subdomains };
}
