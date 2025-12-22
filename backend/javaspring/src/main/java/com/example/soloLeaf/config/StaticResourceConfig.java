package com.example.soloLeaf.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Path;

@Configuration
public class StaticResourceConfig implements WebMvcConfigurer {

    @Value("${fileUpload.rootPath}")
    private String uploadsDir;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Convert to absolute normalized path
        Path uploadsPath = Path.of(uploadsDir).toAbsolutePath().normalize();
        // Map: localhost:8080/uploads/ -> file:uploadsDir/
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:" + uploadsPath.toString() + "/");
    }
}
