package com.example.soloLeaf.dto;

import java.util.Date;

public class UserDTO {
    private int id;
    private String username;
    private String fullname;
    private Date createDate;


    public UserDTO() {
    }

    public UserDTO(int id, String username, String fullname, Date createDate) {
        this.id = id;
        this.username = username;
        this.fullname = fullname;
        this.createDate = createDate;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
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