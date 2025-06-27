@echo off
echo Starting Note App...

echo Starting server...
start "Server" cmd /k "cd /d d:\deepa\supa\note-app\server && npm start"

echo Waiting for server to start...
timeout /t 3 /nobreak > nul

echo Starting client...
cd /d "d:\deepa\supa\note-app\client"
npm start

pause
