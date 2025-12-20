package com.example.soloLeaf.controller;

import com.example.soloLeaf.payload.ResponseData;
import com.example.soloLeaf.payload.request.AuthRequest;
import com.example.soloLeaf.service.imp.AuthServiceImp;
import com.example.soloLeaf.utils.JwtUtilsHelper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(("/api/auth"))
public class AuthController {
    @Autowired
    AuthServiceImp authServiceImp;

    @Autowired
    private JwtUtilsHelper jwtUtilsHelper;

    Logger logger = LoggerFactory.getLogger(this.getClass());

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest authRequest) {
        ResponseData responseData = new ResponseData();

        // only use for get the server's key (only server know to sign tokens)
//        SecretKey key = Jwts.SIG.HS256.key().build();
//        String secretString = Encoders.BASE64.encode(key.getEncoded());
//        System.out.println("Key: " + secretString);

        boolean check = authServiceImp.checkLogin(authRequest.getEmail(), authRequest.getPassword());
        if (check) {
            String token = jwtUtilsHelper.generateJwtToken(authRequest.getEmail());

            responseData.setTrue(true);
            responseData.setData(token);
            logger.info("[Server] Return token: {}", token);
        } else {
            responseData.setTrue(false);
            responseData.setData("");
        }

        return new ResponseEntity<>(responseData,HttpStatus.OK);

    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody AuthRequest authRequest) {
        ResponseData responseData = new ResponseData();
        if (authServiceImp.register(authRequest)) {
            responseData.setData(true);
        } else {
            responseData.setData(false);
        }

        return new ResponseEntity<>(responseData,HttpStatus.OK);

    }
}
