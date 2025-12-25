package com.example.soloLeaf.dto;

import java.util.Date;
import java.util.List;

public class OrderDTO {
    private int id;
    private Date createDate;
    private String status;
    private long totalPrice;

    private int resId;
    private String resName;
    private String resLogo;

    private List<OrderItemDTO> items;

    public OrderDTO(int id, Date createDate, String status, long totalPrice,
                    int resId, String resName, String resLogo,
                    List<OrderItemDTO> items) {
        this.id = id;
        this.createDate = createDate;
        this.status = status;
        this.totalPrice = totalPrice;
        this.resId = resId;
        this.resName = resName;
        this.resLogo = resLogo;
        this.items = items;
    }

    public int getId() { return id; }
    public Date getCreateDate() { return createDate; }
    public String getStatus() { return status; }
    public long getTotalPrice() { return totalPrice; }
    public int getResId() { return resId; }
    public String getResName() { return resName; }
    public String getResLogo() { return resLogo; }
    public List<OrderItemDTO> getItems() { return items; }
}
