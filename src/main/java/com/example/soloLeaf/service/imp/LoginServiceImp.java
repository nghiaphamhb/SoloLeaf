package com.example.soloLeaf.service.imp;

import com.example.soloLeaf.payload.request.SignUpRequest;

public interface LoginServiceImp {
    public boolean checkLogin(String username, String password);
    public boolean signUp(SignUpRequest signUpRequest);
}
