@echo off
chcp 65001 >nul
setlocal EnableDelayedExpansion
rem Build + chay thu ban web o localhost cho MOT COMMIT, khong dong vao thu muc lam viec hien tai.
rem SourceTree: chuot phai commit -> Custom Actions -> Parameters: $SHA   (de trong/bam dup = commit HEAD)
rem Ban build dong dau "nhanh@sha" (hien o chan trang). Moi commit duoc build o .local-build\<sha7> (git worktree).

cd /d "%~dp0" || (echo Khong vao duoc thu muc repo & pause & exit /b 1)
where git >nul 2>nul || (echo Chua cai git hoac git khong nam trong PATH & pause & exit /b 1)
where npm >nul 2>nul || (echo Chua cai Node.js 18+ hoac npm khong nam trong PATH & pause & exit /b 1)

set "REF=%~1"
if "%REF%"=="" set "REF=HEAD"
set "FULL="
for /f "delims=" %%i in ('git rev-parse --verify "%REF%^{commit}" 2^>nul') do set "FULL=%%i"
if not defined FULL (echo Khong tim thay commit "%REF%" & pause & exit /b 1)
set "SHA=!FULL:~0,7!"

set "NAME=detached"
for /f "delims=" %%i in ('git name-rev --name-only "!FULL!" 2^>nul') do set "NAME=%%i"
set "NAME=!NAME:remotes/origin/=!"
set "NAME=!NAME:remotes/=!"
set "NAME=!NAME:tags/=!"
set "NAME=!NAME:/=-!"
set "INFO=!NAME!@!SHA!"

set "WT=%~dp0.local-build\!SHA!"
git worktree prune
if not exist "!WT!\web" (
  echo Tao ban lam viec cho commit !SHA! ...
  git worktree add --detach "!WT!" "!FULL!" || (pause & exit /b 1)
)
if not exist "!WT!\web" (echo Commit !SHA! khong co thu muc web & pause & exit /b 1)

cd /d "!WT!\web" || (pause & exit /b 1)
if not exist node_modules (call npm ci || (pause & exit /b 1))
set "VITE_BUILD_INFO=!INFO!"
echo Build !INFO! ...
call npm run build || (pause & exit /b 1)
echo Dang chay ban !INFO! - dong cua so nay de dung (cong in ra ben duoi).
call npm run preview -- --open
pause
