@echo off
chcp 65001 > nul
echo ========================================================
echo   🌐 Context Native Translator (100円 어플) 실행 중...
echo ========================================================
echo.
python app.py
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [안내] Python 환경이 없거나 패키지가 없는 경우
    echo index.html 파일을 더블 클릭하시면 브라우저에서 바로 사용하실 수 있습니다!
    pause
)
