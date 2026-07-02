package com.electroshop.backend.repository;

import com.electroshop.backend.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByShopIdOrderByCreatedAtDesc(Long shopId);
    void deleteByShopId(Long shopId);
}
