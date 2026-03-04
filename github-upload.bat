@echo off
echo ========================================
echo GitHub Upload Script
echo UP Exam Mantra
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

REM Get GitHub username
set /p GITHUB_USERNAME="Enter your GitHub username: "
echo.

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
git remote add origin https://github.com/%GITHUB_USERNAME%/up-exam-mantra.git
echo.

REM Push to GitHub
echo Pushing to GitHub...
git branch -M main
git push -u origin main

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo SUCCESS! Code uploaded to GitHub
    echo ========================================
    echo.
    echo Your repository: https://github.com/%GITHUB_USERNAME%/up-exam-mantra
    echo.
) else (
    echo.
    echo ========================================
    echo Upload failed!
    echo ========================================
    echo.
    echo Possible reasons:
    echo 1. Repository doesn't exist on GitHub
    echo 2. Wrong username
    echo 3. Need to create Personal Access Token
    echo.
    echo Please check GITHUB_SETUP.md for detailed instructions
    echo.
)

pause
