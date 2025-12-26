# ===== Build stage =====
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app

# Copy full project (most compatible)
COPY . .

# Build jar (show logs, no -q)
RUN mvn -B -DskipTests package

# ===== Runtime stage =====
FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=build /app/target/*.jar /app/app.jar
EXPOSE 8080
ENTRYPOINT ["java","-jar","/app/app.jar"]
# ===== Build stage =====
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app

# Copy full project (most compatible)
COPY . .

# Build jar (show logs, no -q)
RUN mvn -B -DskipTests package

# ===== Runtime stage =====
FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=build /app/target/*.jar /app/app.jar
EXPOSE 8080
ENTRYPOINT ["java","-jar","/app/app.jar"]
