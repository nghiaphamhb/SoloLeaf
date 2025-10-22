package com.example.soloLeaf.controller;

import com.example.soloLeaf.dto.CategoryDTO;
import com.example.soloLeaf.payload.ResponseData;
import com.example.soloLeaf.service.imp.FoodServiceImp;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/category-menu")
public class CategoryFoodsController {
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

    @GetMapping()
    public ResponseEntity<?> getCategoryWithFoods() {
        ResponseData responseData = new ResponseData();
        List<CategoryDTO> menu = foodServiceImp.getMenuInHomePage();
        responseData.setData(menu);

        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }
}
