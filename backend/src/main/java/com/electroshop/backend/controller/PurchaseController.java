package com.electroshop.backend.controller;

import com.electroshop.backend.entity.PurchaseOrder;
import com.electroshop.backend.repository.PurchaseRepository;
import com.electroshop.backend.service.PurchaseService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/purchases")
@CrossOrigin(origins = "${frontend.origin}")
public class PurchaseController {
    private final PurchaseService purchaseService;
    private final PurchaseRepository purchaseRepository;

    public PurchaseController(PurchaseService purchaseService, PurchaseRepository purchaseRepository) {
        this.purchaseService = purchaseService;
        this.purchaseRepository = purchaseRepository;
    }

    @PostMapping
    public ResponseEntity<PurchaseOrder> create(@RequestBody PurchaseOrder order) {
        return ResponseEntity.ok(purchaseService.create(order));
    }

    @GetMapping
    public ResponseEntity<List<PurchaseOrder>> list(@RequestParam(value = "search", required = false) String search) {
        List<PurchaseOrder> orders = purchaseRepository.findAll();
        if (search == null || search.isBlank()) {
            return ResponseEntity.ok(orders);
        }

        String query = search.trim().toLowerCase();
        return ResponseEntity.ok(orders.stream()
            .filter(order -> matches(String.valueOf(order.getId()), query)
                || matches(order.getSupplier(), query)
                || matches(order.getStatus(), query)
                || matches(order.getCreatedAt() != null ? order.getCreatedAt().toString() : null, query)
                || matches(order.getTotal() != null ? String.valueOf(order.getTotal()) : null, query))
            .toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PurchaseOrder> get(@PathVariable Long id) {
        return ResponseEntity.ok(purchaseRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Purchase order not found")));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PurchaseOrder> update(@PathVariable Long id, @RequestBody PurchaseOrder order) {
        return ResponseEntity.ok(purchaseService.update(id, order));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        purchaseService.delete(id);
        return ResponseEntity.noContent().build();
    }

    private boolean matches(String value, String query) {
        return value != null && value.toLowerCase().contains(query);
    }
}
