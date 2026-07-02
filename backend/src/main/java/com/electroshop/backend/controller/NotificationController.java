package com.electroshop.backend.controller;

import com.electroshop.backend.entity.Notification;
import com.electroshop.backend.service.NotificationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "${frontend.origin}")
public class NotificationController {
    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    private Long extractShopId(String shopIdHeader) {
        if (shopIdHeader == null || shopIdHeader.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Shop ID header missing");
        }
        return Long.parseLong(shopIdHeader);
    }

    @GetMapping
    public ResponseEntity<List<Notification>> getNotifications(@RequestHeader(value = "X-Shop-Id", required = false) String shopIdHeader) {
        Long shopId = extractShopId(shopIdHeader);
        return ResponseEntity.ok(notificationService.getNotificationsForShop(shopId));
    }

    @PostMapping("/demo")
    public ResponseEntity<Notification> createDemoNotification(@RequestHeader(value = "X-Shop-Id", required = false) String shopIdHeader, @RequestBody Map<String, String> body) {
        Long shopId = extractShopId(shopIdHeader);
        String title = body.getOrDefault("title", "Demo alert created");
        String message = body.getOrDefault("message", "This is a live example notification to test the page actions.");
        String type = body.getOrDefault("type", "info");
        return ResponseEntity.status(HttpStatus.CREATED).body(notificationService.createNotification(shopId, title, message, type));
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<Notification> markAsRead(@PathVariable Long id, @RequestHeader(value = "X-Shop-Id", required = false) String shopIdHeader) {
        Long shopId = extractShopId(shopIdHeader);
        return ResponseEntity.ok(notificationService.markAsRead(id, shopId));
    }

    @PutMapping("/read-all")
    public ResponseEntity<Void> markAllAsRead(@RequestHeader(value = "X-Shop-Id", required = false) String shopIdHeader) {
        Long shopId = extractShopId(shopIdHeader);
        notificationService.markAllAsRead(shopId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNotification(@PathVariable Long id, @RequestHeader(value = "X-Shop-Id", required = false) String shopIdHeader) {
        Long shopId = extractShopId(shopIdHeader);
        notificationService.deleteNotification(id, shopId);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/clear")
    public ResponseEntity<Void> clearAllNotifications(@RequestHeader(value = "X-Shop-Id", required = false) String shopIdHeader) {
        Long shopId = extractShopId(shopIdHeader);
        notificationService.deleteAllForShop(shopId);
        return ResponseEntity.noContent().build();
    }


}
