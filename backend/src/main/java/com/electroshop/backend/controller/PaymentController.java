package com.electroshop.backend.controller;

import com.electroshop.backend.dto.PaymentOrderRequest;
import com.electroshop.backend.dto.PaymentVerifyRequest;
import com.electroshop.backend.service.PaymentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = "${frontend.origin}")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping("/create-order")
    public ResponseEntity<Map<String, Object>> createOrder(@RequestBody PaymentOrderRequest request) {
        Map<String, Object> order = paymentService.createRazorpayOrder(request.getPlanId(), request.getShopId());
        return ResponseEntity.ok(order);
    }

    @PostMapping("/verify")
    public ResponseEntity<Map<String, Object>> verifyPayment(@RequestBody PaymentVerifyRequest request) {
        Map<String, Object> verification = paymentService.verifyPayment(request);
        return ResponseEntity.ok(verification);
    }
}
