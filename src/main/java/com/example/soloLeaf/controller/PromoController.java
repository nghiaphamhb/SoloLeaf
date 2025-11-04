package com.example.soloLeaf.controller;

import com.example.soloLeaf.payload.ResponseData;
import com.example.soloLeaf.service.imp.PromoServiceImp;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/promo")
public class PromoController {
    @Autowired
    private PromoServiceImp promoServiceImp;

    @GetMapping("/")
    public ResponseEntity<?> getAllPromo() {
        ResponseData responseData = new ResponseData();
        responseData.setData(promoServiceImp.getAllPromo());
        return ResponseEntity.ok(responseData);
    }
}
