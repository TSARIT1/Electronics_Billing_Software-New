package com.electroshop.backend.service;

import com.electroshop.backend.entity.Product;
import com.electroshop.backend.entity.PurchaseItem;
import com.electroshop.backend.entity.PurchaseOrder;
import com.electroshop.backend.repository.ProductRepository;
import com.electroshop.backend.repository.PurchaseRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class PurchaseService {
    private final PurchaseRepository purchaseRepository;
    private final ProductRepository productRepository;

    public PurchaseService(PurchaseRepository purchaseRepository, ProductRepository productRepository) {
        this.purchaseRepository = purchaseRepository;
        this.productRepository = productRepository;
    }

    @Transactional
    public PurchaseOrder create(PurchaseOrder order) {
        if (order.getStatus() == null || order.getStatus().isBlank()) {
            order.setStatus("Pending");
        }
        double total = 0.0;
        List<PurchaseItem> items = order.getItems();
        if (items == null || items.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Purchase order must contain at least one item");
        }
        for (PurchaseItem it : items) {
            if (it.getQuantity() == null || it.getQuantity() <= 0) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Purchase item quantity must be greater than zero");
            }
            if (it.getCost() == null) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Purchase item cost is required");
            }
            it.setSubtotal(it.getCost() * it.getQuantity());
            total += it.getSubtotal();
            Product p = productRepository.findById(it.getProductId()).orElse(null);
            if (p == null) {
                p = new Product();
                p.setName(it.getName());
                p.setCostPrice(it.getCost());
                p.setPrice(it.getCost());
                p.setQuantity(it.getQuantity());
            } else {
                if (p.getQuantity() == null) {
                    p.setQuantity(0);
                }
                p.setQuantity(p.getQuantity() + it.getQuantity());
            }
            Product savedProduct = productRepository.save(p);
            it.setProductId(savedProduct.getId());
        }
        order.setTotal(total);
        return purchaseRepository.save(order);
    }

    @Transactional
    public PurchaseOrder update(Long id, PurchaseOrder incoming) {
        PurchaseOrder existing = purchaseRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Purchase order not found"));

        if (incoming.getSupplier() != null && !incoming.getSupplier().isBlank()) {
            existing.setSupplier(incoming.getSupplier());
        }
        if (incoming.getStatus() != null && !incoming.getStatus().isBlank()) {
            existing.setStatus(incoming.getStatus());
        }

        return purchaseRepository.save(existing);
    }

    @Transactional
    public void delete(Long id) {
        PurchaseOrder existing = purchaseRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Purchase order not found"));

        List<PurchaseItem> items = existing.getItems();
        for (PurchaseItem it : items) {
            if (it.getProductId() == null) {
                continue;
            }
            Product product = productRepository.findById(it.getProductId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found for purchase item"));
            int available = product.getQuantity() == null ? 0 : product.getQuantity();
            int quantity = it.getQuantity() == null ? 0 : it.getQuantity();
            if (available < quantity) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cannot delete purchase order because stock would become negative for product: " + product.getName());
            }
            product.setQuantity(available - quantity);
            productRepository.save(product);
        }

        purchaseRepository.delete(existing);
    }
}
