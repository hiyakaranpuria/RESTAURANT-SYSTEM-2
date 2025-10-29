@echo off
echo ========================================
echo Restarting Restaurant System Servers
echo ========================================
echo.
echo Stopping any existing Node processes...
taskkill /F /IM node.exe 2>nul
timeout /t 2 /nobreak >nul
echo.
echo Starting Backend Server...
start "Backend Server" cmd /k "cd /d %~dp0 && npm run server"
timeout /t 3 /nobreak >nul
echo.
echo Starting Frontend Server...
start "Frontend Server" cmd /k "cd /d %~dp0 && npm run dev"
echo.
echo ========================================
echo Both servers are restarting...
echo Backend: http://localhost:5000
echo Frontend: http://localhost:5173
echo ========================================
echo.
echo Press any key to exit this window
pause >nul
