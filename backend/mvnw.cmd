@REM ----------------------------------------------------------------------------
@REM Maven Wrapper startup batch script
@REM ----------------------------------------------------------------------------
@IF "%__MVNW_ARG0_NAME__%"=="" (SET __MVNW_ARG0_NAME__=%~nx0)
@SET @@FAIL_FAST=
@SET MAVEN_WRAPPER_JAR="%~dp0.mvn\wrapper\maven-wrapper.jar"
@SET MAVEN_WRAPPER_PROPERTIES="%~dp0.mvn\wrapper\maven-wrapper.properties"
@SET DOWNLOAD_URL="https://repo.maven.apache.org/maven2/org/apache/maven/wrapper/maven-wrapper/3.2.0/maven-wrapper-3.2.0.jar"

@FOR /F "usebackq tokens=1,2 delims==" %%A IN ("%MAVEN_WRAPPER_PROPERTIES%") DO (
    @IF "%%A"=="wrapperUrl" SET DOWNLOAD_URL=%%B
)

@IF EXIST %MAVEN_WRAPPER_JAR% (
    @SET MVN_CMD="%JAVA_HOME%\bin\java.exe" -jar %MAVEN_WRAPPER_JAR% %*
) ELSE (
    @echo Downloading Maven Wrapper...
    @"%JAVA_HOME%\bin\java.exe" -jar %MAVEN_WRAPPER_JAR% %* 2>NUL
)

@IF NOT EXIST %MAVEN_WRAPPER_JAR% (
    @echo maven-wrapper.jar not found. Download manually from:
    @echo %DOWNLOAD_URL%
    @EXIT /B 1
)

@SET MAVEN_PROJECTBASEDIR=%~dp0
@"%JAVA_HOME%\bin\java.exe" %JVM_CONFIG_MAVEN_PROPS% %MAVEN_OPTS% -jar %MAVEN_WRAPPER_JAR% %*
