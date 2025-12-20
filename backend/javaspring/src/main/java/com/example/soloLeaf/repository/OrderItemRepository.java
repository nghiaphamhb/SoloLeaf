package com.example.soloLeaf.repository;

import com.example.soloLeaf.entity.OrderItem;
import com.example.soloLeaf.entity.keys.IdOrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, IdOrderItem> {
}
