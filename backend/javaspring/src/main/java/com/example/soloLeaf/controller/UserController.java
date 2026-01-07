package com.example.soloLeaf.controller;

import com.example.soloLeaf.dto.UserDTO;
import com.example.soloLeaf.payload.ResponseData;
import com.example.soloLeaf.service.imp.UserServiceImp;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
public class UserController {
    @Autowired
    UserServiceImp userServiceImp;

    @GetMapping("/me")
    public ResponseEntity<?> me() {
        ResponseData responseData = new ResponseData();
        responseData.setData(userServiceImp.getMyProfile());
        responseData.setSuccess(true);
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }

    @GetMapping()
    public ResponseEntity<?> getAllUsers() {
        return new ResponseEntity<>(userServiceImp.getAllUser(), HttpStatus.OK);
    }

    @PostMapping("/edit")
    public ResponseEntity<?> editUser(@RequestBody UserDTO userDTO) {
        ResponseData responseData = new ResponseData();
        responseData.setSuccess(userServiceImp.updateUser(userDTO));
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }
}
