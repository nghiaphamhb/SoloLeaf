package com.example.soloLeaf.repository;

import com.example.soloLeaf.entity.Restaurant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RestaurantRepository extends JpaRepository<Restaurant, Integer> {
    @Query("select r.id from Restaurant r")
    List<Integer> findAllIds();
}
