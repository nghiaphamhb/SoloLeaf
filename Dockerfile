# ---- Build stage ----
FROM eclipse-temurin:17-jdk AS build
WORKDIR /app

# Copy wrapper trước để cache dependencies
COPY .mvn/ .mvn/
COPY mvnw pom.xml ./
# Nếu từng commit trên Windows, loại CRLF (tuỳ chọn) rồi cấp quyền
RUN sed -i 's/\r$//' mvnw && chmod +x mvnw

# Tải dependencies để tận dụng cache
RUN ./mvnw -q -DskipTests dependency:go-offline

# Copy source và build
COPY src ./src
RUN ./mvnw -DskipTests package

# ---- Run stage ----
FROM eclipse-temurin:17-jre
WORKDIR /app
ENV PORT=8080
EXPOSE 8080
COPY --from=build /app/target/*.jar app.jar
CMD ["sh", "-c", "java -Dserver.port=${PORT} -jar app.jar"]
