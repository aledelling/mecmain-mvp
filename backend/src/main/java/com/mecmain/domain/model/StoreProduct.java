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
public class StoreProduct {
    private UUID id;
    private UUID tenantId;
    private UUID inventoryItemId;
    
    private String name;
    private String slug;
    private String description;
    private String brand;
    private String imageUrl;
    
    private BigDecimal priceOverride; // Precio específico de tienda
    private BigDecimal inventoryPrice; // Precio base del inventario
    
    private Integer stock; // Stock actual del inventario
    private boolean isPublished;

    // Lógica: Si no hay override, usa el precio base
    public BigDecimal getFinalPrice() {
        return priceOverride != null ? priceOverride : inventoryPrice;
    }
    
    // Lógica: Verificar disponibilidad
    public void checkStock(int quantity) {
        if (this.stock < quantity) {
            throw new IllegalArgumentException("Not enough stock for product: " + name);
        }
    }
}