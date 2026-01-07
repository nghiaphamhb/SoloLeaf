package com.example.soloLeaf.service;

import com.example.soloLeaf.dto.CategoryMenuDTO;
import com.example.soloLeaf.dto.FoodDTO;
import com.example.soloLeaf.dto.PageDTO;
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
            String imageUrl = fileService.saveFile(image);
            if (!imageUrl.isEmpty()) {
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
    public List<CategoryMenuDTO> getMenuInHomePage() {
        PageRequest pageRequest = PageRequest.of(0, 3, Sort.by("id"));
        Page<Category> listCategory = categoryRepository.findAll(pageRequest);
        List<CategoryMenuDTO> listCategoryMenuDTO = new ArrayList<>();

        for (Category category : listCategory.getContent()) {
            CategoryMenuDTO categoryMenuDTO = new CategoryMenuDTO();
            categoryMenuDTO.setId(category.getId());
            categoryMenuDTO.setName(category.getNameCate());

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

            categoryMenuDTO.setFoodList(foodList);
            listCategoryMenuDTO.add(categoryMenuDTO);
        }

        return listCategoryMenuDTO;
    }

    @Override
    public PageDTO<FoodDTO> searchFoods(
            String q,
            Integer restaurantId,
            Double minPrice,
            Double maxPrice,
            Boolean freeShip,
            int page,
            int size,
            String sort
    ) {
        String qq = (q == null || q.isBlank()) ? null : q.trim();

        // if no query -> return empty page (avoid returning full list)
        if (qq == null) {
            return new PageDTO<>(
                    List.of(),
                    page,
                    size,
                    0,
                    0
            );
        }

        Sort s = switch (sort == null ? "" : sort) {
            case "priceAsc" -> Sort.by(Sort.Direction.ASC, "price");
            case "priceDesc" -> Sort.by(Sort.Direction.DESC, "price");
            default -> Sort.by(Sort.Direction.ASC, "id");
        };

        PageRequest pr = PageRequest.of(page, size, s);

        // Normalize filters (safe)
        Double min = minPrice;
        Double max = maxPrice;

        // If user accidentally swaps min/max, you can auto-fix (safe)
        if (min != null && max != null && min > max) {
            double tmp = min;
            min = max;
            max = tmp;
        }

        // freeShip: if null -> ignore filter; if true/false -> filter exactly
        Boolean fs = freeShip;

        Page<Food> result = foodRepository.searchFoods(
                qq,
                restaurantId,
                min,
                max,
                fs,
                pr
        );

        List<FoodDTO> items = result.getContent().stream()
                .map(this::toFoodDTO)
                .toList();

        return new PageDTO<>(
                items,
                result.getNumber(),
                result.getSize(),
                result.getTotalElements(),
                result.getTotalPages()
        );
    }

    /** Map Food entity to FoodDTO */
    private FoodDTO toFoodDTO(Food f) {
        FoodDTO dto = new FoodDTO();
        dto.setId(f.getId());
        dto.setImage(f.getImage());
        dto.setTitle(f.getTitle());
        dto.setPrice(f.getPrice());
        dto.setFreeShip(f.isFreeShip());
        dto.setTimeShip(f.getTimeShip());
        // dto.setRating(...); // optional
        return dto;
    }


}
