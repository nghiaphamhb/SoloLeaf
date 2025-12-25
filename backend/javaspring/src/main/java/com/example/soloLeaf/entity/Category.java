package com.example.soloLeaf.entity;

import jakarta.persistence.*;

import java.util.Date;
import java.util.List;

@Entity
@Table(name = "category")
public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "name_cate")
    private String nameCate;

    @Column(name = "create_date")
    private Date createDate;

    @OneToMany(mappedBy = "category")
    private List<Food> foods;

    @OneToMany(mappedBy = "category")
    private List<MenuRestaurant> menuRestaurants;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getNameCate() {
        return nameCate;
    }

    public void setNameCate(String nameCate) {
        this.nameCate = nameCate;
    }

    public Date getCreateDate() {
        return createDate;
    }

    public void setCreateDate(Date createDate) {
        this.createDate = createDate;
    }

    public List<Food> getFoods() {
        return foods;
    }

    public void setFoods(List<Food> foods) {
        this.foods = foods;
    }

    public List<MenuRestaurant> getMenuRestaurants() {
        return menuRestaurants;
    }

    public void setMenuRestaurants(List<MenuRestaurant> menuRestaurants) {
        this.menuRestaurants = menuRestaurants;
    }
}
