package com.example.soloLeaf.service;

import com.example.soloLeaf.entity.Roles;
import com.example.soloLeaf.entity.Users;
import com.example.soloLeaf.payload.request.AuthRequest;
import com.example.soloLeaf.repository.UserRepository;
import com.example.soloLeaf.service.imp.AuthServiceImp;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
public class AuthService implements AuthServiceImp {
    @Autowired
    UserRepository userRepository;

    @Autowired
    PasswordEncoder passwordEncoder;

    Logger logger = LoggerFactory.getLogger(AuthService.class);

    @Override
    public boolean checkLogin(String email,  String password) {
        Users user = userRepository.findByEmail(email);
//        logger.info("[Server] Found user: {}", user.toString());
        return passwordEncoder.matches(password, user.getPassword());
    }

    @Override
    public boolean register(AuthRequest authRequest) {
        Users user = new Users();
        user.setEmail(authRequest.getEmail());
        user.setPassword(
                passwordEncoder.encode(authRequest.getPassword())
        );
        user.setFullname(authRequest.getFullname());

        Date createDate = new Date();
        user.setCreateDate(createDate);

        Roles role = new Roles();
        int roleId = authRequest.getRoleId();
        if (roleId == 0){
            roleId = 2;  // client
        }
        role.setId(roleId);
        user.setRole(role);

        try{
            userRepository.save(user);
            return true;
        } catch (Exception e) {
            System.out.println("Service/AuthService" + e.getMessage());
            return false;
        }
    }


}
