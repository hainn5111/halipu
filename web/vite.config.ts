import { execSync } from 'node:child_process';
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// Nhãn bản build hiện ở đầu trang. CI/preview-commit-local.bat đặt sẵn VITE_BUILD_INFO (nhánh@sha);
// còn lại (npm run dev, build tay) thì lấy từ git: "dev nhánh@sha" (thêm * nếu có thay đổi chưa commit). Không có git → "dev".
function buildInfo(): string {
  if (process.env.VITE_BUILD_INFO) return process.env.VITE_BUILD_INFO;
  try {
    const git = (a: string) => execSync(`git ${a}`, { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim();
    const sha = git('rev-parse --short=7 HEAD');
    const branch = git('rev-parse --abbrev-ref HEAD');
    const dirty = git('status --porcelain') ? '*' : '';
    return `dev ${branch === 'HEAD' ? 'detached' : branch}@${sha}${dirty}`;
  } catch {
    return 'dev';
  }
}

// base './' + HashRouter: bản build chạy được ở bất kỳ đường dẫn/host nào (GitHub Pages thư mục con, Nginx, S3…) mà không cần rewrite.
export default defineConfig({
  base: './',
  plugins: [react()],
  define: { 'import.meta.env.VITE_BUILD_INFO': JSON.stringify(buildInfo()) },
  build: { chunkSizeWarningLimit: 900 },
  test: { environment: 'node', include: ['src/**/*.test.ts'] },
});
