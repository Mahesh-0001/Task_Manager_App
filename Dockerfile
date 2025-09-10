# Multi-stage build for Spring Boot (Java 17)

# ---------- Stage 1: Build backend ----------
FROM maven:3.9.8-eclipse-temurin-17 AS build
WORKDIR /app

# Copy only the pom first to leverage Docker layer caching
COPY backend/pom.xml ./backend/pom.xml
RUN  mvn -q -f backend/pom.xml -DskipTests dependency:go-offline

# Now copy the full backend sources
COPY backend ./backend

# Build Spring Boot jar
RUN  mvn -q -f backend/pom.xml clean package -DskipTests

# ---------- Stage 2: Runtime image ----------
FROM eclipse-temurin:17-jre
WORKDIR /app

# Copy built jar from the build stage
# The artifactId in pom.xml is 'backend'; copy any jar and rename to app.jar
COPY --from=build /app/backend/target/*.jar /app/app.jar

# Environment & port
ENV JAVA_OPTS=""
EXPOSE 8080

# Run the application
ENTRYPOINT ["/bin/sh","-c","java $JAVA_OPTS -jar /app/app.jar"]



# --mount=type=cache,target=/root/.m2