package com.electroshop.backend.controller;

import com.electroshop.backend.dto.UserDto;
import com.electroshop.backend.entity.User;
import com.electroshop.backend.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "${frontend.origin}")
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public List<UserDto> getAllUsers(@RequestHeader("X-Shop-Id") Long shopId) {
        return userService.getAllUsers(shopId).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id, @RequestHeader("X-Shop-Id") Long shopId) {
        userService.deleteUser(id, shopId);
        return ResponseEntity.ok().build();
    }

    private UserDto toDto(User user) {
        UserDto dto = new UserDto();
        dto.setId(user.getId());
        dto.setName(user.getName());
        dto.setEmail(user.getEmail());
        dto.setPhone(user.getPhone());
        dto.setRole(user.getRole());
        if (user.getShop() != null) {
            dto.setShopId(user.getShop().getId());
            dto.setShopName(user.getShop().getName());
            if (user.getShop().getPlan() != null) {
                dto.setPlanName(user.getShop().getPlan().getName());
            } else {
                dto.setPlanName("No Plan");
            }
            dto.setSubscriptionExpiresAt(user.getShop().getSubscriptionExpiresAt());
        }
        return dto;
    }
}
