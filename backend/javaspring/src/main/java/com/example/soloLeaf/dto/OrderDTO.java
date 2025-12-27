package com.example.soloLeaf.dto;

import java.util.Date;
import java.util.List;

public class OrderDTO {
    private int id;
    private Date createDate;
    private String status;
    private long totalPrice;

    private List<OrderItemDTO> items;

    public OrderDTO(int id, Date createDate, String status, long totalPrice,
                    List<OrderItemDTO> items) {
        this.id = id;
        this.createDate = createDate;
        this.status = status;
        this.totalPrice = totalPrice;
        this.items = items;
    }

    public int getId() { return id; }
    public Date getCreateDate() { return createDate; }
    public String getStatus() { return status; }
    public long getTotalPrice() { return totalPrice; }
    public List<OrderItemDTO> getItems() { return items; }
}
