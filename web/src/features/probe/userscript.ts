// Bản Tampermonkey (.user.js) của các script dán-Console: chạy ở document-start trên trang Fonda nên móc XHR/fetch/WebSocket TRƯỚC khi trang mở kết nối
// (khỏi phải dán lại sau mỗi lần F5). Sinh từ CÙNG mã với bản dán Console → luôn đồng bộ với bản web này. Cần cài lại khi web đổi (xem ghi chú trong tab).
import { installCapture } from './captureSnippet';
import { scanForms, scanFrontend } from './frontScan';

export const DEFAULT_MATCH = 'http://159.138.45.45:81/*';

export function userScript(version: string, match = DEFAULT_MATCH): string {
  return `// ==UserScript==
// @name         SLCP – công cụ bắt/quét Fonda
// @namespace    slcp
// @version      ${version}
// @description  Bắt request (gồm WebSocket) + quét front-end/form template của Fonda gốc. Chỉ đọc; che token/mật khẩu.
// @match        ${match}
// @run-at       document-start
// @grant        none
// ==/UserScript==
(function () {
  'use strict';
  var installCapture = ${installCapture.toString()};
  var scanFrontend = ${scanFrontend.toString()};
  var scanForms = ${scanForms.toString()};
  installCapture(window);                                  // nút cam/xanh ở góc trái dưới; log nằm trong window.__capture
  window.__scanFrontend = function () { return scanFrontend(window); };   // gõ trong Console: __scanFrontend()  → tải fonda-frontend-scan-….json
  window.__scanForms = function () { return scanForms(window); };         // gõ trong Console: __scanForms()     → tải fonda-form-scan-….json
  console.log('[SLCP] đã nạp công cụ: __capture, __scanFrontend(), __scanForms()');
})();
`;
}
