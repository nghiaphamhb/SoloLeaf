package com.example.soloLeaf.service.imp;

import com.example.soloLeaf.dto.CategoryMenuDTO;
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
}
