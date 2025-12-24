package com.example.soloLeaf.repository;

import com.example.soloLeaf.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Integer> {
    Optional<Order> findByStripeSessionId(String stripeSessionId);

    // query orders by userId and Order by createDate desc
    List<Order> findByUser_IdOrderByCreateDateDesc(int userId);
}
