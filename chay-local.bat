@echo off
chcp 65001 >nul
rem Build + chay thu ban web o localhost. Dung cho SourceTree Custom Action (Parameters: $REPO) hoac bam dup.
rem Khong dung tham so (duong dan co dau cach se bi tach). Tu dinh vi theo vi tri file nay.
cd /d "%~dp0web" 2>nul || (echo Khong tim thay thu muc web & pause & exit /b 1)
where npm >nul 2>nul || (echo Chua cai Node.js 18+ hoac npm khong nam trong PATH & pause & exit /b 1)
if not exist node_modules (call npm ci || (pause & exit /b 1))
call npm run build || (pause & exit /b 1)
start "" http://localhost:8080
echo Dang chay tai http://localhost:8080 - dong cua so nay de dung.
call npm run preview
pause
