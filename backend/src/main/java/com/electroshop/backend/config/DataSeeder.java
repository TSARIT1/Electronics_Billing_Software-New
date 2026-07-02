package com.electroshop.backend.config;

import com.electroshop.backend.entity.SubscriptionPlan;
import com.electroshop.backend.entity.Invoice;
import com.electroshop.backend.entity.InvoiceItem;
import com.electroshop.backend.repository.SubscriptionPlanRepository;
import com.electroshop.backend.repository.InvoiceRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {

    private final SubscriptionPlanRepository planRepository;
    private final InvoiceRepository invoiceRepository;

    public DataSeeder(SubscriptionPlanRepository planRepository, InvoiceRepository invoiceRepository) {
        this.planRepository = planRepository;
        this.invoiceRepository = invoiceRepository;
    }

    @Override
    public void run(String... args) {
        if (planRepository.count() == 0) {
            SubscriptionPlan free = new SubscriptionPlan();
            free.setName("Free Plan");
            free.setPrice(BigDecimal.ZERO);
            free.setDurationDays(2);
            free.setDurationLabel("2 days");
            free.setStatus("ACTIVE");
            free.setDiscount(0);
            free.setFeatures("Single Dashboard");

            SubscriptionPlan silver = new SubscriptionPlan();
            silver.setName("Silver");
            silver.setPrice(new BigDecimal("7000"));
            silver.setDurationDays(180);
            silver.setDurationLabel("6 months");
            silver.setStatus("ACTIVE");
            silver.setDiscount(30);
            silver.setFeatures("All Features");

            SubscriptionPlan platinum = new SubscriptionPlan();
            platinum.setName("Platinum");
            platinum.setPrice(new BigDecimal("21999"));
            platinum.setDurationDays(365);
            platinum.setDurationLabel("12 months");
            platinum.setStatus("ACTIVE");
            platinum.setDiscount(30);
            platinum.setFeatures("All Features,Priority Support,Custom Branding");

            SubscriptionPlan gold = new SubscriptionPlan();
            gold.setName("Gold");
            gold.setPrice(new BigDecimal("15999"));
            gold.setDurationDays(270);
            gold.setDurationLabel("9 months");
            gold.setStatus("ACTIVE");
            gold.setDiscount(20);
            gold.setFeatures("All Features,Priority Support");

            planRepository.saveAll(Arrays.asList(free, silver, platinum, gold));
        }

        if (invoiceRepository.count() == 0) {
            Invoice inv1 = new Invoice();
            inv1.setInvoiceNo("GST/2026/8796");
            inv1.setPurchaser("Rahul Sharma");
            inv1.setPhone("9876543210");
            inv1.setAddress("Bangalore");
            inv1.setPaymentMode("Cash");
            inv1.setDate("24 Jun 2026");
            inv1.setCgst(9.0);
            inv1.setSgst(9.0);
            inv1.setGrandTotal(45000.0);
            inv1.setTotal(45000.0);
            
            InvoiceItem item1 = new InvoiceItem();
            item1.setProductId(1L);
            item1.setQuantity(1);
            item1.setPrice(45000.0);
            inv1.setItems(Arrays.asList(item1));

            Invoice inv2 = new Invoice();
            inv2.setInvoiceNo("GST/2026/8797");
            inv2.setPurchaser("Anita Desai");
            inv2.setPhone("9123456789");
            inv2.setAddress("Mumbai");
            inv2.setPaymentMode("Card");
            inv2.setDate("25 Jun 2026");
            inv2.setCgst(9.0);
            inv2.setSgst(9.0);
            inv2.setGrandTotal(28500.0);
            inv2.setTotal(28500.0);
            
            InvoiceItem item2 = new InvoiceItem();
            item2.setProductId(2L);
            item2.setQuantity(2);
            item2.setPrice(14250.0);
            inv2.setItems(Arrays.asList(item2));

            invoiceRepository.saveAll(Arrays.asList(inv1, inv2));
        }
    }
}
