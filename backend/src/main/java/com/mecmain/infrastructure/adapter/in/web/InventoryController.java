package com.mecmain.infrastructure.adapter.in.web;

import com.mecmain.application.port.in.ManageInventoryUseCase;
import com.mecmain.domain.model.InventoryItem;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/inventory-items")
@RequiredArgsConstructor
public class InventoryController {

    private final ManageInventoryUseCase manageInventoryUseCase;

    @GetMapping
    public ResponseEntity<List<InventoryItem>> list(@RequestParam(defaultValue = "false") boolean lowStock) {
        return ResponseEntity.ok(manageInventoryUseCase.listItems(lowStock));
    }

    @PostMapping
    public ResponseEntity<InventoryItem> create(@RequestBody @Valid CreateItemRequest request) {
        var command = new ManageInventoryUseCase.CreateItemCommand(
            request.name, request.sku, request.stock, request.lowStockThreshold, request.cost, request.price
        );
        return ResponseEntity.ok(manageInventoryUseCase.createItem(command));
    }

    public record CreateItemRequest(
        @NotBlank String name,
        String sku,
        @NotNull Integer stock,
        Integer lowStockThreshold,
        BigDecimal cost,
        BigDecimal price
    ) {}
}