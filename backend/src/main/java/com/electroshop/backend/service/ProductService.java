package com.electroshop.backend.service;

import com.electroshop.backend.entity.Product;
import com.electroshop.backend.repository.ProductRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class ProductService {
    private final ProductRepository repo;

    public ProductService(ProductRepository repo) {
        this.repo = repo;
    }

    public List<Product> listAll(Long shopId) {
        return repo.findByShopId(shopId);
    }

    public Product get(Long id, Long shopId) {
        Product p = repo.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found"));
        if (!p.getShop().getId().equals(shopId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access denied to this product");
        }
        return p;
    }

    public Product save(Product p) {
        if (p.getQuantity() == null) {
            p.setQuantity(0);
        }
        if (p.getMinStock() == null) {
            p.setMinStock(5);
        }
        if (p.getQuantity() < 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Product quantity cannot be negative");
        }
        if (p.getMinStock() < 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Minimum stock cannot be negative");
        }
        return repo.save(p);
    }

    public void delete(Long id, Long shopId) {
        Product p = get(id, shopId);
        repo.delete(p);
    }
}
