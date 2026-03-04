@echo off
echo ========================================
echo UP Exam Mantra - Deployment Script
echo ========================================
echo.

REM Check if Firebase CLI is installed
where firebase >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Firebase CLI not found!
    echo Installing Firebase CLI...
    call npm install -g firebase-tools
)

echo Firebase CLI found
echo.

REM Build the app
echo Building the app...
call npm run build

if %ERRORLEVEL% EQU 0 (
    echo Build successful!
    echo.
    
    REM Deploy to Firebase
    echo Deploying to Firebase Hosting...
    call firebase deploy --only hosting
    
    if %ERRORLEVEL% EQU 0 (
        echo.
        echo ========================================
        echo Deployment successful!
        echo ========================================
        echo.
        echo Your site is live at:
        echo   - https://up-exam-mantra.web.app
        echo   - https://upexammantra.com (after DNS setup)
        echo.
        echo Read DEPLOY_NOW.md for custom domain setup
        echo.
    ) else (
        echo Deployment failed!
        pause
        exit /b 1
    )
) else (
    echo Build failed!
    pause
    exit /b 1
)

pause
