@echo off
chcp 65001 >nul
rem Che do dev: sua code luu file la trang tu cap nhat (HMR). Dung thang thu muc web\ (gom ca thay doi chua commit).
rem Bam dup de chay; dong cua so de dung. De xem mot COMMIT cu the, dung preview-commit-local.bat.
cd /d "%~dp0web" || (echo Khong vao duoc thu muc web & pause & exit /b 1)
where npm >nul 2>nul || (echo Chua cai Node.js 18+ hoac npm khong nam trong PATH & pause & exit /b 1)
if not exist node_modules (call npm ci || (pause & exit /b 1))
echo Dang chay che do dev (cong in ra ben duoi). Dong cua so nay de dung.
call npm run dev -- --open
pause
