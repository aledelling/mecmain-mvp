package com.mecmain.domain.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InventoryItem {
    private UUID id;
    private UUID tenantId;
    
    private String name;
    private String sku;
    private Integer stock;
    private Integer lowStockThreshold;
    private BigDecimal cost;
    private BigDecimal price;
    private String notes;

    public boolean isLowStock() {
        return this.stock <= this.lowStockThreshold;
    }
    
    public void decreaseStock(int quantity) {
        if (this.stock < quantity) {
            throw new IllegalArgumentException("Insufficient stock for item: " + name);
        }
        this.stock -= quantity;
    }
}