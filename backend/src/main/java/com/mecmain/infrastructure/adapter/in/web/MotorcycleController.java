package com.mecmain.infrastructure.adapter.in.web;

import com.mecmain.application.port.in.ManageMotorcycleUseCase;
import com.mecmain.domain.model.Motorcycle;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/motorcycles")
@RequiredArgsConstructor
public class MotorcycleController {

    private final ManageMotorcycleUseCase manageMotorcycleUseCase;

    @GetMapping
    public ResponseEntity<List<Motorcycle>> list(@RequestParam(required = false) UUID customerId) {
        return ResponseEntity.ok(manageMotorcycleUseCase.listMotorcycles(customerId));
    }

    @PostMapping
    public ResponseEntity<Motorcycle> create(@RequestBody @Valid CreateMotorcycleRequest request) {
        var command = new ManageMotorcycleUseCase.CreateMotorcycleCommand(
            request.customerId, request.plate, request.vin, request.brand, request.model,
            request.year, request.displacementCc, request.notes
        );
        return ResponseEntity.ok(manageMotorcycleUseCase.createMotorcycle(command));
    }

    public record CreateMotorcycleRequest(
        @NotNull UUID customerId,
        @NotBlank String plate,
        String vin,
        @NotBlank String brand,
        String model,
        Integer year,
        Integer displacementCc,
        String notes
    ) {}
}