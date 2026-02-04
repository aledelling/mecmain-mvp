package com.mecmain.application.port.in;

import com.mecmain.domain.model.Customer;

public interface CreateCustomerUseCase {
    /**
     * Comando para crear un cliente.
     * @param command DTO con los datos necesarios (se puede usar un record o clase dedicada)
     * @return El cliente creado
     */
    Customer createCustomer(CreateCustomerCommand command);

    record CreateCustomerCommand(String fullName, String email, String phone, String notes) {}
}