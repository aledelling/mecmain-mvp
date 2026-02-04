package com.mecmain.infrastructure.adapter.out.persistence;

import com.mecmain.application.port.out.MotorcycleRepositoryPort;
import com.mecmain.domain.model.Motorcycle;
import com.mecmain.infrastructure.adapter.out.persistence.entity.MotorcycleEntity;
import com.mecmain.infrastructure.adapter.out.persistence.repository.MotorcycleJpaRepository;
import com.mecmain.infrastructure.security.context.TenantContext;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class MotorcycleJpaAdapter implements MotorcycleRepositoryPort {

    private final MotorcycleJpaRepository jpaRepository;

    @Override
    public Motorcycle save(Motorcycle domain) {
        MotorcycleEntity entity = toEntity(domain);
        return toDomain(jpaRepository.save(entity));
    }

    @Override
    public Optional<Motorcycle> findById(UUID id) {
        return jpaRepository.findById(id) // Debería validar tenant, para MVP confiamos en filtro
                .filter(e -> e.getTenantId().equals(TenantContext.getTenantId()))
                .map(this::toDomain);
    }

    @Override
    public List<Motorcycle> findAll() {
        return jpaRepository.findAllByTenantId(TenantContext.getTenantId())
                .stream().map(this::toDomain).toList();
    }

    @Override
    public List<Motorcycle> findByCustomerId(UUID customerId) {
        return jpaRepository.findAllByTenantIdAndCustomerId(TenantContext.getTenantId(), customerId)
                .stream().map(this::toDomain).toList();
    }

    private MotorcycleEntity toEntity(Motorcycle d) {
        MotorcycleEntity e = new MotorcycleEntity();
        e.setId(d.getId());
        e.setTenantId(d.getTenantId());
        e.setCustomerId(d.getCustomerId());
        e.setPlate(d.getPlate());
        e.setVin(d.getVin());
        e.setBrand(d.getBrand());
        e.setModel(d.getModel());
        e.setManufacturingYear(d.getYear());
        e.setDisplacementCc(d.getDisplacementCc());
        e.setNotes(d.getNotes());
        return e;
    }

    private Motorcycle toDomain(MotorcycleEntity e) {
        return Motorcycle.builder()
                .id(e.getId())
                .tenantId(e.getTenantId())
                .customerId(e.getCustomerId())
                .plate(e.getPlate())
                .vin(e.getVin())
                .brand(e.getBrand())
                .model(e.getModel())
                .year(e.getManufacturingYear())
                .displacementCc(e.getDisplacementCc())
                .notes(e.getNotes())
                .build();
    }
}