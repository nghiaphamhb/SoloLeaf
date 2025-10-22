package com.example.soloLeaf.service;

import com.example.soloLeaf.entity.Roles;
import com.example.soloLeaf.entity.Users;
import com.example.soloLeaf.payload.request.SignUpRequest;
import com.example.soloLeaf.repository.UserRepository;
import com.example.soloLeaf.service.imp.LoginServiceImp;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
public class LoginService implements LoginServiceImp {
    @Autowired
    UserRepository userRepository;

    @Autowired
    PasswordEncoder passwordEncoder;

    @Override
    public boolean checkLogin(String username,  String password) {
        Users user = userRepository.findByUsername(username);
        System.out.println("[Server] Found user: " + user.toString());
        return passwordEncoder.matches(password, user.getPassword());
    }

    @Override
    public boolean signUp(SignUpRequest signUpRequest) {
        Users user = new Users();
        user.setUsername(signUpRequest.getUsername());
        user.setPassword(
                passwordEncoder.encode(signUpRequest.getPassword())
        );
        user.setFullname(signUpRequest.getFullname());

        Date createDate = new Date();
        user.setCreateDate(createDate);

        Roles role = new Roles();
        role.setId(signUpRequest.getRoleId());
        user.setRole(role);

        try{
            userRepository.save(user);
            return true;
        } catch (Exception e) {
            return false;
        }
    }


}
