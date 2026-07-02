package com.electroshop.backend.service;

import com.electroshop.backend.repository.ShopRepository;
import com.electroshop.backend.repository.UserRepository;
import com.electroshop.backend.repository.SubscriptionPlanRepository;
import com.electroshop.backend.repository.ProductRepository;
import com.electroshop.backend.repository.InvoiceRepository;
import com.electroshop.backend.repository.PurchaseRepository;
import com.electroshop.backend.repository.NotificationRepository;
import com.electroshop.backend.entity.Shop;
import com.electroshop.backend.entity.User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class SuperAdminService {
    private final ShopRepository shopRepo;
    private final UserRepository userRepo;
    private final SubscriptionPlanRepository planRepo;
    private final ProductRepository productRepo;
    private final InvoiceRepository invoiceRepo;
    private final PurchaseRepository purchaseRepo;
    private final NotificationRepository notificationRepo;

    public SuperAdminService(ShopRepository shopRepo,
                             UserRepository userRepo,
                             SubscriptionPlanRepository planRepo,
                             ProductRepository productRepo,
                             InvoiceRepository invoiceRepo,
                             PurchaseRepository purchaseRepo,
                             NotificationRepository notificationRepo) {
        this.shopRepo = shopRepo;
        this.userRepo = userRepo;
        this.planRepo = planRepo;
        this.productRepo = productRepo;
        this.invoiceRepo = invoiceRepo;
        this.purchaseRepo = purchaseRepo;
        this.notificationRepo = notificationRepo;
    }

    public Map<String, Object> getDashboardStats() {
        Map<String, Object> stats = new LinkedHashMap<>();

        List<Shop> allShops = shopRepo.findAll();
        List<User> allUsers = userRepo.findAll();

        stats.put("totalStores", allShops.size());
        stats.put("totalUsers", allUsers.size());

        // New this month
        LocalDateTime startOfMonth = LocalDateTime.now().withDayOfMonth(1).withHour(0).withMinute(0).withSecond(0);
        long newThisMonth = allShops.stream()
                .filter(s -> s.getCreatedAt() != null && s.getCreatedAt().isAfter(startOfMonth))
                .count();
        stats.put("newThisMonth", newThisMonth);

        // Subscription distribution
        Map<String, Long> planDistribution = allShops.stream()
                .collect(Collectors.groupingBy(
                        s -> s.getPlan() != null ? s.getPlan().getName() : "No Plan",
                        Collectors.counting()
                ));
        stats.put("subscriptionDistribution", planDistribution);

        return stats;
    }

    public List<Map<String, Object>> getAllStoresWithDetails() {
        List<Shop> shops = shopRepo.findAll();
        List<User> allUsers = userRepo.findAll();

        return shops.stream().map(shop -> {
            Map<String, Object> storeData = new LinkedHashMap<>();
            storeData.put("id", shop.getId());
            storeData.put("name", shop.getName());
            storeData.put("address", shop.getAddress());
            storeData.put("referredBy", shop.getReferredBy());
            storeData.put("status", shop.getStatus());
            storeData.put("planName", shop.getPlan() != null ? shop.getPlan().getName() : "No Plan");
            storeData.put("createdAt", shop.getCreatedAt());

            // Find users in this shop
            List<User> shopUsers = allUsers.stream()
                    .filter(u -> u.getShop() != null && u.getShop().getId().equals(shop.getId()))
                    .collect(Collectors.toList());

            storeData.put("userCount", shopUsers.size());

            // Find the admin/manager of this shop
            Optional<User> manager = shopUsers.stream()
                    .filter(u -> "ADMIN".equals(u.getRole()))
                    .findFirst();

            if (manager.isPresent()) {
                storeData.put("managerName", manager.get().getName());
                storeData.put("managerEmail", manager.get().getEmail());
                storeData.put("managerPhone", manager.get().getPhone());
            } else if (!shopUsers.isEmpty()) {
                User first = shopUsers.get(0);
                storeData.put("managerName", first.getName());
                storeData.put("managerEmail", first.getEmail());
                storeData.put("managerPhone", first.getPhone());
            } else {
                storeData.put("managerName", "—");
                storeData.put("managerEmail", "—");
                storeData.put("managerPhone", "—");
            }

            return storeData;
        }).collect(Collectors.toList());
    }

    public Map<String, Object> toggleStoreStatus(Long id) {
        Shop shop = shopRepo.findById(id).orElseThrow(() -> new RuntimeException("Store not found"));
        shop.setStatus("ACTIVE".equals(shop.getStatus()) ? "INACTIVE" : "ACTIVE");
        shopRepo.save(shop);
        
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Status toggled successfully");
        response.put("newStatus", shop.getStatus());
        return response;
    }

    @Transactional
    public void deleteStore(Long id) {
        Shop shop = shopRepo.findById(id).orElseThrow(() -> new RuntimeException("Store not found"));
        
        // Delete all invoices belonging to this shop
        invoiceRepo.deleteAll(invoiceRepo.findByShopId(id));
        
        // Delete all purchase orders belonging to this shop
        purchaseRepo.deleteAll(purchaseRepo.findByShopId(id));
        
        // Delete all products belonging to this shop
        productRepo.deleteAll(productRepo.findByShopId(id));
        
        // Delete all notifications belonging to this shop
        notificationRepo.deleteByShopId(id);
        
        // Delete all users belonging to this shop
        userRepo.deleteAll(userRepo.findByShopId(id));
        
        // Finally delete the shop itself
        shopRepo.delete(shop);
    }
}
