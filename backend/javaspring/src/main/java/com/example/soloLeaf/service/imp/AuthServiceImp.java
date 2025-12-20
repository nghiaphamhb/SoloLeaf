package com.example.soloLeaf.service.imp;

import com.example.soloLeaf.payload.request.AuthRequest;

public interface AuthServiceImp {
    public boolean checkLogin(String username, String password);
    public boolean register(AuthRequest authRequest);
}
