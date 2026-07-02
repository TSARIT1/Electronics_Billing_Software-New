package com.electroshop.backend.controller;

import com.electroshop.backend.dto.CategoryBreakdown;
import com.electroshop.backend.dto.DashboardResponse;
import com.electroshop.backend.dto.MonthlySeries;
import com.electroshop.backend.dto.ReportSummary;
import com.electroshop.backend.entity.Invoice;
import com.electroshop.backend.entity.Product;
import com.electroshop.backend.repository.InvoiceRepository;
import com.electroshop.backend.repository.ProductRepository;
import com.electroshop.backend.service.ReportsService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.time.LocalDate;
import java.time.ZoneId;
import java.time.format.TextStyle;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "${frontend.origin}")
public class DashboardController {
    private final ReportsService reportsService;
    private final InvoiceRepository invoiceRepository;
    private final ProductRepository productRepository;

    public DashboardController(ReportsService reportsService, InvoiceRepository invoiceRepository, ProductRepository productRepository) {
        this.reportsService = reportsService;
        this.invoiceRepository = invoiceRepository;
        this.productRepository = productRepository;
    }

    @GetMapping
    public DashboardResponse get(@RequestHeader("X-Shop-Id") Long shopId) {
        DashboardResponse r = new DashboardResponse();

        // summary and monthly from ReportsService
        ReportSummary summary = reportsService.summary(shopId);
        MonthlySeries monthly = reportsService.monthly(12, shopId);
        r.setSummary(summary);
        r.setMonthly(monthly);

        // weekly: last 7 days labels and revenue
        LocalDate now = LocalDate.now(ZoneId.systemDefault());
        List<String> labels = new ArrayList<>();
        List<Double> rev = new ArrayList<>();
        for (int i = 6; i >= 0; i--) {
            LocalDate d = now.minusDays(i);
            labels.add(d.getDayOfWeek().getDisplayName(TextStyle.SHORT, Locale.ENGLISH));
            rev.add(0.0);
        }

        List<Invoice> invoices = invoiceRepository.findByShopId(shopId);
        for (Invoice inv : invoices) {
            if (inv.getCreatedAt() == null) continue;
            LocalDate dt = inv.getCreatedAt().toLocalDate();
            long diff = java.time.temporal.ChronoUnit.DAYS.between(dt, now);
            if (diff >= 0 && diff < 7) {
                int idx = (int) (6 - diff);
                rev.set(idx, rev.get(idx) + (inv.getTotal() == null ? 0.0 : inv.getTotal()));
            }
        }
        r.setWeeklyLabels(labels);
        r.setWeeklyRevenue(rev);

        // category breakdown
        List<Product> products = productRepository.findByShopId(shopId);
        double totalValue = products.stream().mapToDouble(p -> (p.getPrice() == null ? 0.0 : p.getPrice()) * (p.getQuantity() == null ? 0 : p.getQuantity())).sum();
        List<CategoryBreakdown> cb = new ArrayList<>();
        products.stream()
            .collect(java.util.stream.Collectors.groupingBy(p -> p.getCategory() == null ? "Uncategorized" : p.getCategory(), java.util.stream.Collectors.summingDouble(p -> (p.getPrice() == null ? 0.0 : p.getPrice()) * (p.getQuantity() == null ? 0 : p.getQuantity()))))
            .entrySet().stream().limit(4).forEach(e -> {
                double perc = totalValue > 0 ? Math.round((e.getValue() / totalValue) * 100) : 0;
                cb.add(new CategoryBreakdown(e.getKey(), (int) perc));
            });
        r.setCategoryBreakdown(cb);

        return r;
    }
}
