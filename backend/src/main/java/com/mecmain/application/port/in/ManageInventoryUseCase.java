package com.mecmain.application.port.in;

import com.mecmain.domain.model.InventoryItem;
import java.math.BigDecimal;
import java.util.List;

public interface ManageInventoryUseCase {
    
    InventoryItem createItem(CreateItemCommand command);
    List<InventoryItem> listItems(boolean onlyLowStock);

    record CreateItemCommand(
        String name,
        String sku,
        Integer stock,
        Integer lowStockThreshold,
        BigDecimal cost,
        BigDecimal price
    ) {}
}