package com.example.soloLeaf.dto;

import java.util.Date;

public class PromoDTO {
    private int id;
    private String code;
    private int percent;
    private Date startDate;
    private Date endDate;
    private int resId;
    private String resTitle;

    public PromoDTO() {
    }

    public PromoDTO(int id, String code, int percent, Date startDate, Date endDate, int resId, String resTitle) {
        this.id = id;
        this.code = code;
        this.percent = percent;
        this.startDate = startDate;
        this.endDate = endDate;
        this.resId = resId;
        this.resTitle = resTitle;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getPercent() {
        return percent;
    }

    public void setPercent(int percent) {
        this.percent = percent;
    }

    public Date getStartDate() {
        return startDate;
    }

    public void setStartDate(Date startDate) {
        this.startDate = startDate;
    }

    public Date getEndDate() {
        return endDate;
    }

    public void setEndDate(Date endDate) {
        this.endDate = endDate;
    }

    public int getResId() {
        return resId;
    }

    public void setResId(int resId) {
        this.resId = resId;
    }

    public String getResTitle() {
        return resTitle;
    }

    public void setResTitle(String resTitle) {
        this.resTitle = resTitle;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }
}
