@echo off
echo ========================================
echo Restaurant QR Menu System - Setup
echo ========================================
echo.

echo [1/4] Installing dependencies...
call npm install
if %errorlevel% neq 0 (
    echo Error: Failed to install dependencies
    pause
    exit /b 1
)
echo.

echo [2/4] Creating .env file...
if not exist .env (
    copy .env.example .env
    echo .env file created. Please edit it with your configuration.
) else (
    echo .env file already exists.
)
echo.

echo [3/4] Seeding database...
echo Make sure MongoDB is running before proceeding!
pause
call node server/seed.js
if %errorlevel% neq 0 (
    echo Warning: Database seeding failed. You may need to configure MongoDB first.
)
echo.

echo [4/4] Setup complete!
echo.
echo ========================================
echo Next Steps:
echo ========================================
echo 1. Edit .env file with your configuration
echo 2. Start backend: npm run server
echo 3. Start frontend: npm run dev
echo 4. Open http://localhost:3000
echo.
echo Default login credentials:
echo Admin: admin@restaurant.com / admin123
echo Staff: staff@restaurant.com / staff123
echo ========================================
echo.
pause
