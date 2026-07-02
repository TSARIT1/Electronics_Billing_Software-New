package com.electroshop.backend.service;

import com.electroshop.backend.entity.SubscriptionPlan;
import com.electroshop.backend.repository.SubscriptionPlanRepository;
import com.electroshop.backend.repository.ShopRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class SubscriptionPlanService {
    private final SubscriptionPlanRepository repo;
    private final ShopRepository shopRepo;

    public SubscriptionPlanService(SubscriptionPlanRepository repo, ShopRepository shopRepo) {
        this.repo = repo;
        this.shopRepo = shopRepo;
    }

    public List<SubscriptionPlan> getAll() {
        return repo.findAll();
    }

    public SubscriptionPlan getById(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Plan not found"));
    }

    public SubscriptionPlan create(SubscriptionPlan plan) {
        return repo.save(plan);
    }

    public SubscriptionPlan update(Long id, SubscriptionPlan updated) {
        SubscriptionPlan existing = getById(id);
        existing.setName(updated.getName());
        existing.setPrice(updated.getPrice());
        existing.setDurationDays(updated.getDurationDays());
        existing.setDurationLabel(updated.getDurationLabel());
        existing.setStatus(updated.getStatus());
        existing.setDiscount(updated.getDiscount());
        existing.setFeatures(updated.getFeatures());
        return repo.save(existing);
    }

    public void delete(Long id) {
        if (!repo.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Plan not found");
        }
        if (shopRepo.existsByPlanId(id)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cannot delete plan as it is being used by one or more shops. Please deactivate it instead.");
        }
        repo.deleteById(id);
    }

    public SubscriptionPlan toggleStatus(Long id) {
        SubscriptionPlan plan = getById(id);
        plan.setStatus("ACTIVE".equals(plan.getStatus()) ? "INACTIVE" : "ACTIVE");
        return repo.save(plan);
    }
}
