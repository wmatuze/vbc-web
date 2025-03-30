 Write-Host "Starting VBC Web Application..." -ForegroundColor Cyan

# Start MongoDB server
Write-Host "Starting MongoDB server..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", ".\start-server.ps1" -WindowStyle Normal
