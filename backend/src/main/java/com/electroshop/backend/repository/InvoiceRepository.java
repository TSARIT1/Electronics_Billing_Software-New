package com.electroshop.backend.repository;

import com.electroshop.backend.entity.Invoice;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InvoiceRepository extends JpaRepository<Invoice, Long> {
    java.util.List<Invoice> findByShopId(Long shopId);
}
