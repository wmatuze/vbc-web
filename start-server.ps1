# PowerShell script to start the VBC web server

Write-Host "Starting VBC Web Server..." -ForegroundColor Cyan

# Check if we're in the correct directory
if (-not (Test-Path "server.js") -and (Test-Path "../server.js")) {
    Write-Host "Changing to parent directory where server.js is located..." -ForegroundColor Yellow
    Set-Location ..
}

if (-not (Test-Path "server.js")) {
    Write-Host "Error: Cannot find server.js in current or parent directory" -ForegroundColor Red
    Write-Host "Please run this script from the project directory or a subdirectory" -ForegroundColor Red
    exit 1
}

# Ensure uploads directory exists
$uploadsDir = "uploads"
if (-not (Test-Path $uploadsDir)) {
    Write-Host "Creating uploads directory..." -ForegroundColor Yellow
    New-Item -Path $uploadsDir -ItemType Directory | Out-Null
}

# Ensure assets directories exist
$assetDirs = @("assets", "assets/events", "assets/sermons", "assets/leadership", "assets/media")
foreach ($dir in $assetDirs) {
    if (-not (Test-Path $dir)) {
        Write-Host "Creating $dir directory..." -ForegroundColor Yellow
        New-Item -Path $dir -ItemType Directory | Out-Null
    }
}

# Start the server
Write-Host "Running 'node server.js'..." -ForegroundColor Green
node server.js 