import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// base './' + HashRouter: bản build chạy được ở bất kỳ đường dẫn/host nào (GitHub Pages thư mục con, Nginx, S3…) mà không cần rewrite.
export default defineConfig({
  base: './',
  plugins: [react()],
  build: { chunkSizeWarningLimit: 900 },
  test: { environment: 'node', include: ['src/**/*.test.ts'] },
});
