package com.electroshop.backend.controller;

import com.electroshop.backend.dto.MonthlySeries;
import com.electroshop.backend.dto.ReportSummary;
import com.electroshop.backend.service.ReportsService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/reports")
public class ReportsController {
    private final ReportsService reportsService;

    public ReportsController(ReportsService reportsService) {
        this.reportsService = reportsService;
    }

    @GetMapping("/summary")
    public ReportSummary summary() {
        return reportsService.summary();
    }

    @GetMapping("/monthly")
    public MonthlySeries monthly(@RequestParam(name = "months", defaultValue = "6") int months) {
        return reportsService.monthly(months);
    }
}
