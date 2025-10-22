package com.example.soloLeaf.payload;

/**
 * {
 *     status: 200
 *     description: OK
 *     isTrue: True
 *     data: {}
 * }
 */
public class ResponseData {
    private int status;
    private String description;
    private boolean isTrue;
    private Object data;   //chi dung toi data

    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Object getData() {
        return data;
    }

    public void setData(Object data) {
        this.data = data;
    }

    public boolean isTrue() {
        return isTrue;
    }

    public void setTrue(boolean aTrue) {
        isTrue = aTrue;
    }
}
