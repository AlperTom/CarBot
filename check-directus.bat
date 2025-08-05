@echo off
echo Checking Directus status...
echo.

curl -s http://localhost:8055 > nul
if %errorlevel% equ 0 (
    echo ✅ Directus is running at http://localhost:8055
    echo.
    echo Login credentials:
    echo Email: alper.tombulca@web.de
    echo Password: CarBot2024!
    echo.
    echo Opening Directus in browser...
    start http://localhost:8055
) else (
    echo ❌ Directus is not yet ready. Please wait 30 more seconds and try again.
    echo.
    echo Current Docker status:
    docker-compose ps
)

pause