package com.example.soloLeaf.dto.searchPage;

import java.util.List;

// the main answer of searching action
public class GroupedFoodSearchDTO {
    private String query;
    private List<RestaurantTabDTO> tabs;
    private List<FoodGroupDTO> groups;

    public GroupedFoodSearchDTO(String query, List<RestaurantTabDTO> tabs, List<FoodGroupDTO> groups) {
        this.query = query;
        this.tabs = tabs;
        this.groups = groups;
    }

    public GroupedFoodSearchDTO() {

    }

    public String getQuery() {
        return query;
    }

    public void setQuery(String query) {
        this.query = query;
    }

    public List<RestaurantTabDTO> getTabs() {
        return tabs;
    }

    public void setTabs(List<RestaurantTabDTO> tabs) {
        this.tabs = tabs;
    }

    public List<FoodGroupDTO> getGroups() {
        return groups;
    }

    public void setGroups(List<FoodGroupDTO> groups) {
        this.groups = groups;
    }
}
