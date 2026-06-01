package com.electroshop.backend;

import com.electroshop.backend.entity.User;
import com.electroshop.backend.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@SpringBootApplication
public class BackendApplication {
    public static void main(String[] args) {
        SpringApplication.run(BackendApplication.class, args);
    }

    @Bean
    public CommandLineRunner seedDefaultUser(UserRepository userRepository) {
        return args -> {
            if (userRepository.count() == 0) {
                BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
                User admin = new User();
                admin.setName("Administrator");
                admin.setEmail("admin@local.test");
                admin.setPhone("");
                admin.setRole("ADMIN");
                admin.setPassword(encoder.encode("password"));
                userRepository.save(admin);
                System.out.println("Created default admin: admin@local.test / password");
            }
        };
    }
}
