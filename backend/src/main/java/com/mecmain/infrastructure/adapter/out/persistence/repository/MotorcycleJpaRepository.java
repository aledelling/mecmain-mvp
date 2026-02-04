package com.mecmain.infrastructure.adapter.out.persistence.repository;

import com.mecmain.infrastructure.adapter.out.persistence.entity.MotorcycleEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface MotorcycleJpaRepository extends JpaRepository<MotorcycleEntity, UUID> {
    List<MotorcycleEntity> findAllByTenantId(UUID tenantId);
    List<MotorcycleEntity> findAllByTenantIdAndCustomerId(UUID tenantId, UUID customerId);
}