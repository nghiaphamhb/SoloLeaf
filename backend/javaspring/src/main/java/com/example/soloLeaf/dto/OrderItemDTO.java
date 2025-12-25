package com.example.soloLeaf.dto;

public class OrderItemDTO {
    private int foodId;
    private String title;
    private String image;
    private int qty;
    private long price;

    public OrderItemDTO(int foodId, String title, String image, int qty, long price) {
        this.foodId = foodId;
        this.title = title;
        this.image = image;
        this.qty = qty;
        this.price = price;
    }

    public int getFoodId() { return foodId; }
    public String getTitle() { return title; }
    public String getImage() { return image; }
    public int getQty() { return qty; }
    public long getPrice() { return price; }
}
