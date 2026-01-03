package com.example.soloLeaf.service.imp;

import com.example.soloLeaf.dto.CategoryMenuDTO;
import com.example.soloLeaf.dto.FoodDTO;
import com.example.soloLeaf.dto.PageDTO;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface FoodServiceImp {
    boolean addFood(MultipartFile image,
                    String title,
                    String timeShip,
                    boolean isFreeShip,
                    double price,
                    int cate_id);

    List<CategoryMenuDTO> getMenuInHomePage();

    PageDTO<FoodDTO> searchFoods(String q, Integer restaurantId, int page, int size, String sort);

}
