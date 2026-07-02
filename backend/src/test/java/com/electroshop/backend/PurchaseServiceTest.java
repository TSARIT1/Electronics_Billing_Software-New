package com.electroshop.backend;

import com.electroshop.backend.entity.PurchaseItem;
import com.electroshop.backend.entity.PurchaseOrder;
import com.electroshop.backend.service.PurchaseService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

@SpringBootTest
class PurchaseServiceTest {

    @Autowired
    private PurchaseService purchaseService;

    @Test
    void testCreatePurchase() {
        PurchaseOrder order = new PurchaseOrder();
        order.setSupplier("Test Supplier");
        order.setStatus("Pending");

        PurchaseItem item = new PurchaseItem();
        item.setProductId(2L); // ID of the existing iphone 17 with hjjxh sku
        item.setName("iphone 17");
        item.setCost(100.0);
        item.setQuantity(5);
        order.setItems(List.of(item));

        try {
            PurchaseOrder saved = purchaseService.create(order, 7L); // shop_id 7
            System.out.println("SUCCESSFULLY SAVED PURCHASE ORDER: " + saved.getId());
        } catch (Exception e) {
            e.printStackTrace();
            throw e;
        }
    }
}
