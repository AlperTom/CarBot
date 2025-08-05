@echo off
echo Starting Directus CMS...
cd /d "C:\Users\Alper\OneDrive\Desktop\Projects\CarBot"

echo Pulling Directus image...
docker pull directus/directus:latest

echo Starting Directus container...
docker-compose up -d

echo.
echo ========================================
echo Directus CMS is starting up!
echo.
echo Admin URL: http://localhost:8055
echo Email: alper.tombulca@web.de
echo Password: CarBot2024!
echo.
echo Wait 30-60 seconds for full startup...
echo ========================================

pause