package com.example.soloLeaf.repository;

import com.example.soloLeaf.entity.Promo;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PromoRepository extends JpaRepository<Promo, Integer> {
    List<Promo> findByUsedAtIsNull();
    boolean existsByCode(String code);
    Optional<Promo> findByCode(String code);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select p from Promo p where p.code = :code")
    Optional<Promo> findByCodeForUpdate(@Param("code") String code);
}
