package com.electroshop.backend.service;

import com.electroshop.backend.entity.User;
import com.electroshop.backend.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final com.electroshop.backend.repository.ShopRepository shopRepository;
    private final com.electroshop.backend.repository.SubscriptionPlanRepository planRepository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public UserService(UserRepository userRepository, 
                       com.electroshop.backend.repository.ShopRepository shopRepository,
                       com.electroshop.backend.repository.SubscriptionPlanRepository planRepository) {
        this.userRepository = userRepository;
        this.shopRepository = shopRepository;
        this.planRepository = planRepository;
    }

    public User register(User user, String shopName) {
        Optional<User> existing = userRepository.findByEmail(user.getEmail());
        if (existing.isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already registered");
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        if (user.getRole() == null) user.setRole("ADMIN");

        if (user.getShop() == null && shopName != null) {
            com.electroshop.backend.entity.Shop shop = new com.electroshop.backend.entity.Shop();
            shop.setName(shopName);
            
            // Set Free Plan as default
            planRepository.findAll().stream()
                    .filter(p -> "Free Plan".equalsIgnoreCase(p.getName()))
                    .findFirst()
                    .ifPresent(p -> {
                        shop.setPlan(p);
                        if (p.getDurationDays() != null) {
                            shop.setSubscriptionExpiresAt(java.time.LocalDateTime.now().plusDays(p.getDurationDays()));
                        }
                    });

            com.electroshop.backend.entity.Shop savedShop = shopRepository.save(shop);
            user.setShop(savedShop);
        }

        return userRepository.save(user);
    }

    public User register(User user) {
        return register(user, null);
    }

    public User login(String email, String rawPassword) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password"));
        if (!passwordEncoder.matches(rawPassword, user.getPassword())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password");
        }
        return user;
    }

    public java.util.List<User> getAllUsers(Long shopId) {
        return userRepository.findByShopId(shopId);
    }

    public void deleteUser(Long id, Long shopId) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
        if (!user.getShop().getId().equals(shopId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access denied to this user");
        }
        userRepository.delete(user);
    }
}
