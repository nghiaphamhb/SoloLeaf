package com.example.soloLeaf.dto.searchPage;


// restaurant tabs in the search page
public class RestaurantTabDTO {
    private int id;
    private String title;

    public RestaurantTabDTO(int id, String title) {
        this.id = id;
        this.title = title;
    }

    public RestaurantTabDTO() {

    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }
}
