package com.mecmain.infrastructure.adapter.out.persistence;

import com.mecmain.application.port.out.InventoryRepositoryPort;
import com.mecmain.domain.model.InventoryItem;
import com.mecmain.infrastructure.adapter.out.persistence.entity.InventoryItemEntity;
import com.mecmain.infrastructure.adapter.out.persistence.repository.InventoryJpaRepository;
import com.mecmain.infrastructure.security.context.TenantContext;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class InventoryJpaAdapter implements InventoryRepositoryPort {

    private final InventoryJpaRepository jpaRepository;

    @Override
    public InventoryItem save(InventoryItem domain) {
        InventoryItemEntity entity = new InventoryItemEntity();
        entity.setId(domain.getId());
        entity.setTenantId(domain.getTenantId());
        entity.setName(domain.getName());
        entity.setSku(domain.getSku());
        entity.setStock(domain.getStock());
        entity.setLowStockThreshold(domain.getLowStockThreshold());
        entity.setCost(domain.getCost());
        entity.setPrice(domain.getPrice());
        entity.setNotes(domain.getNotes());
        
        return toDomain(jpaRepository.save(entity));
    }

    @Override
    public Optional<InventoryItem> findById(UUID id) {
        return jpaRepository.findById(id)
                .filter(e -> e.getTenantId().equals(TenantContext.getTenantId()))
                .map(this::toDomain);
    }

    @Override
    public List<InventoryItem> findAll() {
        return jpaRepository.findAllByTenantId(TenantContext.getTenantId())
                .stream().map(this::toDomain).toList();
    }

    private InventoryItem toDomain(InventoryItemEntity e) {
        return InventoryItem.builder()
                .id(e.getId())
                .tenantId(e.getTenantId())
                .name(e.getName())
                .sku(e.getSku())
                .stock(e.getStock())
                .lowStockThreshold(e.getLowStockThreshold())
                .cost(e.getCost())
                .price(e.getPrice())
                .notes(e.getNotes())
                .build();
    }
}