package com.example.soloLeaf.service;

import com.example.soloLeaf.dto.CategoryMenuDTO;
import com.example.soloLeaf.dto.FoodDTO;
import com.example.soloLeaf.dto.searchPage.*;
import com.example.soloLeaf.dto.searchPage.projection.FoodSearchRow;
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

import java.awt.print.Pageable;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;


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
    public PageDTO<FoodDTO> searchFoods(String q, int page, int size, String sort) {
        Sort s = switch (sort == null ? "" : sort) {
            case "priceAsc" -> Sort.by(Sort.Direction.ASC, "price");
            case "priceDesc" -> Sort.by(Sort.Direction.DESC, "price");
            case "idDesc" -> Sort.by(Sort.Direction.DESC, "id");
            default -> Sort.by(Sort.Direction.ASC, "id");
        };

        PageRequest pr = PageRequest.of(page, size, s);

        String query = (q == null || q.isBlank()) ? null : q.trim();
        Page<Food> result = foodRepository.searchFoods(query, pr);

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

    public GroupedFoodSearchDTO searchFoodsGrouped(String q, int limitPerRestaurant) {
        String query = (q == null || q.isBlank()) ? null : q.trim();
        List<FoodSearchRow> rows = foodRepository.searchFoodsGrouped(query);

        // Group by restaurantId (keep order)
        Map<Integer, List<FoodSearchRow>> byRestaurant = rows.stream()
                .collect(java.util.stream.Collectors.groupingBy(
                        FoodSearchRow::restaurantId,
                        java.util.LinkedHashMap::new,
                        java.util.stream.Collectors.toList()
                ));

        List<RestaurantTabDTO> tabs = new ArrayList<>();
        List<FoodGroupDTO> groups = new ArrayList<>();

        for (var entry : byRestaurant.entrySet()) {
            List<FoodSearchRow> rrows = entry.getValue();
            FoodSearchRow first = rrows.get(0);

            // Tab item
            RestaurantTabDTO tab = new RestaurantTabDTO();
            tab.setId(first.restaurantId());
            tab.setTitle(first.restaurantTitle());
            tabs.add(tab);

            // Restaurant brief
            RestaurantBriefDTO res = new RestaurantBriefDTO();
            res.setId(first.restaurantId());
            res.setTitle(first.restaurantTitle());
            res.setImage(first.restaurantImage());

            // Foods (limit per restaurant for UI)
            List<FoodDTO> foods = rrows.stream()
                    .limit(Math.max(1, limitPerRestaurant))
                    .map(rr -> {
                        FoodDTO dto = new FoodDTO();
                        dto.setId(rr.foodId());
                        dto.setImage(rr.foodImage());
                        dto.setTitle(rr.foodTitle());
                        dto.setPrice(rr.price());
                        dto.setFreeShip(rr.freeShip());
                        dto.setTimeShip(rr.timeShip());
                        return dto;
                    })
                    .toList();

            FoodGroupDTO group = new FoodGroupDTO();
            group.setRestaurant(res);
            group.setFoods(foods);
            groups.add(group);
        }

        GroupedFoodSearchDTO out = new GroupedFoodSearchDTO();
        out.setQuery(q);
        out.setTabs(tabs);
        out.setGroups(groups);
        return out;
    }

}
