package com.example.soloLeaf.repository;

import com.example.soloLeaf.entity.PushSubscription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PushSubscriptionRepository extends JpaRepository<PushSubscription, Long>{
    Optional<PushSubscription> findByEndpoint(String endpoint);
    List<PushSubscription> findAllByUserIdAndActiveTrue(Long userId);
}
