package com.mecmain.infrastructure.adapter.out.persistence.repository;

import com.mecmain.infrastructure.adapter.out.persistence.entity.StoreOrderEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface StoreOrderJpaRepository extends JpaRepository<StoreOrderEntity, UUID> {
    List<StoreOrderEntity> findAllByTenantId(UUID tenantId);
    List<StoreOrderEntity> findAllByTenantIdAndUserId(UUID tenantId, UUID userId);
}