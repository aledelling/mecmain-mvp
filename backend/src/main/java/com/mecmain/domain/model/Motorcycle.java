package com.mecmain.domain.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Motorcycle {
    private UUID id;
    private UUID tenantId;
    private UUID customerId;
    
    private String plate;
    private String vin;
    private String brand;
    private String model;
    private Integer year;
    private Integer displacementCc;
    private String notes;

    // Reglas de negocio (ejemplo simple)
    public String getDisplayName() {
        return String.format("%s %s (%s)", brand, model, plate);
    }
}