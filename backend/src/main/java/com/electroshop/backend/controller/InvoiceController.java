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
    public ResponseEntity<Invoice> create(@RequestBody Invoice invoice) {
        return ResponseEntity.ok(invoiceService.create(invoice));
    }

    @GetMapping
    public ResponseEntity<List<Invoice>> list() {
        return ResponseEntity.ok(invoiceRepository.findAll());
    }
}
