# PowerShell script to start both server and client
param(
    [switch]$Fresh  # Use -Fresh to clear authentication and start fresh
)

Write-Host "Starting Note App..." -ForegroundColor Green

if ($Fresh) {
    Write-Host "Clearing authentication state for fresh start..." -ForegroundColor Cyan
    
    # Open the clear-auth page to automatically clear localStorage
    Write-Host "Opening authentication clear page..." -ForegroundColor Yellow
    Start-Process "clear-auth.html"
    
    Write-Host "Click 'Clear Authentication & Go to Login' on the page that opens" -ForegroundColor Green
    Write-Host "This will clear your login state and show the login page" -ForegroundColor Green
}

# Start server in background
Write-Host "Starting server..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location 'd:\deepa\supa\note-app\server'; npm start"

# Wait a moment for server to start
Start-Sleep -Seconds 3

# Start client
Write-Host "Starting client..." -ForegroundColor Yellow
Set-Location "d:\deepa\supa\note-app\client"
npm start

if ($Fresh) {
    Write-Host "Tip: Open browser dev tools and run: localStorage.clear(); window.location.reload();" -ForegroundColor Cyan
}
