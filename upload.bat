@echo off
echo ================================
echo   Uploading changes to GitHub
echo ================================

cd /d "c:\Users\Hp\Pictures\Screenshots\session-keeper"

echo.
echo [1/3] Staging all changes...
git add .

echo.
echo [2/3] Committing changes...
git commit -m "Update session-keeper: latest changes"

echo.
echo [3/3] Pushing to GitHub...
git push origin main

echo.
echo ================================
echo   Done! Changes uploaded.
echo ================================
pause
