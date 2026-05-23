package com.electroshop.backend.controller;

import com.electroshop.backend.entity.PurchaseOrder;
import com.electroshop.backend.repository.PurchaseRepository;
import com.electroshop.backend.service.PurchaseService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
    public ResponseEntity<List<PurchaseOrder>> list() {
        return ResponseEntity.ok(purchaseRepository.findAll());
    }
}
