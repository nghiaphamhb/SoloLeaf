package com.example.soloLeaf.entity;

import com.example.soloLeaf.entity.keys.IdOrderItem;
import jakarta.persistence.*;

import java.util.Date;

@Entity
@Table(name = "orderitem")
public class OrderItem {
    @EmbeddedId
    private IdOrderItem id = new IdOrderItem();

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "create_date")
    private Date createDate;

    @Column(name = "qty", nullable = false)
    private int qty = 1;

    @Column(name = "price", nullable = false)
    private long price = 0;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("orderId")
    @JoinColumn(name = "order_id")
    private Order order;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("foodId")
    @JoinColumn(name = "food_id")
    private Food food;

    public IdOrderItem getId() {
        return id;
    }

    public void setId(IdOrderItem id) {
        this.id = id;
    }

    public Date getCreateDate() {
        return createDate;
    }

    public void setCreateDate(Date createDate) {
        this.createDate = createDate;
    }

    public int getQty() {
        return qty;
    }

    public void setQty(int qty) {
        this.qty = qty;
    }

    public long getPrice() {
        return price;
    }

    public void setPrice(long price) {
        this.price = price;
    }

    public Order getOrder() {
        return order;
    }

    public void setOrder(Order order) {
        this.order = order;
    }

    public Food getFood() {
        return food;
    }

    public void setFood(Food food) {
        this.food = food;
    }
}
