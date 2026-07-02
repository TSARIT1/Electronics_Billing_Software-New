package com.electroshop.backend.controller;

import com.electroshop.backend.entity.SupportTicket;
import com.electroshop.backend.service.SupportTicketService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/super-admin/tickets")
@CrossOrigin(origins = "${frontend.origin}")
public class SupportTicketController {
    private final SupportTicketService service;

    public SupportTicketController(SupportTicketService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<SupportTicket>> getAll(
            @RequestParam(required = false) String priority,
            @RequestParam(required = false) String status) {
        return ResponseEntity.ok(service.getAll(priority, status));
    }

    @PostMapping
    public ResponseEntity<SupportTicket> create(@RequestBody SupportTicket ticket) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(ticket));
    }

    @PutMapping("/{id}/respond")
    public ResponseEntity<SupportTicket> respond(@PathVariable Long id, @RequestBody Map<String, String> body) {
        String response = body.get("response");
        return ResponseEntity.ok(service.respond(id, response));
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        Map<String, Object> stats = Map.of(
                "total", service.totalCount(),
                "pending", service.countByStatus("PENDING"),
                "resolved", service.countByStatus("RESOLVED")
        );
        return ResponseEntity.ok(stats);
    }
}
