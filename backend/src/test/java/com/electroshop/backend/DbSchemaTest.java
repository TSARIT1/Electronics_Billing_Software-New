package com.electroshop.backend;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.JdbcTemplate;
import java.util.List;
import java.util.Map;

@SpringBootTest
class DbSchemaTest {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Test
    void checkSchema() {
        List<Map<String, Object>> indexes = jdbcTemplate.queryForList("SHOW INDEX FROM products");
        for (Map<String, Object> idx : indexes) {
            System.out.println("INDEX: " + idx);
        }
    }
}
