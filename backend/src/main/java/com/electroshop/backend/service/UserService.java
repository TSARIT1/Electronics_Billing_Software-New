package com.electroshop.backend.service;

import com.electroshop.backend.entity.User;
import com.electroshop.backend.repository.UserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User register(User user) {
        Optional<User> existing = userRepository.findByEmail(user.getEmail());
        if (existing.isPresent()) throw new RuntimeException("Email already registered");
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        if (user.getRole() == null) user.setRole("ADMIN");
        return userRepository.save(user);
    }

    public User login(String email, String rawPassword) {
        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("Invalid email or password"));
        if (!passwordEncoder.matches(rawPassword, user.getPassword())) throw new RuntimeException("Invalid email or password");
        return user;
    }
}
