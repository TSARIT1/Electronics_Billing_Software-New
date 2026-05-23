package com.electroshop.backend.service;

import com.electroshop.backend.entity.Invoice;
import com.electroshop.backend.entity.InvoiceItem;
import com.electroshop.backend.entity.Product;
import com.electroshop.backend.repository.InvoiceRepository;
import com.electroshop.backend.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class InvoiceService {
    private final InvoiceRepository invoiceRepository;
    private final ProductRepository productRepository;

    public InvoiceService(InvoiceRepository invoiceRepository, ProductRepository productRepository) {
        this.invoiceRepository = invoiceRepository;
        this.productRepository = productRepository;
    }

    public Invoice create(Invoice invoice) {
        // calculate subtotals and reduce inventory
        double total = 0.0;
        List<InvoiceItem> items = invoice.getItems();
        for (InvoiceItem it : items) {
            Product p = productRepository.findById(it.getProductId()).orElseThrow(() -> new RuntimeException("Product not found"));
            it.setName(p.getName());
            it.setPrice(p.getPrice());
            it.setSubtotal(it.getPrice() * it.getQuantity());
            total += it.getSubtotal();
            p.setQuantity(p.getQuantity() - it.getQuantity());
            productRepository.save(p);
        }
        invoice.setTotal(total);
        return invoiceRepository.save(invoice);
    }
}
