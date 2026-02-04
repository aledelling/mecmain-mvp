package com.mecmain.application.port.out;

import com.mecmain.domain.model.Customer;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface CustomerRepositoryPort {
    Customer save(Customer customer);
    Optional<Customer> findById(UUID id);
    List<Customer> findAll(int page, int size);
}