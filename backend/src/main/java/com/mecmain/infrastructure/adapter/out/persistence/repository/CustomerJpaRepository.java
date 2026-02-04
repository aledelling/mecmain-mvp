package com.mecmain.infrastructure.adapter.out.persistence.repository;

import com.mecmain.infrastructure.adapter.out.persistence.entity.CustomerEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface CustomerJpaRepository extends JpaRepository<CustomerEntity, UUID> {
    // Métodos mágicos de Spring Data que incluyen el filtro por Tenant
    List<CustomerEntity> findAllByTenantId(UUID tenantId);
    Optional<CustomerEntity> findByIdAndTenantId(UUID id, UUID tenantId);
}