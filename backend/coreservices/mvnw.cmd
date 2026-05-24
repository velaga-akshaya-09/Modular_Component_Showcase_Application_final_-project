@echo off
setlocal
set MAVEN_VERSION=3.9.9
set PROJECT_DIR=%~dp0
set MAVEN_HOME=%PROJECT_DIR%.mvn\apache-maven-%MAVEN_VERSION%
set MAVEN_URL=https://repo.maven.apache.org/maven2/org/apache/maven/apache-maven/%MAVEN_VERSION%/apache-maven-%MAVEN_VERSION%-bin.zip

if not exist "%MAVEN_HOME%\bin\mvn.cmd" (
  echo Local Maven not found. Installing Maven %MAVEN_VERSION% into .mvn...
  powershell -NoProfile -ExecutionPolicy Bypass -Command "$ErrorActionPreference='Stop'; $ProgressPreference='SilentlyContinue'; New-Item -ItemType Directory -Force -Path '%PROJECT_DIR%.mvn' | Out-Null; $zip = Join-Path $env:TEMP ('apache-maven-%MAVEN_VERSION%-' + [guid]::NewGuid() + '.zip'); Invoke-WebRequest -Uri '%MAVEN_URL%' -OutFile $zip -UseBasicParsing; Expand-Archive -Force $zip '%PROJECT_DIR%.mvn'; Remove-Item -Force $zip"
  if errorlevel 1 (
    echo Failed to install local Maven.
    exit /b 1
  )
)

set MAVEN_OPTS=-Dmaven.resolver.transport=wagon -Dmaven.wagon.http.ssl.insecure=true -Dmaven.wagon.http.ssl.allowall=true -Dmaven.wagon.http.ssl.ignore.validity.dates=true %MAVEN_OPTS%
call "%MAVEN_HOME%\bin\mvn.cmd" %*
set EXIT_CODE=%ERRORLEVEL%
endlocal
exit /b %EXIT_CODE%