package com.mecmain.infrastructure.adapter.out.persistence.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Table(name = "store_orders")
@Getter
@Setter
public class StoreOrderEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    @Column(name = "tenant_id")
    private UUID tenantId;
    
    @Column(name = "user_id")
    private UUID userId;
    
    private String status;
    private BigDecimal total;
}