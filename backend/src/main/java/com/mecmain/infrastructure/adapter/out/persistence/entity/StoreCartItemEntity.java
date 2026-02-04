package com.mecmain.infrastructure.adapter.out.persistence.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.util.UUID;

@Entity
@Table(name = "store_cart_items")
@Getter
@Setter
public class StoreCartItemEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    @Column(name = "tenant_id")
    private UUID tenantId;
    
    @ManyToOne
    @JoinColumn(name = "cart_id")
    private StoreCartEntity cart;
    
    @Column(name = "product_id")
    private UUID productId;
    
    private int quantity;
}