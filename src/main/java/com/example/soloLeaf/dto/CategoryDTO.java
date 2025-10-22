package com.example.soloLeaf.dto;

import java.util.List;

// category's menu in the main site
public class CategoryDTO {
    private String name;
    private List<FoodDTO> foodList;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<FoodDTO> getFoodList() {
        return foodList;
    }

    public void setFoodList(List<FoodDTO> foodList) {
        this.foodList = foodList;
    }
}
