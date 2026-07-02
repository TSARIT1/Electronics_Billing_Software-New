package com.electroshop.backend.repository;

import com.electroshop.backend.entity.PurchaseOrder;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PurchaseRepository extends JpaRepository<PurchaseOrder, Long> {
    java.util.List<PurchaseOrder> findByShopId(Long shopId);
}
