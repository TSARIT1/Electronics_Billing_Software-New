package com.electroshop.backend.repository;

import com.electroshop.backend.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository extends JpaRepository<Product, Long> {
    java.util.List<Product> findByShopId(Long shopId);
    java.util.Optional<Product> findBySkuAndShopId(String sku, Long shopId);
    java.util.List<Product> findByShopIdAndNameContainingIgnoreCaseOrShopIdAndSkuContainingIgnoreCase(Long shopId1, String name, Long shopId2, String sku);
}
