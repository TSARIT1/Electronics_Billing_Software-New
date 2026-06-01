package com.electroshop.backend.dto;

import java.util.List;

public class DashboardResponse {
    private ReportSummary summary;
    private MonthlySeries monthly;
    private List<String> weeklyLabels;
    private List<Double> weeklyRevenue;
    private List<CategoryBreakdown> categoryBreakdown;

    public ReportSummary getSummary() {
        return summary;
    }

    public void setSummary(ReportSummary summary) {
        this.summary = summary;
    }

    public MonthlySeries getMonthly() {
        return monthly;
    }

    public void setMonthly(MonthlySeries monthly) {
        this.monthly = monthly;
    }

    public List<String> getWeeklyLabels() {
        return weeklyLabels;
    }

    public void setWeeklyLabels(List<String> weeklyLabels) {
        this.weeklyLabels = weeklyLabels;
    }

    public List<Double> getWeeklyRevenue() {
        return weeklyRevenue;
    }

    public void setWeeklyRevenue(List<Double> weeklyRevenue) {
        this.weeklyRevenue = weeklyRevenue;
    }

    public List<CategoryBreakdown> getCategoryBreakdown() {
        return categoryBreakdown;
    }

    public void setCategoryBreakdown(List<CategoryBreakdown> categoryBreakdown) {
        this.categoryBreakdown = categoryBreakdown;
    }
}
