package com.example.soloLeaf.payload.request;

import java.util.List;

public class CheckoutSessionRequest {
    private List<Item> items;
    private String promoCode;

    public static class Item {
        private int id;   // foodId
        private int qty;

        public int getId() { return id; }
        public void setId(int id) { this.id = id; }

        public int getQty() { return qty; }
        public void setQty(int qty) { this.qty = qty; }
    }

    public List<Item> getItems() { return items; }
    public void setItems(List<Item> items) { this.items = items; }

    public String getPromoCode() { return promoCode; }
    public void setPromoCode(String promoCode) { this.promoCode = promoCode; }
}
