package com.mecmain.infrastructure.adapter.out.persistence.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Table(name = "store_order_items")
@Getter
@Setter
public class StoreOrderItemEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    @Column(name = "tenant_id")
    private UUID tenantId;
    
    @ManyToOne
    @JoinColumn(name = "order_id")
    private StoreOrderEntity order;
    
    @Column(name = "product_id")
    private UUID productId;
    
    private int quantity;
    
    @Column(name = "unit_price")
    private BigDecimal unitPrice;
}