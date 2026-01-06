package com.example.soloLeaf.repository;

import com.example.soloLeaf.entity.Food;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FoodRepository extends JpaRepository<Food, Integer> {
    // Returns (resId, restaurantTitle) for a given foodId
    @Query("""
        select mr.restaurant.id, mr.restaurant.title
        from Food f
        join f.category c
        join c.menuRestaurants mr
        where f.id = :foodId
    """)
    List<Object[]> findRestaurantInfoByFoodId(@Param("foodId") int foodId);

    @Query("""
        SELECT f
        FROM Food f
        JOIN f.category c
        JOIN c.menuRestaurants mr
        WHERE (:q IS NULL OR LOWER(f.title) LIKE LOWER(CONCAT('%', :q, '%')))
          AND (:restaurantId IS NULL OR mr.restaurant.id = :restaurantId)
          AND (:minPrice IS NULL OR f.price >= :minPrice)
          AND (:maxPrice IS NULL OR f.price <= :maxPrice)
          AND (:freeShip IS NULL OR f.isFreeShip = :freeShip)
    """)
    Page<Food> searchFoods(
            @Param("q") String q,
            @Param("restaurantId") Integer restaurantId,
            @Param("minPrice") Double minPrice,
            @Param("maxPrice") Double maxPrice,
            @Param("freeShip") Boolean freeShip,
            Pageable pageable
    );



}
