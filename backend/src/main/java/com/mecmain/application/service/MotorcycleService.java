package com.mecmain.application.service;

import com.mecmain.application.port.in.ManageMotorcycleUseCase;
import com.mecmain.application.port.out.MotorcycleRepositoryPort;
import com.mecmain.domain.model.Motorcycle;
import com.mecmain.infrastructure.security.context.TenantContext;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class MotorcycleService implements ManageMotorcycleUseCase {

    private final MotorcycleRepositoryPort repository;

    @Override
    @Transactional
    public Motorcycle createMotorcycle(CreateMotorcycleCommand command) {
        UUID tenantId = TenantContext.getTenantId();
        if (tenantId == null) throw new IllegalStateException("Tenant context required");

        Motorcycle moto = Motorcycle.builder()
                .tenantId(tenantId)
                .customerId(command.customerId())
                .plate(command.plate())
                .vin(command.vin())
                .brand(command.brand())
                .model(command.model())
                .year(command.year())
                .displacementCc(command.displacementCc())
                .notes(command.notes())
                .build();

        return repository.save(moto);
    }

    @Override
    public List<Motorcycle> listMotorcycles(UUID customerId) {
        if (customerId != null) {
            return repository.findByCustomerId(customerId);
        }
        return repository.findAll();
    }
}