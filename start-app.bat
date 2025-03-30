@echo off
echo Starting VBC Web Application...
echo Starting MongoDB server...
start powershell -NoExit -Command ".\start-server.ps1"
echo Starting React development server...
timeout /t 5
cd apps/website
start cmd /k npm run dev
cd ..\..
echo.
echo VBC Web Application is running!
echo - API Server:   http://localhost:3000
echo - Website:      http://localhost:5173
echo - Admin Panel:  http://localhost:5173/admin
