package com.example.soloLeaf.entity.keys;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

import java.io.Serializable;

@Embeddable
public class IdMenuRestaurant implements Serializable {
    @Column(name = "res_id")
    private int resId;

    @Column(name = "cate_id")
    private int cateId;

    public IdMenuRestaurant() {
    }

    public IdMenuRestaurant(int resId, int cateId) {
        this.resId = resId;
        this.cateId = cateId;
    }

    public int getResId() {
        return resId;
    }

    public void setResId(int resId) {
        this.resId = resId;
    }

    public int getCateId() {
        return cateId;
    }

    public void setCateId(int cateId) {
        this.cateId = cateId;
    }
}
