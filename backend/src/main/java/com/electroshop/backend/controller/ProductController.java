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
    public ResponseEntity<List<Product>> list(@RequestParam(value = "search", required = false) String search, @RequestHeader("X-Shop-Id") Long shopId) {
        List<Product> products = productService.listAll(shopId);
        if (search == null || search.isBlank()) {
            return ResponseEntity.ok(products);
        }

        String query = search.trim().toLowerCase();
        return ResponseEntity.ok(products.stream()
            .filter(product -> matches(product.getName(), query)
                || matches(product.getSku(), query)
                || matches(product.getBrand(), query)
                || matches(product.getCategory(), query)
                || matches(product.getDescription(), query)
                || matches(product.getHsn(), query))
            .toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Product> get(@PathVariable Long id, @RequestHeader("X-Shop-Id") Long shopId) {
        return ResponseEntity.ok(productService.get(id, shopId));
    }

    @PostMapping
    public ResponseEntity<Product> create(@RequestBody Product p, @RequestHeader("X-Shop-Id") Long shopId) {
        com.electroshop.backend.entity.Shop shop = new com.electroshop.backend.entity.Shop();
        shop.setId(shopId);
        p.setShop(shop);
        return ResponseEntity.ok(productService.save(p));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Product> update(@PathVariable Long id, @RequestBody Product p, @RequestHeader("X-Shop-Id") Long shopId) {
        p.setId(id);
        com.electroshop.backend.entity.Shop shop = new com.electroshop.backend.entity.Shop();
        shop.setId(shopId);
        p.setShop(shop);
        return ResponseEntity.ok(productService.save(p));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id, @RequestHeader("X-Shop-Id") Long shopId) {
        productService.delete(id, shopId);
        return ResponseEntity.noContent().build();
    }

    private boolean matches(String value, String query) {
        return value != null && value.toLowerCase().contains(query);
    }
}
