package com.mecmain.infrastructure.adapter.out.persistence.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Table(name = "store_products")
@Getter
@Setter
public class StoreProductEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "tenant_id", nullable = false)
    private UUID tenantId;

    @ManyToOne(fetch = FetchType.EAGER) // Traemos el inventario para saber stock/precio base
    @JoinColumn(name = "inventory_item_id", nullable = false)
    private InventoryItemEntity inventoryItem;

    private String name;
    private String slug;
    private String description;
    private String brand;
    
    @Column(name = "price_override")
    private BigDecimal priceOverride;
    
    @Column(name = "image_url")
    private String imageUrl;
    
    @Column(name = "is_published")
    private boolean isPublished;
}