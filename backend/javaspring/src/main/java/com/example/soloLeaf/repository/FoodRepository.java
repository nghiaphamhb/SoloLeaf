package com.example.soloLeaf.repository;

import com.example.soloLeaf.dto.searchPage.projection.FoodSearchRow;
import com.example.soloLeaf.entity.Food;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
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
        SELECT f FROM Food f
        WHERE (:q IS NULL OR LOWER(f.title) LIKE LOWER(CONCAT('%', :q, '%')))
    """)
    Page<Food> searchFoods(@Param("q") String q, Pageable pageable);

    @Query("""
    select new com.example.soloLeaf.dto.searchPage.projection.FoodSearchRow(
        f.id,
        f.image,
        f.title,
        f.price,
        f.isFreeShip,
        f.timeShip,
        r.id,
        r.title,
        r.image
    )
    from Food f
    join f.category c
    join c.menuRestaurants mr
    join mr.restaurant r
    where (:q is null or lower(f.title) like lower(concat('%', :q, '%')))
    order by r.id asc, f.id asc
""")
    List<FoodSearchRow> searchFoodsGrouped(@Param("q") String q);


}
