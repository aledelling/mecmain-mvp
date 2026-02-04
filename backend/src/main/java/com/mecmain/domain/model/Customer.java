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
public class Customer {
    private UUID id;
    private UUID tenantId; // Esencial para multitenancy
    private String fullName;
    private String email;
    private String phone;
    private String notes;
    private boolean isActive;

    // Lógica de negocio puede ir aquí
    public void deactivate() {
        this.isActive = false;
    }
}