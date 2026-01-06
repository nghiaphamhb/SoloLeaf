package com.example.soloLeaf.repository;

import com.example.soloLeaf.dto.RestaurantDTO;
import com.example.soloLeaf.entity.Restaurant;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RestaurantRepository extends JpaRepository<Restaurant, Integer> {
    @Query("select r.id from Restaurant r")
    List<Integer> findAllIds();

    @Query("""
        select distinct new com.example.soloLeaf.dto.RestaurantDTO(r.id, r.title)
        from Food f
        join f.category c
        join c.menuRestaurants mr
        join mr.restaurant r
        where (:q is null or lower(f.title) like lower(concat('%', :q, '%')))
        order by r.title asc
    """)
    List<RestaurantDTO> findTabsByFoodQuery(@Param("q") String q, Pageable pageable);
}
