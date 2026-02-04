package com.mecmain.application.service;

import com.mecmain.application.port.in.CreateCustomerUseCase;
import com.mecmain.application.port.out.CustomerRepositoryPort;
import com.mecmain.domain.model.Customer;
import com.mecmain.infrastructure.security.context.TenantContext;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CustomerService implements CreateCustomerUseCase {

    private final CustomerRepositoryPort customerRepository;

    @Override
    @Transactional
    public Customer createCustomer(CreateCustomerCommand command) {
        // 1. Obtener el tenant actual del contexto de seguridad
        UUID tenantId = TenantContext.getTenantId();
        
        if (tenantId == null) {
            throw new IllegalStateException("Cannot create customer without a tenant context");
        }

        // 2. Crear la entidad de dominio
        Customer newCustomer = Customer.builder()
                .tenantId(tenantId)
                .fullName(command.fullName())
                .email(command.email())
                .phone(command.phone())
                .notes(command.notes())
                .isActive(true)
                .build();

        // 3. Guardar usando el puerto de salida
        return customerRepository.save(newCustomer);
    }
}