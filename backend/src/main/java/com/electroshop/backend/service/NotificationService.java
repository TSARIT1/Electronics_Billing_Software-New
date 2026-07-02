package com.electroshop.backend.service;

import com.electroshop.backend.entity.Notification;
import com.electroshop.backend.entity.Shop;
import com.electroshop.backend.repository.NotificationRepository;
import com.electroshop.backend.repository.ShopRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class NotificationService {
    private final NotificationRepository notificationRepository;
    private final ShopRepository shopRepository;

    public NotificationService(NotificationRepository notificationRepository, ShopRepository shopRepository) {
        this.notificationRepository = notificationRepository;
        this.shopRepository = shopRepository;
    }

    public List<Notification> getNotificationsForShop(Long shopId) {
        return notificationRepository.findByShopIdOrderByCreatedAtDesc(shopId);
    }

    public Notification createNotification(Long shopId, String title, String message, String type) {
        Shop shop = shopRepository.findById(shopId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Shop not found"));

        Notification notification = new Notification();
        notification.setShop(shop);
        notification.setTitle(title);
        notification.setMessage(message);
        notification.setType(type);
        notification.setRead(false);

        return notificationRepository.save(notification);
    }

    public Notification markAsRead(Long id, Long shopId) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Notification not found"));
        
        if (!notification.getShop().getId().equals(shopId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access denied");
        }
        
        notification.setRead(true);
        return notificationRepository.save(notification);
    }

    @Transactional
    public void markAllAsRead(Long shopId) {
        List<Notification> notifications = notificationRepository.findByShopIdOrderByCreatedAtDesc(shopId);
        notifications.forEach(n -> n.setRead(true));
        notificationRepository.saveAll(notifications);
    }

    public void deleteNotification(Long id, Long shopId) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Notification not found"));

        if (!notification.getShop().getId().equals(shopId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access denied");
        }

        notificationRepository.delete(notification);
    }

    @Transactional
    public void deleteAllForShop(Long shopId) {
        notificationRepository.deleteByShopId(shopId);
    }
}
