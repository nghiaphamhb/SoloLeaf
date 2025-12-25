package com.example.soloLeaf.entity;

import com.example.soloLeaf.entity.keys.IdMenuRestaurant;
import jakarta.persistence.*;

import java.util.Date;

@Entity
@Table(name = "menurestaurant")
public class MenuRestaurant {
    @EmbeddedId
    private IdMenuRestaurant id;

    @Column(name = "create_date")
    private Date createDate;

    @ManyToOne
    @JoinColumn(name = "res_id", insertable=false, updatable=false)
    private Restaurant restaurant;

    @ManyToOne
    @JoinColumn(name = "cate_id", insertable=false, updatable=false)
    private Category category;

    public IdMenuRestaurant getId() {
        return id;
    }

    public void setId(IdMenuRestaurant id) {
        this.id = id;
    }

    public Date getCreateDate() {
        return createDate;
    }

    public void setCreateDate(Date createDate) {
        this.createDate = createDate;
    }

    public Restaurant getRestaurant() {
        return restaurant;
    }

    public void setRestaurant(Restaurant restaurant) {
        this.restaurant = restaurant;
    }

    public Category getCategory() {
        return category;
    }

    public void setCategory(Category category) {
        this.category = category;
    }
}
