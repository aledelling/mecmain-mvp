package com.mecmain.infrastructure.adapter.out.persistence.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.util.UUID;

@Entity
@Table(name = "motorcycles")
@Getter
@Setter
public class MotorcycleEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "tenant_id", nullable = false)
    private UUID tenantId;

    @Column(name = "customer_id", nullable = false)
    private UUID customerId;

    private String plate;
    private String vin;
    private String brand;
    private String model;
    
    @Column(name = "year")
    private Integer manufacturingYear; // 'year' es reservado en algunas DBs
    
    @Column(name = "displacement_cc")
    private Integer displacementCc;
    
    private String notes;
}