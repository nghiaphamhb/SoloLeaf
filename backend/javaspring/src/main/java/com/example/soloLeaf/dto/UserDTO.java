package com.example.soloLeaf.dto;

import java.util.Date;

public class UserDTO {
    private int id;
    private String email;
    private String fullname;
    private Date createDate;


    public UserDTO() {
    }

    public UserDTO(int id, String email, String fullname, Date createDate) {
        this.id = id;
        this.email = email;
        this.fullname = fullname;
        this.createDate = createDate;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
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
}