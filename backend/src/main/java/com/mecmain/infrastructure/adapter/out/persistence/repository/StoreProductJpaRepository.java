package com.mecmain.infrastructure.adapter.out.persistence.repository;

import com.mecmain.infrastructure.adapter.out.persistence.entity.StoreProductEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface StoreProductJpaRepository extends JpaRepository<StoreProductEntity, UUID> {
    List<StoreProductEntity> findAllByTenantIdAndIsPublishedTrue(UUID tenantId);
    Optional<StoreProductEntity> findByTenantIdAndSlug(UUID tenantId, String slug);
}