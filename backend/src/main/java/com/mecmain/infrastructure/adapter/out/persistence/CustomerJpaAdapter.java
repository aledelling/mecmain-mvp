package com.mecmain.infrastructure.adapter.out.persistence;

import com.mecmain.application.port.out.CustomerRepositoryPort;
import com.mecmain.domain.model.Customer;
import com.mecmain.infrastructure.adapter.out.persistence.entity.CustomerEntity;
import com.mecmain.infrastructure.adapter.out.persistence.repository.CustomerJpaRepository;
import com.mecmain.infrastructure.security.context.TenantContext;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class CustomerJpaAdapter implements CustomerRepositoryPort {

    private final CustomerJpaRepository jpaRepository;

    @Override
    public Customer save(Customer customer) {
        CustomerEntity entity = toEntity(customer);
        CustomerEntity saved = jpaRepository.save(entity);
        return toDomain(saved);
    }

    @Override
    public Optional<Customer> findById(UUID id) {
        // IMPORTANTE: Siempre filtrar por tenantId por seguridad adicional
        UUID tenantId = TenantContext.getTenantId();
        return jpaRepository.findByIdAndTenantId(id, tenantId)
                .map(this::toDomain);
    }

    @Override
    public List<Customer> findAll(int page, int size) {
        // En una impl real, usar Pageable
        UUID tenantId = TenantContext.getTenantId();
        return jpaRepository.findAllByTenantId(tenantId)
                .stream().map(this::toDomain).toList();
    }

    // Mappers simples (podrían usar MapStruct)
    private CustomerEntity toEntity(Customer domain) {
        return new CustomerEntity(
            domain.getId(), domain.getTenantId(), domain.getFullName(),
            domain.getEmail(), domain.getPhone(), domain.getNotes(), domain.isActive()
        );
    }

    private Customer toDomain(CustomerEntity entity) {
        return new Customer(
            entity.getId(), entity.getTenantId(), entity.getFullName(),
            entity.getEmail(), entity.getPhone(), entity.getNotes(), entity.isActive()
        );
    }
}