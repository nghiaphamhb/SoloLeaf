package com.example.soloLeaf.service.imp;

import com.example.soloLeaf.payload.request.OrderRequest;

public interface OrderServiceImp {
    boolean insertOrder(OrderRequest orderRequest);
}
