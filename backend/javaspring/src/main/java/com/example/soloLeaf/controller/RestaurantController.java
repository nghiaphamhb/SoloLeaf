package com.example.soloLeaf.controller;

import com.example.soloLeaf.dto.RestaurantDTO;
import com.example.soloLeaf.payload.ResponseData;
import com.example.soloLeaf.service.imp.FileServiceImp;
import com.example.soloLeaf.service.imp.RestaurantServiceImp;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/restaurant")
public class RestaurantController {
    @Autowired
    private FileServiceImp fileServiceImp;

    @Autowired
    private RestaurantServiceImp restaurantServiceImp;

    @PostMapping()
    public ResponseEntity<?> createRestaurant (
            @RequestParam MultipartFile file,
            @RequestParam String title,
            @RequestParam String subtitle,
            @RequestParam String description,
            @RequestParam boolean isFreeShip,
            @RequestParam String address,
            @RequestParam String openDate) {
        ResponseData responseData = new ResponseData();
        boolean isSuccess = restaurantServiceImp.insertRestaurant(file, title, subtitle, description, isFreeShip, address, openDate);
        responseData.setData(isSuccess);

        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }

    @GetMapping("/file/{filename:.+}")
    public ResponseEntity<?> getFileRestaurant(@PathVariable String filename) {
        Resource resource = fileServiceImp.loadFile(filename);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"" +resource.getFilename() + "\"")
                .body(resource);
    }

    @GetMapping("")
    public ResponseEntity<?> getHomePageRestaurants() {
        ResponseData responseData = new ResponseData();
        responseData.setData(restaurantServiceImp.getHomePageRestaurants());
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }

    @GetMapping("/detail/{id}")
    public ResponseEntity<?> getRestaurantDetails(@PathVariable int id) {
        ResponseData responseData = new ResponseData();
        RestaurantDTO dto = restaurantServiceImp.getDetailRestaurant(id);
        responseData.setData(dto);
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }

    @GetMapping("/tabs")
    public ResponseEntity<?> getRestaurantTabs(
            @RequestParam(required = false) String q,
            @RequestParam(defaultValue = "6") int limit
    ) {
        ResponseData responseData = new ResponseData();
        responseData.setData(restaurantServiceImp.getRestaurantTabs(q, limit));
        responseData.setSuccess(true);
        return ResponseEntity.ok(responseData);
    }

}
