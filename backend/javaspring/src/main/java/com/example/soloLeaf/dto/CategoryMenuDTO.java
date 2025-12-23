package com.example.soloLeaf.dto;

import java.util.List;

// category's menu in the main site
public class CategoryMenuDTO {
    private int id;
    private String name;
    private List<FoodDTO> foodList;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

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
