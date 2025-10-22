package com.example.soloLeaf.service;

import com.example.soloLeaf.dto.UserDTO;
import com.example.soloLeaf.entity.Users;
import com.example.soloLeaf.repository.UserRepository;
import com.example.soloLeaf.service.imp.UserServiceImp;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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
                    user.getUsername(),
                    user.getFullname(),
                    user.getCreateDate()
            );
            listUserDTO.add(userDTO);
        }
        return listUserDTO;
    }
}
