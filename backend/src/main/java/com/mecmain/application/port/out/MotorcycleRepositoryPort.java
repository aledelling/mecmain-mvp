package com.mecmain.application.port.out;

import com.mecmain.domain.model.Motorcycle;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface MotorcycleRepositoryPort {
    Motorcycle save(Motorcycle motorcycle);
    Optional<Motorcycle> findById(UUID id);
    List<Motorcycle> findAll();
    List<Motorcycle> findByCustomerId(UUID customerId);
}