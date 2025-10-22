package com.example.soloLeaf.controller;

import com.example.soloLeaf.payload.ResponseData;
import com.example.soloLeaf.payload.request.SignUpRequest;
import com.example.soloLeaf.service.imp.LoginServiceImp;
import com.example.soloLeaf.utils.JwtUtilsHelper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(("/api/login"))
public class LoginController {
    @Autowired
    LoginServiceImp loginServiceImp;

    @Autowired
    private JwtUtilsHelper jwtUtilsHelper;

    @PostMapping("/signIn")
    public ResponseEntity<?> signIn(
            @RequestParam("username") String username,
            @RequestParam("password") String password) {
        ResponseData responseData = new ResponseData();

        // only use for get the server's key (only server know to sign tokens)
//        SecretKey key = Jwts.SIG.HS256.key().build();
//        String secretString = Encoders.BASE64.encode(key.getEncoded());
//        System.out.println("Key: " + secretString);

        boolean check = loginServiceImp.checkLogin(username, password);
        if (check) {
            String token = jwtUtilsHelper.generateJwtToken(username);

            responseData.setTrue(true);
            responseData.setData(token);
            System.out.println("[Server] Return token: " + token);
        } else {
            responseData.setTrue(false);
            responseData.setData("");
        }

        return new ResponseEntity<>(responseData,HttpStatus.OK);

    }

    @PostMapping("/signUp")
    public ResponseEntity<?> signUp(@RequestBody SignUpRequest signUpRequest) {
        ResponseData responseData = new ResponseData();
        if (loginServiceImp.signUp(signUpRequest)) {
            responseData.setData(true);
        } else {
            responseData.setData(false);
        }

        return new ResponseEntity<>(responseData,HttpStatus.OK);

    }
}
