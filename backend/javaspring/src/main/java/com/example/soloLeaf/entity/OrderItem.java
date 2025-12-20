package com.example.soloLeaf.entity;

import com.example.soloLeaf.entity.keys.IdOrderItem;
import jakarta.persistence.*;

import java.util.Date;

@Entity
@Table(name = "orderitem")
public class OrderItem {
    @EmbeddedId
    private IdOrderItem id;

    @Column(name = "create_date")
    private Date createDate;

    @ManyToOne
    @JoinColumn(name = "order_id", insertable=false, updatable=false)
    private Order order;

    @ManyToOne
    @JoinColumn(name = "food_id", insertable=false, updatable=false)
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
