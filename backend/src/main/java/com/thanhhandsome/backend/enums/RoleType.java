package com.thanhhandsome.backend.enums;

public enum RoleType {
    CUSTOMER,
    ADMIN,
    STORE_MANAGER;

    public String getName() {
        return this.name();
    }
}
