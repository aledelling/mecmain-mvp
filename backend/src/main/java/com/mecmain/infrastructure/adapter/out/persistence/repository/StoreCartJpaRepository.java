package com.mecmain.infrastructure.adapter.out.persistence.repository;

import com.mecmain.infrastructure.adapter.out.persistence.entity.StoreCartEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.UUID;

public interface StoreCartJpaRepository extends JpaRepository<StoreCartEntity, UUID> {
    Optional<StoreCartEntity> findByTenantIdAndUserIdAndStatus(UUID tenantId, UUID userId, String status);
}