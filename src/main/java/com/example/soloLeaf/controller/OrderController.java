package com.example.soloLeaf.controller;

import com.example.soloLeaf.payload.ResponseData;
import com.example.soloLeaf.payload.request.OrderRequest;
import com.example.soloLeaf.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/order")
public class OrderController {
    @Autowired
    private OrderService orderService;

    @PostMapping()
    public ResponseEntity<?> createOrder(@RequestBody OrderRequest orderRequest) {
        ResponseData responseData = new ResponseData();
        responseData.setData(orderService.insertOrder(orderRequest));

        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }
}
