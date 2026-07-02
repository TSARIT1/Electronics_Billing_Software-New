package com.electroshop.backend.service;

import com.electroshop.backend.entity.Invoice;
import com.electroshop.backend.entity.InvoiceItem;
import com.electroshop.backend.entity.Product;
import com.electroshop.backend.repository.InvoiceRepository;
import com.electroshop.backend.repository.ProductRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class InvoiceService {
    private final InvoiceRepository invoiceRepository;
    private final ProductRepository productRepository;

    public InvoiceService(InvoiceRepository invoiceRepository, ProductRepository productRepository) {
        this.invoiceRepository = invoiceRepository;
        this.productRepository = productRepository;
    }

    public Invoice create(Invoice invoice, Long shopId) {
        List<InvoiceItem> items = invoice.getItems();
        if (items == null || items.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invoice must contain at least one item");
        }

        double total = 0.0;
        for (InvoiceItem it : items) {
            if (it == null) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invoice item cannot be null");
            }

            if (it.getQuantity() == null || it.getQuantity() <= 0) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invoice item quantity must be greater than zero");
            }

            Double itemPrice = it.getPrice();

            if (it.getProductId() != null) {
                Product p = productRepository.findById(it.getProductId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found"));
                
                if (p.getShop() == null || !p.getShop().getId().equals(shopId)) {
                    throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access denied to product: " + p.getName());
                }

                Integer availableQuantity = p.getQuantity();
                if (availableQuantity == null) {
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Product stock is not configured");
                }
                if (availableQuantity < it.getQuantity()) {
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Insufficient stock for product: " + p.getName());
                }

                it.setName(p.getName());
                itemPrice = p.getPrice();
                it.setPrice(itemPrice);
                p.setQuantity(availableQuantity - it.getQuantity());
                productRepository.save(p);
            } else {
                if (it.getName() == null || it.getName().isBlank()) {
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invoice item name is required when productId is not provided");
                }
                if (itemPrice == null) {
                    itemPrice = 0.0;
                    it.setPrice(itemPrice);
                }
            }

            if (it.getSubtotal() == null) {
                it.setSubtotal(itemPrice * it.getQuantity());
            }
            total += it.getSubtotal();
        }
        invoice.setTotal(total);
        if (invoice.getGrandTotal() == null || invoice.getGrandTotal() == 0.0) {
            double cgst = invoice.getCgst() != null ? invoice.getCgst() : 0.0;
            double sgst = invoice.getSgst() != null ? invoice.getSgst() : 0.0;
            double igst = invoice.getIgst() != null ? invoice.getIgst() : 0.0;
            double taxRate = cgst + sgst + igst;
            double tax = (total * taxRate) / 100.0;

            double spotDisc = invoice.getSpotDiscount() != null ? invoice.getSpotDiscount() : 0.0;
            double splSeaDisc = invoice.getSplSeaDiscount() != null ? invoice.getSplSeaDiscount() : 0.0;
            double otherDisc = invoice.getOtherDiscount() != null ? invoice.getOtherDiscount() : 0.0;
            double discount = spotDisc + splSeaDisc + otherDisc;

            double roundOff = invoice.getRoundOff() != null ? invoice.getRoundOff() : 0.0;

            invoice.setGrandTotal(total + tax - discount + roundOff);
        }
        return invoiceRepository.save(invoice);
    }

    public List<Invoice> listAll(Long shopId) {
        return invoiceRepository.findByShopId(shopId);
    }
}
