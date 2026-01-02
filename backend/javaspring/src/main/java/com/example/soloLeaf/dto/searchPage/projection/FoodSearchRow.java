package com.example.soloLeaf.dto.searchPage.projection;

public record FoodSearchRow(
        int foodId,
        String foodImage,
        String foodTitle,
        double price,
        boolean freeShip,
        String timeShip,
        int restaurantId,
        String restaurantTitle,
        String restaurantImage
) {
}
