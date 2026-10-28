@echo off
echo Pushing Shram Stambh to https://github.com/manishpathak2407-bot/shramstambh ...
git push -u origin main
if %ERRORLEVEL% EQU 0 (
    echo.
    echo ===================================================
    echo Successfully uploaded to GitHub!
    echo URL: https://github.com/manishpathak2407-bot/shramstambh
    echo ===================================================
) else (
    echo.
    echo Please make sure you created the empty repository 'shramstambh' on GitHub.
)
pause
