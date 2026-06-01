@echo off
setlocal

set "MVN_HOME=%~dp0.maven\apache-maven-3.9.6"

if exist "%MVN_HOME%\bin\mvn.cmd" (
    call "%MVN_HOME%\bin\mvn.cmd" %*
    exit /b %ERRORLEVEL%
)

where mvn >nul 2>nul
if %ERRORLEVEL%==0 (
    mvn %*
    exit /b %ERRORLEVEL%
)

echo Maven is not available. Expected bundled Maven at "%MVN_HOME%\bin\mvn.cmd".
exit /b 1