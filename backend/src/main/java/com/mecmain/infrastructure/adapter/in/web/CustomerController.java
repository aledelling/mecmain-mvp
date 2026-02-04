package com.mecmain.infrastructure.adapter.in.web;

import com.mecmain.application.port.in.CreateCustomerUseCase;
import com.mecmain.domain.model.Customer;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/customers") // El prefijo /api se configura en application.yml
@RequiredArgsConstructor
public class CustomerController {

    private final CreateCustomerUseCase createCustomerUseCase;

    @PostMapping
    public ResponseEntity<CustomerResponse> create(@RequestBody @Valid CreateCustomerRequest request) {
        // Mapeo Request DTO -> Command
        var command = new CreateCustomerUseCase.CreateCustomerCommand(
                request.fullName(), request.email(), request.phone(), request.notes()
        );

        Customer created = createCustomerUseCase.createCustomer(command);

        // Mapeo Domain -> Response DTO
        return ResponseEntity.ok(new CustomerResponse(
                created.getId().toString(),
                created.getFullName(),
                created.getEmail()
        ));
    }

    // DTOs internos (pueden ir en archivos separados)
    public record CreateCustomerRequest(
        @NotBlank(message = "Name is required") String fullName,
        String email,
        String phone,
        String notes
    ) {}

    public record CustomerResponse(String id, String name, String email) {}
}