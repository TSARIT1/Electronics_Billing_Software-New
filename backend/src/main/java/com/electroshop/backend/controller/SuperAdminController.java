package com.electroshop.backend.controller;

import com.electroshop.backend.service.SuperAdminService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/super-admin")
@CrossOrigin(origins = "${frontend.origin}")
public class SuperAdminController {
    private final SuperAdminService service;

    public SuperAdminController(SuperAdminService service) {
        this.service = service;
    }

    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        return ResponseEntity.ok(service.getDashboardStats());
    }

    @GetMapping("/stores")
    public ResponseEntity<List<Map<String, Object>>> getAllStores() {
        return ResponseEntity.ok(service.getAllStoresWithDetails());
    }

    @PutMapping("/stores/{id}/toggle-status")
    public ResponseEntity<Map<String, Object>> toggleStoreStatus(@PathVariable Long id) {
        return ResponseEntity.ok(service.toggleStoreStatus(id));
    }

    @DeleteMapping("/stores/{id}")
    public ResponseEntity<Void> deleteStore(@PathVariable Long id) {
        service.deleteStore(id);
        return ResponseEntity.noContent().build();
    }
}
