package com.mecmain.application.port.out;

import com.mecmain.domain.model.InventoryItem;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface InventoryRepositoryPort {
    InventoryItem save(InventoryItem item);
    Optional<InventoryItem> findById(UUID id);
    List<InventoryItem> findAll();
}