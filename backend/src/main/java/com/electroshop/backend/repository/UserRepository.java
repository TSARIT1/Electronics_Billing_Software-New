package com.electroshop.backend.repository;

import com.electroshop.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    java.util.Optional<User> findByEmail(String email);
    java.util.List<User> findByShopId(Long shopId);
}
