package com.example.soloLeaf.service;

import com.example.soloLeaf.dto.UserDTO;
import com.example.soloLeaf.entity.Users;
import com.example.soloLeaf.repository.UserRepository;
import com.example.soloLeaf.service.imp.UserServiceImp;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class UserService implements UserServiceImp {
    @Autowired
    UserRepository userRepository;

    @Override
    public List<UserDTO> getAllUser(){
        List<Users> listUser = userRepository.findAll();
        List<UserDTO> listUserDTO = new ArrayList<UserDTO>();

        for (Users user : listUser) {
            UserDTO userDTO = new UserDTO(
                    user.getId(),
                    user.getImageUrl(),
                    user.getEmail(),
                    user.getFullname(),
                    user.getCreateDate(),
                    user.getRole().getRoleName()
            );
            listUserDTO.add(userDTO);
        }
        return listUserDTO;
    }

    /** Lấy entity Users hiện tại dựa vào principal đã set trong filter */
    public Users getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !(auth.getPrincipal() instanceof UserDetails ud)) {
            throw new AccessDeniedException("Unauthenticated");
        }
        //  principal là username
        String email = ud.getUsername();
        try{
            return userRepository.findByEmail(email);
        } catch (UsernameNotFoundException e) {
            throw new UsernameNotFoundException("User not found");
        }
    }

    public UserDTO getMyProfile() {
        Users currentUser = getCurrentUser();
        return new UserDTO(
                currentUser.getId(),
                currentUser.getImageUrl(),
                currentUser.getEmail(),
                currentUser.getFullname(),
                currentUser.getCreateDate(),
                currentUser.getRole().getRoleName());
    }

    @Transactional
    @Override
    public Boolean updateUser(UserDTO userDTO) {
        Users currentUser = getCurrentUser();

        boolean changed = false;

        // update fullname if provided
        String newFullname = userDTO.getFullname();
        if (newFullname != null && !newFullname.isBlank()) {
            currentUser.setFullname(newFullname.trim());
            changed = true;
        }

        // update imageUrl if provided
        String newImageUrl = userDTO.getImageUrl();
        if (newImageUrl != null && !newImageUrl.isBlank()) {
            currentUser.setImageUrl(newImageUrl.trim());
            changed = true;
        }

        if (!changed) {
            return false; // nothing to update
        }

        userRepository.save(currentUser);
        return true;
    }
}
