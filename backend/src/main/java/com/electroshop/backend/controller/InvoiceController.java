package com.electroshop.backend.controller;

import com.electroshop.backend.entity.Invoice;
import com.electroshop.backend.repository.InvoiceRepository;
import com.electroshop.backend.service.InvoiceService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/invoices")
@CrossOrigin(origins = "${frontend.origin}")
public class InvoiceController {
    private final InvoiceService invoiceService;
    private final InvoiceRepository invoiceRepository;

    public InvoiceController(InvoiceService invoiceService, InvoiceRepository invoiceRepository) {
        this.invoiceService = invoiceService;
        this.invoiceRepository = invoiceRepository;
    }

    @PostMapping
    public ResponseEntity<Invoice> create(@RequestBody Invoice invoice, @RequestHeader("X-Shop-Id") Long shopId) {
        com.electroshop.backend.entity.Shop shop = new com.electroshop.backend.entity.Shop();
        shop.setId(shopId);
        invoice.setShop(shop);
        return ResponseEntity.ok(invoiceService.create(invoice, shopId));
    }

    @GetMapping
    public ResponseEntity<List<Invoice>> list(@RequestHeader("X-Shop-Id") Long shopId) {
        return ResponseEntity.ok(invoiceRepository.findByShopId(shopId));
    }
}
