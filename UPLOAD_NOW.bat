@echo off
cls
echo ========================================
echo GitHub Upload - UP EXAM MANTRA
echo ========================================
echo.
echo Username: rajvendrasingh
echo Repository: Up Exam Mantra
echo URL: https://github.com/rajvendrasingh/Up-Exam-Mantra
echo.
echo ========================================
echo.

REM Check Git
where git >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Git not installed!
    echo Install from: https://git-scm.com/downloads
    pause
    exit /b 1
)

echo [1/6] Initializing Git...
if not exist .git (
    git init
)
echo Done!
echo.

echo [2/6] Adding all files...
git add .
echo Done!
echo.

echo [3/6] Creating commit...
git commit -m "Initial commit: UP Exam Mantra complete project"
echo Done!
echo.

echo [4/6] Adding remote repository...
git remote remove origin 2>nul
git remote add origin https://github.com/rajvendrasingh/Up-Exam-Mantra.git
echo Done!
echo.

echo [5/6] Setting main branch...
git branch -M main
echo Done!
echo.

echo [6/6] Pushing to GitHub...
echo.
echo If asked for credentials:
echo   Username: rajvendrasingh
echo   Password: [Use Personal Access Token]
echo.
git push -u origin main

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo SUCCESS! ✅
    echo ========================================
    echo.
    echo Your code is now on GitHub!
    echo Visit: https://github.com/rajvendrasingh/Up-Exam-Mantra
    echo.
) else (
    echo.
    echo ========================================
    echo FAILED! ❌
    echo ========================================
    echo.
    echo Need Personal Access Token?
    echo 1. Go to: https://github.com/settings/tokens
    echo 2. Click "Generate new token (classic)"
    echo 3. Select "repo" checkbox
    echo 4. Generate and copy token
    echo 5. Use token as password when pushing
    echo.
)

pause
