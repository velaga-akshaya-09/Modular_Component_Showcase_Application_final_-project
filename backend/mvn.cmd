@echo off
pushd "%~dp0coreservices"
call "%~dp0coreservices\mvnw.cmd" %*
set EXIT_CODE=%ERRORLEVEL%
popd
exit /b %EXIT_CODE%
