package com.electroshop.backend;

import com.electroshop.backend.repository.InvoiceRepository;
import com.electroshop.backend.repository.ProductRepository;
import com.electroshop.backend.repository.ShopRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
public class DatabaseCountTest {
    @Autowired
    private ShopRepository shopRepository;
    @Autowired
    private InvoiceRepository invoiceRepository;
    @Autowired
    private ProductRepository productRepository;

    @Test
    public void printCounts() {
        System.out.println("=== DATABASE COUNTS ===");
        System.out.println("Shops: " + shopRepository.count());
        System.out.println("Invoices: " + invoiceRepository.count());
        System.out.println("Products: " + productRepository.count());
        if (shopRepository.count() > 0) {
            var shops = shopRepository.findAll();
            System.out.println("First Shop ID: " + shops.get(0).getId());
            System.out.println("First Shop Name: " + shops.get(0).getName());
            
            var invoices = invoiceRepository.findAll();
            if (!invoices.isEmpty()) {
                System.out.println("First Invoice ID: " + invoices.get(0).getId());
                System.out.println("First Invoice Shop: " + (invoices.get(0).getShop() != null ? invoices.get(0).getShop().getId() : "null"));
                System.out.println("First Invoice Purchaser: " + invoices.get(0).getPurchaser());
            }
        }
        System.out.println("=======================");
    }
}
