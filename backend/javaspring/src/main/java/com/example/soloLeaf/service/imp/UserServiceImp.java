package com.example.soloLeaf.service.imp;

import com.example.soloLeaf.dto.UserDTO;
import com.example.soloLeaf.entity.Users;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import java.util.List;

public interface UserServiceImp {
    List<UserDTO> getAllUser();
    Users getCurrentUser();
    UserDTO getMyProfile();
    Boolean updateUser(UserDTO userDTO);
}
