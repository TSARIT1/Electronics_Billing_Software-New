package com.electroshop.backend.controller;

import com.electroshop.backend.entity.Product;
import com.electroshop.backend.service.ProductService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "${frontend.origin}")
public class ProductController {
    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping
    public ResponseEntity<List<Product>> list() {
        return ResponseEntity.ok(productService.listAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Product> get(@PathVariable Long id) {
        return ResponseEntity.ok(productService.get(id));
    }

    @PostMapping
    public ResponseEntity<Product> create(@RequestBody Product p) {
        return ResponseEntity.ok(productService.save(p));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Product> update(@PathVariable Long id, @RequestBody Product p) {
        p.setId(id);
        return ResponseEntity.ok(productService.save(p));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        productService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
