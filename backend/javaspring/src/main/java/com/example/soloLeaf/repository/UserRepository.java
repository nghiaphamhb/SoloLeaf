package com.example.soloLeaf.repository;

import com.example.soloLeaf.entity.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<Users, Integer> {
    /**
     * select * from user  where username='' and password = ''
     */
//    public List<Users> findByUsernameAndPassword(String userName, String password);

    public Users findByEmail(String username);
}
