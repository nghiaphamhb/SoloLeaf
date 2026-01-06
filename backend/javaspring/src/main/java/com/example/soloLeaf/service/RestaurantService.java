package com.example.soloLeaf.service;

import com.example.soloLeaf.dto.CategoryMenuDTO;
import com.example.soloLeaf.dto.FoodDTO;
import com.example.soloLeaf.dto.RestaurantDTO;
import com.example.soloLeaf.entity.*;
import com.example.soloLeaf.repository.RestaurantRepository;
import com.example.soloLeaf.service.imp.RestaurantServiceImp;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class RestaurantService implements RestaurantServiceImp {
    @Autowired
    RestaurantRepository restaurantRepository;

    @Autowired
    FileService fileService;

    @Override
    public boolean insertRestaurant(MultipartFile file, String title, String subtitle, String description, boolean isFreeShip, String address, String openDate) {
        try{
            boolean savedFile = fileService.saveFile(file);
            if (savedFile) {
                Restaurant restaurant = new Restaurant();
                restaurant.setTitle(title);
                restaurant.setSubtitle(subtitle);
                restaurant.setDescription(description);

                restaurant.setImage(file.getOriginalFilename());

                restaurant.setFreeShip(isFreeShip);
                restaurant.setAddress(address);

                SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
                Date openDate1 = sdf.parse(openDate);
                restaurant.setOpenDate(openDate1);

                restaurantRepository.save(restaurant);

                return true;
            }
        } catch (Exception e) {
            System.out.println("Error when insert restaurant: " + e.getMessage());
        }
        return false;
    }

    @Override
    public List<RestaurantDTO> getHomePageRestaurants() {
        List<RestaurantDTO> list = new ArrayList<>();
        PageRequest pageRequest = PageRequest.of(0, 6, Sort.by(Sort.Direction.ASC, "id")); //request of page to Repository
        Page<Restaurant> page = restaurantRepository.findAll(pageRequest);

        for (Restaurant el : page.getContent()) {
            RestaurantDTO dto = new RestaurantDTO();
            dto.setId(el.getId());
            dto.setImage(el.getImage());
            dto.setTitle(el.getTitle());
            dto.setSubtitle(el.getSubtitle());
            dto.setFreeship(el.isFreeShip());
            dto.setRating(calculatorRating(el.getRatingRestaurantList())); //page lay ca du lieu cua cac relationship  mapping

            list.add(dto);
        }
        return list;
    }

    // api lay du lieu cho trang restaurant detail
    @Override
    public RestaurantDTO getDetailRestaurant(int id) {
        RestaurantDTO dto = new RestaurantDTO();
        Optional<Restaurant> restaurant = restaurantRepository.findById(id);

        if (restaurant.isPresent()) {
            Restaurant res = restaurant.get();
            dto.setId(res.getId());
            dto.setImage(res.getImage());
            dto.setTitle(res.getTitle());
            dto.setSubtitle(res.getSubtitle());

            List<Promo> promos = res.getPromoList();
            int promoPercent = 0;

            if (promos != null && !promos.isEmpty()) {
                Promo promo = promos.get(0);
                promoPercent = promo.getPercent();
            }

            dto.setPromo(promoPercent);

            dto.setDescription(res.getDescription());
            dto.setRating(
                    calculatorRating(res.getRatingRestaurantList())
            );
            dto.setAddress(res.getAddress());
            dto.setFreeship(res.isFreeShip());

            // tao list categoryDTO
            List<CategoryMenuDTO> categories = new ArrayList<>();
            List<MenuRestaurant> menus = res.getMenuRestaurantList();
            for (MenuRestaurant menuRestaurant : menus) {
                // == set categoryMenuDTO ==
                CategoryMenuDTO categoryMenuDTO = new CategoryMenuDTO();
                Category category = menuRestaurant.getCategory();

                // -- nhap du lieu cho categoryMenuDTO tu database
                categoryMenuDTO.setId(category.getId());
                categoryMenuDTO.setName(category.getNameCate());
                List<FoodDTO> foodListDTO = new ArrayList<>();
                for (Food food : category.getFoods()) {
                    FoodDTO foodDTO = new FoodDTO();
                    foodDTO.setId(food.getId());
                    foodDTO.setImage(food.getImage());
                    foodDTO.setTitle(food.getTitle());

                    List<RatingFood> ratingFoodList = food.getRatingFoodList();
                    double averageRating = 0;
                    for (RatingFood ratingFood : ratingFoodList) {
                        averageRating += ratingFood.getRatePoint();
                    }
                    averageRating /= ratingFoodList.size();

                    foodDTO.setRating(averageRating);

                    foodDTO.setFreeShip(food.isFreeShip());
                    foodDTO.setPrice(food.getPrice());

                    foodListDTO.add(foodDTO);
                }
                categoryMenuDTO.setFoodList(foodListDTO);

                //add categoryMenuDTO vao list
                categories.add(categoryMenuDTO);
            }
            dto.setCategories(categories);
        }

        return dto;
    }

    @Override
    public List<RestaurantDTO> getRestaurantTabs(String q, int limit) {
        String query = (q == null || q.isBlank()) ? null : q.trim();
        int safeLimit = Math.max(1, Math.min(limit, 30)); // giới hạn tránh spam

        Pageable pageable = PageRequest.of(0, safeLimit);
        return restaurantRepository.findTabsByFoodQuery(query, pageable);
    }

    private double calculatorRating (List<RatingRestaurant> ratingRestaurantList){
        double totalPoint = 0;
        for (RatingRestaurant ratingRestaurant : ratingRestaurantList) {
            totalPoint += ratingRestaurant.getRatePoint();
        }
        return totalPoint / ratingRestaurantList.size();
    }

}
