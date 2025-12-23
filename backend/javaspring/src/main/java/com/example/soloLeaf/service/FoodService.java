package com.example.soloLeaf.service;

import com.example.soloLeaf.dto.CategoryDTO;
import com.example.soloLeaf.dto.FoodDTO;
import com.example.soloLeaf.entity.Category;
import com.example.soloLeaf.entity.Food;
import com.example.soloLeaf.repository.CategoryRepository;
import com.example.soloLeaf.repository.FoodRepository;
import com.example.soloLeaf.service.imp.FoodServiceImp;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;


@Service
public class FoodService implements FoodServiceImp {
    @Autowired
    FoodRepository foodRepository;

    @Autowired
    CategoryRepository categoryRepository;

    @Autowired
    FileService fileService;

    @Override
    public boolean addFood(MultipartFile image, String title, String timeShip, boolean isFreeShip, double price, int cate_id) {
        try{
            boolean savedFile = fileService.saveFile(image);
            if (savedFile) {
                Food food = new Food();
                food.setImage(image.getOriginalFilename());
                food.setTitle(title);
                food.setTimeShip(timeShip);
                food.setFreeShip(isFreeShip);
                food.setPrice(price);

                Category category = new Category();
                category.setId(cate_id);
                food.setCategory(category);

                foodRepository.save(food);
                return true;
            }
        } catch (Exception e) {
            System.out.println("Error when insert food: " + e.getMessage());
        }
        return false;
    }

    @Override
    public List<CategoryDTO> getMenuInHomePage() {
        PageRequest pageRequest = PageRequest.of(0, 3, Sort.by("id"));
        Page<Category> listCategory = categoryRepository.findAll(pageRequest);
        List<CategoryDTO> listCategoryDTO = new ArrayList<>();

        for (Category category : listCategory.getContent()) {
            CategoryDTO categoryDTO = new CategoryDTO();
            categoryDTO.setName(category.getNameCate());

            List<FoodDTO> foodList = new ArrayList<>();
            for (Food food : category.getFoods()) { //trong jpa se query toan bo du lieu duoc moc noi
                FoodDTO foodDTO = new FoodDTO();
                foodDTO.setId(food.getId());
                foodDTO.setImage(food.getImage());
                foodDTO.setTitle(food.getTitle());
                foodDTO.setTimeShip(food.getTimeShip());
                foodDTO.setFreeShip(food.isFreeShip());

                foodList.add(foodDTO);
            }

            categoryDTO.setFoodList(foodList);
            listCategoryDTO.add(categoryDTO);
        }

        return listCategoryDTO;
    }
}
