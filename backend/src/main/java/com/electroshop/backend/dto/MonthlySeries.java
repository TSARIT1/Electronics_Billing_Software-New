package com.electroshop.backend.dto;

import java.util.List;

public class MonthlySeries {
    private List<String> labels;
    private List<Double> revenue;
    private List<Double> purchases;

    public List<String> getLabels() {
        return labels;
    }

    public void setLabels(List<String> labels) {
        this.labels = labels;
    }

    public List<Double> getRevenue() {
        return revenue;
    }

    public void setRevenue(List<Double> revenue) {
        this.revenue = revenue;
    }

    public List<Double> getPurchases() {
        return purchases;
    }

    public void setPurchases(List<Double> purchases) {
        this.purchases = purchases;
    }
}
