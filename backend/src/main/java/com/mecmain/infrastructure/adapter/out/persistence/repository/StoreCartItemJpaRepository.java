package com.mecmain.infrastructure.adapter.out.persistence.repository;

import com.mecmain.infrastructure.adapter.out.persistence.entity.StoreCartItemEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface StoreCartItemJpaRepository extends JpaRepository<StoreCartItemEntity, UUID> {
    Optional<StoreCartItemEntity> findByCartIdAndProductId(UUID cartId, UUID productId);
    List<StoreCartItemEntity> findAllByCartId(UUID cartId);
}