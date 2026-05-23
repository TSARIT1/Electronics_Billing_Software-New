package com.electroshop.backend.service;

import com.electroshop.backend.entity.Product;
import com.electroshop.backend.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductService {
    private final ProductRepository repo;

    public ProductService(ProductRepository repo) {
        this.repo = repo;
    }

    public List<Product> listAll() {
        return repo.findAll();
    }

    public Product get(Long id) {
        return repo.findById(id).orElseThrow(() -> new RuntimeException("Product not found"));
    }

    public Product save(Product p) {
        return repo.save(p);
    }

    public void delete(Long id) {
        repo.deleteById(id);
    }
}
