package com.mecmain.application.service;

import com.mecmain.application.port.in.ManageInventoryUseCase;
import com.mecmain.application.port.out.InventoryRepositoryPort;
import com.mecmain.domain.model.InventoryItem;
import com.mecmain.infrastructure.security.context.TenantContext;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class InventoryService implements ManageInventoryUseCase {

    private final InventoryRepositoryPort repository;

    @Override
    @Transactional
    public InventoryItem createItem(CreateItemCommand command) {
        UUID tenantId = TenantContext.getTenantId();
        if (tenantId == null) throw new IllegalStateException("Tenant context required");

        InventoryItem item = InventoryItem.builder()
                .tenantId(tenantId)
                .name(command.name())
                .sku(command.sku())
                .stock(command.stock())
                .lowStockThreshold(command.lowStockThreshold() != null ? command.lowStockThreshold() : 5)
                .cost(command.cost())
                .price(command.price())
                .build();

        return repository.save(item);
    }

    @Override
    public List<InventoryItem> listItems(boolean onlyLowStock) {
        List<InventoryItem> all = repository.findAll();
        if (onlyLowStock) {
            return all.stream().filter(InventoryItem::isLowStock).collect(Collectors.toList());
        }
        return all;
    }
}