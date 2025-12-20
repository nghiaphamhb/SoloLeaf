package com.example.soloLeaf.security;

import com.example.soloLeaf.entity.Users;
import com.example.soloLeaf.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

/**
 *  Phục vụ việc tùy chỉnh làm việc với UserDetail
 *  Tùy chỉnh UserDetailsService theo yêu cầu -. logic thường: UserDetailsManager -> (Custom)UserDetailsService
 */
@Service
public class CustomUserDetailService implements UserDetailsService {
    @Autowired
    UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Users user = userRepository.findByUsername(username);
        if (user == null) {
            throw new UsernameNotFoundException("User not found");
        }
        return new User(username, user.getPassword(), new ArrayList<>());  //User - class impl interface UserDetail
    }
}
