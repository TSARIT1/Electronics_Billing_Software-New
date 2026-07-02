package com.electroshop.backend.service;

import com.electroshop.backend.dto.PaymentVerifyRequest;
import com.electroshop.backend.entity.Shop;
import com.electroshop.backend.entity.SubscriptionPlan;
import com.electroshop.backend.repository.ShopRepository;
import com.electroshop.backend.repository.SubscriptionPlanRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.util.Optional;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PaymentServiceTest {

    @Mock
    private ShopRepository shopRepository;

    @Mock
    private SubscriptionPlanRepository planRepository;

    @InjectMocks
    private PaymentService paymentService;

    @BeforeEach
    void setUp() {
        // Mock Key credentials locally for unit test execution
        ReflectionTestUtils.setField(paymentService, "keyId", "rzp_test_mockkeyid");
        ReflectionTestUtils.setField(paymentService, "keySecret", "mockkeysecret");
    }

    @Test
    void verifyPaymentSucceedsWithValidSignature() throws Exception {
        PaymentVerifyRequest request = new PaymentVerifyRequest();
        request.setShopId(1L);
        request.setPlanId(2L);
        request.setRazorpayOrderId("order_xyz123");
        request.setRazorpayPaymentId("pay_xyz456");
        
        String sig = calculateHmacSha256("order_xyz123|pay_xyz456", "mockkeysecret");
        request.setRazorpaySignature(sig);

        Shop shop = new Shop();
        shop.setId(1L);
        shop.setName("Test Shop");

        SubscriptionPlan plan = new SubscriptionPlan();
        plan.setId(2L);
        plan.setName("Silver");
        plan.setDurationDays(180);

        when(shopRepository.findById(1L)).thenReturn(Optional.of(shop));
        when(planRepository.findById(2L)).thenReturn(Optional.of(plan));
        when(shopRepository.save(any(Shop.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Map<String, Object> result = paymentService.verifyPayment(request);

        assertEquals("SUCCESS", result.get("status"));
        assertEquals("Silver", result.get("planName"));
        assertNotNull(result.get("expiresAt"));
        assertEquals(plan, shop.getPlan());
        assertNotNull(shop.getSubscriptionExpiresAt());
        verify(shopRepository).save(shop);
    }

    @Test
    void verifyPaymentFailsWithInvalidSignature() {
        PaymentVerifyRequest request = new PaymentVerifyRequest();
        request.setShopId(1L);
        request.setPlanId(2L);
        request.setRazorpayOrderId("order_xyz123");
        request.setRazorpayPaymentId("pay_xyz456");
        request.setRazorpaySignature("wrong_signature_value");

        Shop shop = new Shop();
        shop.setId(1L);
        SubscriptionPlan plan = new SubscriptionPlan();
        plan.setId(2L);

        when(shopRepository.findById(1L)).thenReturn(Optional.of(shop));
        when(planRepository.findById(2L)).thenReturn(Optional.of(plan));

        assertThrows(ResponseStatusException.class, () -> paymentService.verifyPayment(request));
        verify(shopRepository, never()).save(any(Shop.class));
    }

    private String calculateHmacSha256(String data, String secret) throws Exception {
        javax.crypto.Mac sha256Hmac = javax.crypto.Mac.getInstance("HmacSHA256");
        javax.crypto.spec.SecretKeySpec secretKey = new javax.crypto.spec.SecretKeySpec(secret.getBytes(java.nio.charset.StandardCharsets.UTF_8), "HmacSHA256");
        sha256Hmac.init(secretKey);
        byte[] bytes = sha256Hmac.doFinal(data.getBytes(java.nio.charset.StandardCharsets.UTF_8));
        
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
