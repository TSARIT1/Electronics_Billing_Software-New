package com.electroshop.backend.service;

import com.electroshop.backend.entity.Supplier;
import com.electroshop.backend.repository.SupplierRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SupplierService {

    @Autowired
    private SupplierRepository supplierRepository;

    public List<Supplier> getAllSuppliers() {
        return supplierRepository.findAll();
    }

    public Supplier getSupplierById(Long id) {
        return supplierRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Supplier not found with id " + id));
    }

    public Supplier createSupplier(Supplier supplier) {
        return supplierRepository.save(supplier);
    }

    public Supplier updateSupplier(Long id, Supplier supplierDetails) {
        Supplier supplier = getSupplierById(id);
        
        if (supplierDetails.getName() != null) supplier.setName(supplierDetails.getName());
        if (supplierDetails.getContactPerson() != null) supplier.setContactPerson(supplierDetails.getContactPerson());
        if (supplierDetails.getEmail() != null) supplier.setEmail(supplierDetails.getEmail());
        if (supplierDetails.getPhone() != null) supplier.setPhone(supplierDetails.getPhone());
        if (supplierDetails.getAddress() != null) supplier.setAddress(supplierDetails.getAddress());
        if (supplierDetails.getTaxId() != null) supplier.setTaxId(supplierDetails.getTaxId());
        if (supplierDetails.getCategory() != null) supplier.setCategory(supplierDetails.getCategory());
        if (supplierDetails.getStatus() != null) supplier.setStatus(supplierDetails.getStatus());

        return supplierRepository.save(supplier);
    }

    public void deleteSupplier(Long id) {
        Supplier supplier = getSupplierById(id);
        supplierRepository.delete(supplier);
    }
}
