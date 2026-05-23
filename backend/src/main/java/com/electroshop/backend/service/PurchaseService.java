package com.electroshop.backend.service;

import com.electroshop.backend.entity.Product;
import com.electroshop.backend.entity.PurchaseItem;
import com.electroshop.backend.entity.PurchaseOrder;
import com.electroshop.backend.repository.ProductRepository;
import com.electroshop.backend.repository.PurchaseRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PurchaseService {
    private final PurchaseRepository purchaseRepository;
    private final ProductRepository productRepository;

    public PurchaseService(PurchaseRepository purchaseRepository, ProductRepository productRepository) {
        this.purchaseRepository = purchaseRepository;
        this.productRepository = productRepository;
    }

    public PurchaseOrder create(PurchaseOrder order) {
        double total = 0.0;
        List<PurchaseItem> items = order.getItems();
        for (PurchaseItem it : items) {
            it.setSubtotal(it.getCost() * it.getQuantity());
            total += it.getSubtotal();
            Product p = productRepository.findById(it.getProductId()).orElse(null);
            if (p == null) {
                p = new Product();
                p.setName(it.getName());
                p.setPrice(it.getCost());
                p.setQuantity(it.getQuantity());
            } else {
                p.setQuantity(p.getQuantity() + it.getQuantity());
            }
            productRepository.save(p);
        }
        order.setTotal(total);
        return purchaseRepository.save(order);
    }
}
