@echo off
REM Windows Development Optimization Script
REM This script helps optimize Next.js development on Windows

echo Starting Windows development optimization...

REM Clear Next.js cache
echo Clearing Next.js cache...
if exist ".next" (
    rmdir /s /q ".next"
    echo .next folder cleared
)

REM Clear npm cache
echo Clearing npm cache...
npm cache clean --force

REM Clear node_modules cache
if exist "node_modules\.cache" (
    rmdir /s /q "node_modules\.cache"
    echo node_modules cache cleared
)

echo.
echo Optimization complete!
echo.
echo RECOMMENDATIONS:
echo 1. Add your project folder to Windows Defender exclusions:
echo    - Open Windows Security
echo    - Go to Virus & threat protection
echo    - Add an exclusion for this folder: %CD%
echo.
echo 2. If using WSL, consider moving the project to the WSL filesystem
echo 3. Ensure your project is on a local drive (not network drive)
echo.
echo Starting development server...
npm run dev
