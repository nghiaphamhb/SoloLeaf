package com.example.soloLeaf.dto;

import java.util.Date;

public class UserDTO {
    private int id;
    private String imageUrl;
    private String email;
    private String fullname;
    private Date createDate;
    private String roleName;


    public UserDTO() {
    }

    public UserDTO(int id, String imageUrl, String email, String fullname, Date createDate, String roleName) {
        this.id = id;
        this.imageUrl = imageUrl;
        this.email = email;
        this.fullname = fullname;
        this.createDate = createDate;
        this.roleName = roleName;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String username) {
        this.email = username;
    }

    public String getFullname() {
        return fullname;
    }

    public void setFullname(String fullname) {
        this.fullname = fullname;
    }

    public Date getCreateDate() {
        return createDate;
    }

    public void setCreateDate(Date createDate) {
        this.createDate = createDate;
    }

    public String getRoleName() {
        return roleName;
    }

    public void setRoleName(String roleName) {
        this.roleName = roleName;
    }
}