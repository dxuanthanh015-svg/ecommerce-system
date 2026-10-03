package com.thanhhandsome.backend.entity;

import com.thanhhandsome.backend.enums.FlashSaleStatus;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "flash_sales", indexes = {
        @Index(name = "idx_flash_sale_status", columnList = "flash_sale_status"),
        @Index(name = "idx_flash_sale_dates", columnList = "start_date, end_date")
})
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level =  AccessLevel.PRIVATE)

public class FlashSale extends BaseEntity {
    @Column(length = 20)
    String name;

    @Column(name = "start_date", nullable = false)
    LocalDateTime startDate;

    @Column(name = "end_date", nullable = false)
    LocalDateTime endDate;

    @Column(name = "flash_sale_status", nullable = false, length = 20)
    @Enumerated(EnumType.STRING)
    @Builder.Default
    FlashSaleStatus status  = FlashSaleStatus.UPCOMING;

    @OneToMany(mappedBy = "flashSale", cascade = CascadeType.ALL)
    @Builder.Default
    List<FlashSaleItem> items = new ArrayList<>();

    public void addItem(FlashSaleItem item) {
        items.add(item);
        item.setFlashSale(this);
    }

    public void removeItem(FlashSaleItem item) {
        items.remove(item);
        item.setFlashSale(null);
    }
}
