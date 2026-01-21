package com.example.soloLeaf.service.imp;

public interface OrderPushNotifierImp {
    void notifyOrderStatus(long userId, int orderId, String status);
}
