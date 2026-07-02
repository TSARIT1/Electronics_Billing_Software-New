package com.electroshop.backend.service;

import com.electroshop.backend.dto.MonthlySeries;
import com.electroshop.backend.dto.ReportSummary;
import com.electroshop.backend.entity.Invoice;
import com.electroshop.backend.entity.PurchaseOrder;
import com.electroshop.backend.repository.InvoiceRepository;
import com.electroshop.backend.repository.PurchaseRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.ZoneId;
import java.time.format.TextStyle;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

@Service
public class ReportsService {
    private final InvoiceRepository invoiceRepository;
    private final PurchaseRepository purchaseRepository;

    public ReportsService(InvoiceRepository invoiceRepository, PurchaseRepository purchaseRepository) {
        this.invoiceRepository = invoiceRepository;
        this.purchaseRepository = purchaseRepository;
    }

    public ReportSummary summary(Long shopId) {
        List<Invoice> invoices = invoiceRepository.findByShopId(shopId);
        List<PurchaseOrder> purchases = purchaseRepository.findByShopId(shopId);

        double totalRevenue = invoices.stream().mapToDouble(i -> i.getTotal() == null ? 0.0 : i.getTotal()).sum();
        double totalPurchases = purchases.stream().mapToDouble(p -> p.getTotal() == null ? 0.0 : p.getTotal()).sum();
        long invoiceCount = invoices.size();
        double avgOrder = invoiceCount == 0 ? 0.0 : totalRevenue / invoiceCount;
        double profit = totalRevenue - totalPurchases;

        ReportSummary s = new ReportSummary();
        s.setTotalRevenue(totalRevenue);
        s.setTotalPurchases(totalPurchases);
        s.setProfit(profit);
        s.setAvgOrderValue(avgOrder);
        s.setInvoiceCount(invoiceCount);
        return s;
    }

    public MonthlySeries monthly(int months, Long shopId) {
        if (months <= 0) months = 6;
        LocalDate now = LocalDate.now(ZoneId.systemDefault());
        List<String> labels = new ArrayList<>();
        List<Double> rev = new ArrayList<>();
        List<Double> pur = new ArrayList<>();

        for (int i = months - 1; i >= 0; i--) {
            LocalDate m = now.minusMonths(i);
            String label = m.getMonth().getDisplayName(TextStyle.SHORT, Locale.ENGLISH);
            labels.add(label);
            rev.add(0.0);
            pur.add(0.0);
        }

        List<Invoice> invoices = invoiceRepository.findByShopId(shopId);
        for (Invoice inv : invoices) {
            if (inv.getCreatedAt() == null) continue;
            LocalDate dt = inv.getCreatedAt().toLocalDate();
            int diff = (int) ((now.getYear() - dt.getYear()) * 12L + now.getMonthValue() - dt.getMonthValue());
            if (diff >= 0 && diff < months) {
                int idx = months - 1 - diff;
                rev.set(idx, rev.get(idx) + (inv.getTotal() == null ? 0.0 : inv.getTotal()));
            }
        }

        List<PurchaseOrder> purchases = purchaseRepository.findByShopId(shopId);
        for (PurchaseOrder po : purchases) {
            if (po.getCreatedAt() == null) continue;
            LocalDate dt = po.getCreatedAt().toLocalDate();
            int diff = (int) ((now.getYear() - dt.getYear()) * 12L + now.getMonthValue() - dt.getMonthValue());
            if (diff >= 0 && diff < months) {
                int idx = months - 1 - diff;
                pur.set(idx, pur.get(idx) + (po.getTotal() == null ? 0.0 : po.getTotal()));
            }
        }

        MonthlySeries ms = new MonthlySeries();
        ms.setLabels(labels);
        ms.setRevenue(rev);
        ms.setPurchases(pur);
        return ms;
    }
}
