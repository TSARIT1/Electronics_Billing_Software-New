package com.electroshop.backend;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.JdbcTemplate;
import java.util.List;
import java.util.Map;

@SpringBootTest
class DbQueryTest {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Test
    void checkProducts() {
        List<Map<String, Object>> products = jdbcTemplate.queryForList("SELECT id, name, sku, shop_id FROM products");
        for (Map<String, Object> p : products) {
            System.out.println("PRODUCT: " + p);
        }
        
        List<Map<String, Object>> shops = jdbcTemplate.queryForList("SELECT id, name FROM shops");
        for (Map<String, Object> s : shops) {
            System.out.println("SHOP: " + s);
        }
    }
}
