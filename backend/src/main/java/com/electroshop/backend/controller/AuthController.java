package com.electroshop.backend.controller;

import com.electroshop.backend.dto.LoginRequest;
import com.electroshop.backend.dto.RegisterRequest;
import com.electroshop.backend.dto.UserDto;
import com.electroshop.backend.entity.User;
import com.electroshop.backend.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "${frontend.origin}")
public class AuthController {
    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<UserDto> register(@RequestBody RegisterRequest request) {
        if (request.getConfirmPassword() == null || !request.getConfirmPassword().equals(request.getPassword())) {
            return ResponseEntity.badRequest().build();
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());
        user.setPassword(request.getPassword());

        User u = userService.register(user);
        u.setPassword(null);
        return ResponseEntity.status(HttpStatus.CREATED).body(toDto(u));
    }

    @PostMapping("/login")
    public ResponseEntity<UserDto> login(@RequestBody LoginRequest body) {
        String email = body.getEmail();
        String password = body.getPassword();
        User u = userService.login(email, password);
        u.setPassword(null);
        return ResponseEntity.ok(toDto(u));
    }

    private UserDto toDto(User user) {
        UserDto dto = new UserDto();
        dto.setId(user.getId());
        dto.setName(user.getName());
        dto.setEmail(user.getEmail());
        dto.setPhone(user.getPhone());
        dto.setRole(user.getRole());
        return dto;
    }
}
