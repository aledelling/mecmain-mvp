package com.mecmain.infrastructure.adapter.in.web;

import com.mecmain.application.service.StoreService;
import com.mecmain.domain.model.StoreProduct;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping
@RequiredArgsConstructor
public class StoreController {

    private final StoreService storeService;

    // --- PÚBLICO (No requiere auth, pero backend valida tenant) ---
    // Nota: Configura SecurityConfig para permitir /api/public/**
    @GetMapping("/public/store/products")
    public ResponseEntity<List<StoreProduct>> getPublicProducts() {
        return ResponseEntity.ok(storeService.getPublicProducts());
    }

    // --- CLIENTE (Requiere Auth) ---
    @GetMapping("/store/cart")
    public ResponseEntity<List<StoreService.CartItemDto>> getMyCart(Authentication auth) {
        UUID userId = getUserId(auth);
        return ResponseEntity.ok(storeService.getMyCart(userId));
    }

    @PostMapping("/store/cart/items")
    public ResponseEntity<Void> addToCart(Authentication auth, @RequestBody AddToCartRequest req) {
        UUID userId = getUserId(auth);
        storeService.addItemToCart(userId, req.productId, req.quantity);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/store/checkout")
    public ResponseEntity<UUID> checkout(Authentication auth) {
        UUID userId = getUserId(auth);
        UUID orderId = storeService.checkout(userId);
        return ResponseEntity.ok(orderId);
    }

    // --- ADMIN (Debería validar rol) ---
    @GetMapping("/admin/store/orders")
    public ResponseEntity<?> getAllOrders() {
        return ResponseEntity.ok(storeService.getAllOrders());
    }
    
    @PostMapping("/admin/store/orders/{id}/pay")
    public ResponseEntity<Void> markPaid(@PathVariable UUID id) {
        storeService.markOrderPaid(id);
        return ResponseEntity.ok().build();
    }

    // Helpers
    private UUID getUserId(Authentication auth) {
        if (auth == null) throw new RuntimeException("Unauthorized");
        Jwt jwt = (Jwt) auth.getPrincipal();
        return UUID.fromString(jwt.getSubject()); // Supabase User ID
    }

    public record AddToCartRequest(UUID productId, int quantity) {}
}