package com.mecmain.application.service;

import com.mecmain.domain.model.StoreProduct;
import com.mecmain.infrastructure.adapter.out.persistence.entity.*;
import com.mecmain.infrastructure.adapter.out.persistence.repository.*;
import com.mecmain.infrastructure.security.context.TenantContext;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StoreService {

    private final StoreProductJpaRepository productRepo;
    private final StoreCartJpaRepository cartRepo;
    private final StoreCartItemJpaRepository cartItemRepo;
    private final StoreOrderJpaRepository orderRepo;
    private final StoreOrderItemJpaRepository orderItemRepo;
    private final InventoryJpaRepository inventoryRepo;

    // --- PÚBLICO: Catálogo ---

    public List<StoreProduct> getPublicProducts() {
        return productRepo.findAllByTenantIdAndIsPublishedTrue(TenantContext.getTenantId())
                .stream()
                .map(this::toDomain)
                .collect(Collectors.toList());
    }

    public StoreProduct getProductBySlug(String slug) {
        return productRepo.findByTenantIdAndSlug(TenantContext.getTenantId(), slug)
                .map(this::toDomain)
                .orElseThrow(() -> new RuntimeException("Product not found"));
    }

    // --- CLIENTE: Carrito ---

    @Transactional
    public void addItemToCart(UUID userId, UUID productId, int quantity) {
        UUID tenantId = TenantContext.getTenantId();
        
        // 1. Obtener o crear carrito activo
        StoreCartEntity cart = cartRepo.findByTenantIdAndUserIdAndStatus(tenantId, userId, "ACTIVE")
                .orElseGet(() -> {
                    StoreCartEntity newCart = new StoreCartEntity();
                    newCart.setTenantId(tenantId);
                    newCart.setUserId(userId);
                    newCart.setStatus("ACTIVE");
                    return cartRepo.save(newCart);
                });

        // 2. Agregar o actualizar item
        Optional<StoreCartItemEntity> existingItem = cartItemRepo.findByCartIdAndProductId(cart.getId(), productId);
        
        if (existingItem.isPresent()) {
            StoreCartItemEntity item = existingItem.get();
            item.setQuantity(item.getQuantity() + quantity);
            cartItemRepo.save(item);
        } else {
            StoreCartItemEntity item = new StoreCartItemEntity();
            item.setTenantId(tenantId);
            item.setCart(cart);
            item.setProductId(productId);
            item.setQuantity(quantity);
            cartItemRepo.save(item);
        }
    }

    public List<CartItemDto> getMyCart(UUID userId) {
        return cartRepo.findByTenantIdAndUserIdAndStatus(TenantContext.getTenantId(), userId, "ACTIVE")
                .map(cart -> cartItemRepo.findAllByCartId(cart.getId()).stream()
                        .map(item -> {
                            StoreProductEntity prod = productRepo.findById(item.getProductId()).orElseThrow();
                            BigDecimal price = prod.getPriceOverride() != null ? prod.getPriceOverride() : prod.getInventoryItem().getPrice();
                            return new CartItemDto(prod.getId(), prod.getName(), prod.getImageUrl(), item.getQuantity(), price);
                        })
                        .collect(Collectors.toList()))
                .orElse(List.of());
    }

    // --- CLIENTE: Checkout ---

    @Transactional
    public UUID checkout(UUID userId) {
        UUID tenantId = TenantContext.getTenantId();
        
        // 1. Obtener carrito
        StoreCartEntity cart = cartRepo.findByTenantIdAndUserIdAndStatus(tenantId, userId, "ACTIVE")
                .orElseThrow(() -> new RuntimeException("No active cart found"));

        List<StoreCartItemEntity> cartItems = cartItemRepo.findAllByCartId(cart.getId());
        if (cartItems.isEmpty()) throw new RuntimeException("Cart is empty");

        BigDecimal total = BigDecimal.ZERO;
        
        // 2. Crear Orden PENDIENTE
        StoreOrderEntity order = new StoreOrderEntity();
        order.setTenantId(tenantId);
        order.setUserId(userId);
        order.setStatus("PENDING_PAYMENT");
        order.setTotal(BigDecimal.ZERO); // Calculamos abajo
        StoreOrderEntity savedOrder = orderRepo.save(order);

        // 3. Procesar Items y Stock
        for (StoreCartItemEntity cartItem : cartItems) {
            StoreProductEntity product = productRepo.findById(cartItem.getProductId()).orElseThrow();
            InventoryItemEntity inventory = product.getInventoryItem();

            // Validar Stock
            if (inventory.getStock() < cartItem.getQuantity()) {
                throw new RuntimeException("Insufficient stock for: " + product.getName());
            }

            // Descontar Stock (CRÍTICO)
            inventory.setStock(inventory.getStock() - cartItem.getQuantity());
            inventoryRepo.save(inventory);

            // Calcular precio final
            BigDecimal unitPrice = product.getPriceOverride() != null ? product.getPriceOverride() : inventory.getPrice();
            BigDecimal lineTotal = unitPrice.multiply(BigDecimal.valueOf(cartItem.getQuantity()));
            total = total.add(lineTotal);

            // Crear item de orden
            StoreOrderItemEntity orderItem = new StoreOrderItemEntity();
            orderItem.setTenantId(tenantId);
            orderItem.setOrder(savedOrder);
            orderItem.setProductId(product.getId());
            orderItem.setQuantity(cartItem.getQuantity());
            orderItem.setUnitPrice(unitPrice);
            orderItemRepo.save(orderItem);
        }

        // 4. Actualizar total y cerrar carrito
        savedOrder.setTotal(total);
        orderRepo.save(savedOrder);

        cart.setStatus("ORDERED");
        cartRepo.save(cart);

        return savedOrder.getId();
    }
    
    // --- ADMIN ---
    public List<StoreOrderEntity> getAllOrders() {
        return orderRepo.findAllByTenantId(TenantContext.getTenantId());
    }

    @Transactional
    public void markOrderPaid(UUID orderId) {
         StoreOrderEntity order = orderRepo.findById(orderId).orElseThrow();
         if (!order.getTenantId().equals(TenantContext.getTenantId())) throw new RuntimeException("Unauthorized");
         order.setStatus("PAID");
         orderRepo.save(order);
    }

    // Mapper
    private StoreProduct toDomain(StoreProductEntity e) {
        return StoreProduct.builder()
                .id(e.getId())
                .name(e.getName())
                .slug(e.getSlug())
                .description(e.getDescription())
                .imageUrl(e.getImageUrl())
                .brand(e.getBrand())
                .priceOverride(e.getPriceOverride())
                .inventoryPrice(e.getInventoryItem().getPrice())
                .stock(e.getInventoryItem().getStock())
                .isPublished(e.isPublished())
                .build();
    }
    
    public record CartItemDto(UUID id, String name, String image, int qty, BigDecimal price) {}
}