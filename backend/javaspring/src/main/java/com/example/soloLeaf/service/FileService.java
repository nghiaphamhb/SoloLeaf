package com.example.soloLeaf.service;

import com.example.soloLeaf.dto.UserDTO;
import com.example.soloLeaf.service.imp.FileServiceImp;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class FileService implements FileServiceImp {

    @Value("${supabase.url}")
    private String supabaseUrl;

    @Value("${supabase.serviceRoleKey}")
    private String serviceRoleKey;

    @Value("${supabase.bucket}")
    private String bucket;

    @Autowired
    private UserService userService;

    private final RestTemplate restTemplate = new RestTemplate();

    @Override
    public String saveFile(MultipartFile file) {
        try {
            // 1) upload to supabase => get public url
            String url = uploadToSupabaseAndReturnUrl(file);
            if (url == null) return null;

            // 2) update current user's imageUrl in DB via existing updateUser
            UserDTO dto = new UserDTO();
            dto.setImageUrl(url);

            Boolean ok = userService.updateUser(dto);
            if (!ok) return null;

            return url;
        } catch (Exception e) {
            System.out.println("Error upload/save avatar: " + e.getMessage());
            return null;
        }
    }

    private String uploadToSupabaseAndReturnUrl(MultipartFile file) {
        try {
            String original = file.getOriginalFilename();
            String ext = (original != null && original.contains("."))
                    ? original.substring(original.lastIndexOf("."))
                    : "";

            String objectPath = UUID.randomUUID() + ext;

            // PUT /storage/v1/object/{bucket}/{path}
            String putUrl = supabaseUrl + "/storage/v1/object/" + bucket + "/" + objectPath;

            HttpHeaders headers = new HttpHeaders();
            headers.setBearerAuth(serviceRoleKey);
            headers.set("apikey", serviceRoleKey);
            headers.set("x-upsert", "true");
            headers.setContentType(MediaType.parseMediaType(
                    file.getContentType() != null ? file.getContentType() : "application/octet-stream"
            ));

            HttpEntity<byte[]> entity = new HttpEntity<>(file.getBytes(), headers);

            ResponseEntity<String> resp = restTemplate.exchange(
                    putUrl, HttpMethod.PUT, entity, String.class
            );

            if (!resp.getStatusCode().is2xxSuccessful()) {
                return null;
            }

            // Public URL (bucket phải Public)
            return supabaseUrl + "/storage/v1/object/public/" + bucket + "/" + objectPath;

        } catch (Exception e) {
            System.out.println("Error upload to Supabase: " + e.getMessage());
            return null;
        }
    }
}
