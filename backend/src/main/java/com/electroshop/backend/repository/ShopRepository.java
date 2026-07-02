package com.electroshop.backend.repository;

import com.electroshop.backend.entity.Shop;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ShopRepository extends JpaRepository<Shop, Long> {
    boolean existsByPlanId(Long planId);
}
