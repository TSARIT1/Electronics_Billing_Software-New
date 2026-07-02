package com.electroshop.backend.service;

import com.electroshop.backend.dto.PaymentVerifyRequest;
import com.electroshop.backend.entity.Shop;
import com.electroshop.backend.entity.SubscriptionPlan;
import com.electroshop.backend.repository.ShopRepository;
import com.electroshop.backend.repository.SubscriptionPlanRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.server.ResponseStatusException;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

@Service
public class PaymentService {

    private final ShopRepository shopRepository;
    private final SubscriptionPlanRepository planRepository;
    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${razorpay.key.id}")
    private String keyId;

    @Value("${razorpay.key.secret}")
    private String keySecret;

    public PaymentService(ShopRepository shopRepository, SubscriptionPlanRepository planRepository) {
        this.shopRepository = shopRepository;
        this.planRepository = planRepository;
    }

    public Map<String, Object> createRazorpayOrder(Long planId, Long shopId) {
        Shop shop = shopRepository.findById(shopId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Shop not found"));
        SubscriptionPlan plan = planRepository.findById(planId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Plan not found"));

        // The price set by the super admin is the FINAL price.
        // The frontend calculates the original (strikethrough) price backwards.
        BigDecimal price = plan.getPrice();
        BigDecimal finalPrice = price;

        // Amount in paise
        long amountInPaise = finalPrice.multiply(new BigDecimal(100)).setScale(0, java.math.RoundingMode.HALF_UP).longValue();

        try {
            // Setup Basic Auth Headers
            String auth = keyId + ":" + keySecret;
            String encodedAuth = Base64.getEncoder().encodeToString(auth.getBytes(StandardCharsets.UTF_8));
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("Authorization", "Basic " + encodedAuth);

            // Setup Payload
            Map<String, Object> payload = new HashMap<>();
            payload.put("amount", amountInPaise);
            payload.put("currency", "INR");
            payload.put("receipt", "receipt_shop_" + shopId + "_" + System.currentTimeMillis());

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(payload, headers);
            ResponseEntity<Map> response = restTemplate.postForEntity("https://api.razorpay.com/v1/orders", request, Map.class);

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                Map<String, Object> responseBody = response.getBody();
                Map<String, Object> result = new HashMap<>();
                result.put("razorpayOrderId", responseBody.get("id"));
                result.put("amount", amountInPaise);
                result.put("currency", "INR");
                result.put("keyId", keyId);
                result.put("planName", plan.getName());
                return result;
            } else {
                throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to create order on Razorpay");
            }
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error communicating with Razorpay: " + e.getMessage(), e);
        }
    }

    public Map<String, Object> verifyPayment(PaymentVerifyRequest request) {
        Shop shop = shopRepository.findById(request.getShopId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Shop not found"));
        SubscriptionPlan plan = planRepository.findById(request.getPlanId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Plan not found"));

        try {
            // Verify Signature: HMAC SHA256 of "razorpay_order_id|razorpay_payment_id"
            String generatedSignature = calculateHmacSha256(
                    request.getRazorpayOrderId() + "|" + request.getRazorpayPaymentId(),
                    keySecret
            );

            if (generatedSignature.equals(request.getRazorpaySignature())) {
                // Update Shop Plan
                shop.setPlan(plan);
                
                // Add expiry days
                LocalDateTime expiresAt = null;
                if (plan.getDurationDays() != null) {
                    expiresAt = LocalDateTime.now().plusDays(plan.getDurationDays());
                }
                shop.setSubscriptionExpiresAt(expiresAt);
                shopRepository.save(shop);

                Map<String, Object> response = new HashMap<>();
                response.put("status", "SUCCESS");
                response.put("message", "Payment verified and plan upgraded successfully");
                response.put("planName", plan.getName());
                response.put("expiresAt", expiresAt);
                return response;
            } else {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid payment signature verification failed");
            }
        } catch (Exception e) {
            if (e instanceof ResponseStatusException) {
                throw (ResponseStatusException) e;
            }
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Signature computation error: " + e.getMessage(), e);
        }
    }

    private String calculateHmacSha256(String data, String secret) throws Exception {
        Mac sha256Hmac = Mac.getInstance("HmacSHA256");
        SecretKeySpec secretKey = new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
        sha256Hmac.init(secretKey);
        byte[] bytes = sha256Hmac.doFinal(data.getBytes(StandardCharsets.UTF_8));
        
        StringBuilder hexString = new StringBuilder();
        for (byte b : bytes) {
            String hex = Integer.toHexString(0xff & b);
            if (hex.length() == 1) {
                hexString.append('0');
            }
            hexString.append(hex);
        }
        return hexString.toString();
    }
}
