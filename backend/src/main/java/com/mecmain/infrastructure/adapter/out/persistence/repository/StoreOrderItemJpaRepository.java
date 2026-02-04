package com.mecmain.infrastructure.adapter.out.persistence.repository;

import com.mecmain.infrastructure.adapter.out.persistence.entity.StoreOrderItemEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface StoreOrderItemJpaRepository extends JpaRepository<StoreOrderItemEntity, UUID> {
}