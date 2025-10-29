@echo off
echo ========================================
echo Starting Restaurant System
echo ========================================
echo.
echo Starting Backend Server...
start "Backend Server" cmd /k "cd /d %~dp0 && npm run server"
timeout /t 3 /nobreak >nul
echo.
echo Starting Frontend Server...
start "Frontend Server" cmd /k "cd /d %~dp0 && npm run dev"
echo.
echo ========================================
echo Both servers are starting...
echo Backend: http://localhost:5000
echo Frontend: http://localhost:5173
echo ========================================
echo.
echo Press any key to exit this window (servers will keep running)
pause >nul
