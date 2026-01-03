package com.example.soloLeaf.controller;

import com.example.soloLeaf.dto.CategoryMenuDTO;
import com.example.soloLeaf.payload.ResponseData;
import com.example.soloLeaf.service.imp.FoodServiceImp;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/food")
public class FoodController {
    @Autowired
    FoodServiceImp foodServiceImp;

    @PostMapping()
    public ResponseEntity<?> insertFood (
            @RequestParam MultipartFile image,
            @RequestParam String title,
            @RequestParam String timeShip,
            @RequestParam boolean isFreeShip,
            @RequestParam double price,
            @RequestParam int cate_id) {

        ResponseData responseData = new ResponseData();
        boolean isSuccess = foodServiceImp.addFood(image, title, timeShip, isFreeShip, price, cate_id);
        responseData.setData(isSuccess);

        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }

    @GetMapping
    public ResponseEntity<?> searchFoods(
            @RequestParam(required = false) String q,
            @RequestParam(required = false) Integer restaurantId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "idAsc") String sort
    ) {
        ResponseData responseData = new ResponseData();
        responseData.setData(foodServiceImp.searchFoods(q, restaurantId, page, size, sort));
        responseData.setSuccess(true);
        return ResponseEntity.ok(responseData);
    }


    @GetMapping("/category-menu")
    public ResponseEntity<?> getCategoryMenu() {
        ResponseData responseData = new ResponseData();
        List<CategoryMenuDTO> menu = foodServiceImp.getMenuInHomePage();
        responseData.setData(menu);

        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }
}
