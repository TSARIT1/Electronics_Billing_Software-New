package com.electroshop.backend.controller;

import com.electroshop.backend.entity.SubscriptionPlan;
import com.electroshop.backend.service.SubscriptionPlanService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/super-admin/plans")
@CrossOrigin(origins = "${frontend.origin}")
public class SubscriptionPlanController {
    private final SubscriptionPlanService service;

    public SubscriptionPlanController(SubscriptionPlanService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<SubscriptionPlan>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<SubscriptionPlan> getById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getById(id));
    }

    @PostMapping
    public ResponseEntity<SubscriptionPlan> create(@RequestBody SubscriptionPlan plan) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(plan));
    }

    @PutMapping("/{id}")
    public ResponseEntity<SubscriptionPlan> update(@PathVariable Long id, @RequestBody SubscriptionPlan plan) {
        return ResponseEntity.ok(service.update(id, plan));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/toggle")
    public ResponseEntity<SubscriptionPlan> toggleStatus(@PathVariable Long id) {
        return ResponseEntity.ok(service.toggleStatus(id));
    }
}
