package com.electroshop.backend.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.CascadeType;
import jakarta.persistence.OneToMany;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "invoices")
public class Invoice {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDateTime createdAt = LocalDateTime.now();

    private Double total;

    @OneToMany(cascade = CascadeType.ALL)
    @JoinColumn(name = "invoice_id")
    private List<InvoiceItem> items;

    @jakarta.persistence.ManyToOne
    @jakarta.persistence.JoinColumn(name = "shop_id")
    private Shop shop;

    private String purchaser;
    private String phone;
    private String address;
    private String gstin;
    private String stateCode;
    private String transporter;
    private String vehicleNo;
    private String mobile;
    private String paymentMode;
    private Double cgst;
    private Double sgst;
    private Double igst;
    private Double spotDiscount;
    private Double splSeaDiscount;
    private Double otherDiscount;
    private Double roundOff;
    private Double grandTotal;
    private String invoiceNo;
    private String date;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public Double getTotal() {
        return total;
    }

    public void setTotal(Double total) {
        this.total = total;
    }

    public List<InvoiceItem> getItems() {
        return items;
    }

    public void setItems(List<InvoiceItem> items) {
        this.items = items;
    }

    public Shop getShop() {
        return shop;
    }

    public void setShop(Shop shop) {
        this.shop = shop;
    }

    public String getPurchaser() { return purchaser; }
    public void setPurchaser(String purchaser) { this.purchaser = purchaser; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getGstin() { return gstin; }
    public void setGstin(String gstin) { this.gstin = gstin; }

    public String getStateCode() { return stateCode; }
    public void setStateCode(String stateCode) { this.stateCode = stateCode; }

    public String getTransporter() { return transporter; }
    public void setTransporter(String transporter) { this.transporter = transporter; }

    public String getVehicleNo() { return vehicleNo; }
    public void setVehicleNo(String vehicleNo) { this.vehicleNo = vehicleNo; }

    public String getMobile() { return mobile; }
    public void setMobile(String mobile) { this.mobile = mobile; }

    public String getPaymentMode() { return paymentMode; }
    public void setPaymentMode(String paymentMode) { this.paymentMode = paymentMode; }

    public Double getCgst() { return cgst; }
    public void setCgst(Double cgst) { this.cgst = cgst; }

    public Double getSgst() { return sgst; }
    public void setSgst(Double sgst) { this.sgst = sgst; }

    public Double getIgst() { return igst; }
    public void setIgst(Double igst) { this.igst = igst; }

    public Double getSpotDiscount() { return spotDiscount; }
    public void setSpotDiscount(Double spotDiscount) { this.spotDiscount = spotDiscount; }

    public Double getSplSeaDiscount() { return splSeaDiscount; }
    public void setSplSeaDiscount(Double splSeaDiscount) { this.splSeaDiscount = splSeaDiscount; }

    public Double getOtherDiscount() { return otherDiscount; }
    public void setOtherDiscount(Double otherDiscount) { this.otherDiscount = otherDiscount; }

    public Double getRoundOff() { return roundOff; }
    public void setRoundOff(Double roundOff) { this.roundOff = roundOff; }

    public Double getGrandTotal() { return grandTotal; }
    public void setGrandTotal(Double grandTotal) { this.grandTotal = grandTotal; }

    public String getInvoiceNo() { return invoiceNo; }
    public void setInvoiceNo(String invoiceNo) { this.invoiceNo = invoiceNo; }

    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }
}

