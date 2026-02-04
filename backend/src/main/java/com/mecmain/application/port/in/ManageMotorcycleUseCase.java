package com.mecmain.application.port.in;

import com.mecmain.domain.model.Motorcycle;
import java.util.List;
import java.util.UUID;

public interface ManageMotorcycleUseCase {
    
    Motorcycle createMotorcycle(CreateMotorcycleCommand command);
    List<Motorcycle> listMotorcycles(UUID customerId); // Filtro opcional por cliente

    record CreateMotorcycleCommand(
        UUID customerId,
        String plate,
        String vin,
        String brand,
        String model,
        Integer year,
        Integer displacementCc,
        String notes
    ) {}
}