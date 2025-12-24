package com.example.soloLeaf.payload.request;

import com.example.soloLeaf.dto.FoodDTO;

import java.util.List;

public class CheckoutSessionRequest {
    private Integer resId;
    private List<FoodDTO> items;

    public Integer getResId() { return resId; }
    public void setResId(Integer resId) { this.resId = resId; }

    public List<FoodDTO> getItems() { return items; }
    public void setItems(List<FoodDTO> items) { this.items = items; }
}
