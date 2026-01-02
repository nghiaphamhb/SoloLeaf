package com.example.soloLeaf.dto.searchPage;

import com.example.soloLeaf.dto.FoodDTO;

import java.util.List;

// list of foods which grouped by restaurant
public class FoodGroupDTO {
    private RestaurantBriefDTO restaurant;
    private List<FoodDTO> foods;

    public FoodGroupDTO(RestaurantBriefDTO restaurant, List<FoodDTO> foods) {
        this.restaurant = restaurant;
        this.foods = foods;
    }

    public FoodGroupDTO() {

    }

    public RestaurantBriefDTO getRestaurant() {
        return restaurant;
    }

    public void setRestaurant(RestaurantBriefDTO restaurant) {
        this.restaurant = restaurant;
    }

    public List<FoodDTO> getFoods() {
        return foods;
    }

    public void setFoods(List<FoodDTO> foods) {
        this.foods = foods;
    }
}
