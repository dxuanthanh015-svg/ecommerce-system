package com.thanhhandsome.backend.repository;

import com.thanhhandsome.backend.entity.Order;
import com.thanhhandsome.backend.enums.OrderStatus;
import com.thanhhandsome.backend.enums.PaymentStatus;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, String> {
    interface RfmAggregate {
        String getUserId();
        java.time.LocalDateTime getLastOrderAt();
        Long getFrequency();
        java.math.BigDecimal getMonetary();
    }

    interface RfmMonetaryAggregate {
        String getUserId();
        java.math.BigDecimal getMonetary();
    }

    @Query("""
        select o.user.id as userId,
               max(o.createdAt) as lastOrderAt,
               count(o.id) as frequency,
               sum(o.totalAmount) as monetary
        from Order o
        where o.paymentStatus = :paid
          and o.orderStatus <> :cancelled
        group by o.user.id
        """)
    List<RfmAggregate> aggregateRfm(@Param("paid") PaymentStatus paid,
                                    @Param("cancelled") OrderStatus cancelled);

    @Query("""
        select o.user.id as userId,
               sum(o.totalAmount) as monetary
        from Order o
        where o.paymentStatus = :paid
          and o.orderStatus = :delivered
        group by o.user.id
        """)
    List<RfmMonetaryAggregate> aggregateDeliveredRfmMonetary(
            @Param("paid") PaymentStatus paid,
            @Param("delivered") OrderStatus delivered);

    Optional<Order> findByOrderCode(String orderCode);
    Optional<Order> findByIdOrOrderCode(String id, String orderCode);
    boolean existsByOrderCode(String orderCode);
    List<Order> findByUserIdOrderByCreatedAtDesc(String userId);
    List<Order> findByStoreIdOrderByCreatedAtDesc(String storeId);
}
