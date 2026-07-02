package com.electroshop.backend.service;

import com.electroshop.backend.entity.SupportTicket;
import com.electroshop.backend.repository.SupportTicketRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class SupportTicketService {
    private final SupportTicketRepository repo;

    public SupportTicketService(SupportTicketRepository repo) {
        this.repo = repo;
    }

    public List<SupportTicket> getAll(String priority, String status) {
        if (priority != null && status != null) {
            return repo.findByPriorityAndStatus(priority, status);
        } else if (priority != null) {
            return repo.findByPriority(priority);
        } else if (status != null) {
            return repo.findByStatus(status);
        }
        return repo.findAll();
    }

    public SupportTicket create(SupportTicket ticket) {
        return repo.save(ticket);
    }

    public SupportTicket respond(Long id, String response) {
        SupportTicket ticket = repo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Ticket not found"));
        ticket.setResponse(response);
        ticket.setStatus("RESOLVED");
        return repo.save(ticket);
    }

    public long countByStatus(String status) {
        return repo.countByStatus(status);
    }

    public long totalCount() {
        return repo.count();
    }
}
