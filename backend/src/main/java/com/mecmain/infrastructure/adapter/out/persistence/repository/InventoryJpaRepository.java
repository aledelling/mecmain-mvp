package com.mecmain.infrastructure.adapter.out.persistence.repository;

import com.mecmain.infrastructure.adapter.out.persistence.entity.InventoryItemEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface InventoryJpaRepository extends JpaRepository<InventoryItemEntity, UUID> {
    List<InventoryItemEntity> findAllByTenantId(UUID tenantId);
}