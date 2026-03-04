@echo off
echo ========================================
echo GitHub Upload Script
echo UP Exam Mantra
echo Username: rajvendrasingh
echo ========================================
echo.

REM Check if git is installed
where git >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Git is not installed!
    echo Please install Git from: https://git-scm.com/downloads
    pause
    exit /b 1
)

echo Git found!
echo.

echo IMPORTANT: Before running this script:
echo 1. Create repository on GitHub: https://github.com/new
echo 2. Repository name: up-exam-mantra
echo 3. DON'T initialize with README
echo.
pause

REM Initialize git if not already
if not exist .git (
    echo Initializing Git repository...
    git init
    echo.
)

REM Add all files
echo Adding all files...
git add .
echo.

REM Commit
echo Creating commit...
git commit -m "Initial commit: UP Exam Mantra complete project"
echo.

REM Add remote
echo Adding GitHub remote...
git remote remove origin 2>nul
git remote add origin https://github.com/rajvendrasingh/up-exam-mantra.git
echo.

REM Push to GitHub
echo Pushing to GitHub...
echo.
echo If asked for credentials:
echo Username: rajvendrasingh
echo Password: [Use Personal Access Token]
echo.
git branch -M main
git push -u origin main

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo SUCCESS! Code uploaded to GitHub
    echo ========================================
    echo.
    echo Your repository: https://github.com/rajvendrasingh/up-exam-mantra
    echo.
    echo Next steps:
    echo 1. Visit the URL above to see your code
    echo 2. To deploy: Run deploy.bat
    echo.
) else (
    echo.
    echo ========================================
    echo Upload failed!
    echo ========================================
    echo.
    echo Possible reasons:
    echo 1. Repository doesn't exist on GitHub
    echo 2. Need to create Personal Access Token
    echo.
    echo To create token:
    echo 1. Go to: https://github.com/settings/tokens
    echo 2. Generate new token (classic)
    echo 3. Select 'repo' scope
    echo 4. Use token as password
    echo.
)

pause
