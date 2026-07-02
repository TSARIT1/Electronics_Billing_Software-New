package com.electroshop.backend.service;

import com.electroshop.backend.entity.Invoice;
import com.electroshop.backend.entity.InvoiceItem;
import com.electroshop.backend.entity.Product;
import com.electroshop.backend.entity.Shop;
import org.springframework.web.server.ResponseStatusException;
import com.electroshop.backend.repository.InvoiceRepository;
import com.electroshop.backend.repository.ProductRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class InvoiceServiceTest {

    @Mock
    private InvoiceRepository invoiceRepository;

    @Mock
    private ProductRepository productRepository;

    @InjectMocks
    private InvoiceService invoiceService;

    @Test
    void createKeepsProductAtZeroAndMarksItOutOfStock() {
        Product product = new Product();
        product.setId(1L);
        product.setName("Laptop");
        product.setPrice(50000.0);
        product.setQuantity(2);
        Shop shop = new Shop();
        shop.setId(1L);
        product.setShop(shop);

        InvoiceItem item = new InvoiceItem();
        item.setProductId(1L);
        item.setQuantity(2);

        Invoice invoice = new Invoice();
        invoice.setItems(List.of(item));

        when(productRepository.findById(1L)).thenReturn(Optional.of(product));
        when(productRepository.save(any(Product.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(invoiceRepository.save(any(Invoice.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Invoice savedInvoice = invoiceService.create(invoice, 1L);

        assertEquals(0, product.getQuantity());
        assertEquals("Out of Stock", product.getStatus());
        assertEquals(100000.0, savedInvoice.getTotal());
        verify(productRepository).save(product);
        verify(invoiceRepository).save(invoice);
    }

    @Test
    void createRejectsOverselling() {
        Product product = new Product();
        product.setId(1L);
        product.setName("Phone");
        product.setPrice(20000.0);
        product.setQuantity(1);
        Shop shop = new Shop();
        shop.setId(1L);
        product.setShop(shop);

        InvoiceItem item = new InvoiceItem();
        item.setProductId(1L);
        item.setQuantity(2);

        Invoice invoice = new Invoice();
        invoice.setItems(List.of(item));

        when(productRepository.findById(1L)).thenReturn(Optional.of(product));

        ResponseStatusException exception = assertThrows(ResponseStatusException.class, () -> invoiceService.create(invoice, 1L));

        assertEquals("Insufficient stock for product: Phone", exception.getReason());
        verify(productRepository, never()).save(any(Product.class));
        verify(invoiceRepository, never()).save(any(Invoice.class));
    }
}
