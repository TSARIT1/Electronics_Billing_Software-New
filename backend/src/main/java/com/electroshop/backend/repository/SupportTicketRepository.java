package com.electroshop.backend.repository;

import com.electroshop.backend.entity.SupportTicket;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SupportTicketRepository extends JpaRepository<SupportTicket, Long> {
    List<SupportTicket> findByPriority(String priority);
    List<SupportTicket> findByStatus(String status);
    List<SupportTicket> findByPriorityAndStatus(String priority, String status);
    long countByStatus(String status);
}
