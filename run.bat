@echo off
title Banasthali Mart v3.0
chcp 437 > nul
cls
if not exist BanasthaliMart.exe (
    echo Compiling Banasthali Mart (main.cpp)...
    g++ -O2 main.cpp -o BanasthaliMart.exe
    if %ERRORLEVEL% neq 0 (
        echo.
        echo [ERROR] Build failed!
        pause
        exit /b %ERRORLEVEL%
    )
)

cls
BanasthaliMart.exe
echo.
echo ========================================================
echo   Banasthali Mart has closed. Press any key to exit.
echo ========================================================
pause > nul
