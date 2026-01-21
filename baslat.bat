@echo off
title TurkGenci Dev. Launcher
cls

echo ====================================
echo TurkGenci Dev. Discord Bot Launcher
echo ====================================
echo.

echo 5 saniye sonra baslayacak...
for /L %%i in (5,-1,1) do (
    echo %%i...
    timeout /t 1 >nul
)

echo.
echo Moduller yukleniyor...
call npm install || goto hata


echo.
echo Kurulum tamamlandi.
set /p onay="Botu baslatmak istiyor musun? (E/H): "

if /I "%onay%"=="E" (
    call npm start
)

echo.
echo Islem bitti.
pause
exit /b

:hata
echo.
echo Bir hata olustu. Islem durduruldu.
pause
exit /b
