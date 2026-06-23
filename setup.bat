@echo off
setlocal

echo ========================================
echo   AutoSkor - Setup
echo ========================================
echo.

where node >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js belum terinstall.
    echo Download: https://nodejs.org  ^(pilih versi LTS^)
    echo Setelah install, restart terminal lalu jalankan script ini lagi.
    exit /b 1
)

echo Node.js: 
node -v
echo npm:
npm -v
echo.

echo [1/3] Installing dependencies...
call npm install
if errorlevel 1 (
    echo [ERROR] npm install gagal.
    exit /b 1
)

echo.
echo [2/3] Checking .env file...
if not exist .env (
    copy .env.example .env >nul
    echo File .env dibuat dari .env.example ^(mode middleware nyata^).
) else (
    echo File .env sudah ada, dilewati.
)

echo.
echo [3/3] Setup selesai!
echo.
echo Jalankan aplikasi:
echo   npm run dev
echo.
echo Buka browser: http://localhost:5173
echo Login admin: admin@koperasi.id / admin123
echo.
echo Mode default: middleware nyata. Ubah .env ke mock jika server tidak terjangkau.
echo.
pause