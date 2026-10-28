package com.thanhhandsome.backend.repository;

import com.thanhhandsome.backend.entity.OrderItem;
import com.thanhhandsome.backend.enums.OrderStatus;
import com.thanhhandsome.backend.enums.PaymentStatus;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.data.repository.query.Param;

import java.util.List;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem,String> {
    interface ProductQuantitySold {
        String getProductId();
        Long getQuantitySold();
    }

    interface ProductSalesAggregate {
        String getProductId();
        String getName();
        String getImageUrl();
        Long getQuantitySold();
        java.math.BigDecimal getRevenue();
    }

    @Query("""
        SELECT oi.product.id as productId,
               oi.productTitle as name,
               oi.productImageUrl as imageUrl,
               sum(oi.quantity) as quantitySold,
               sum(case when oi.discountedPrice is not null
                        then oi.discountedPrice * oi.quantity
                        else oi.price * oi.quantity end) as revenue
        FROM OrderItem oi
        WHERE oi.order.paymentStatus = :paid
          AND oi.order.orderStatus <> :cancelled
        GROUP BY oi.product.id, oi.productTitle, oi.productImageUrl
        ORDER BY revenue DESC
        """)
    List<ProductSalesAggregate> findTopProductSales(
            @Param("paid") PaymentStatus paid,
            @Param("cancelled") OrderStatus cancelled,
            Pageable pageable);

    @Query("select oi.product.id as productId, sum(oi.quantity) as quantitySold " +
            "from OrderItem oi where oi.product.id in :productIds " +
            "and oi.order.paymentStatus = :paid and oi.order.orderStatus = :delivered " +
            "group by oi.product.id")
    List<ProductQuantitySold> findDeliveredPaidSalesByProductIds(
            @Param("productIds") List<String> productIds,
            @Param("paid") PaymentStatus paid,
            @Param("delivered") OrderStatus delivered);

    @Query("""
        SELECT oi.product.id, sum(oi.quantity) as totalSold
        FROM OrderItem oi
        GROUP BY oi.product.id
        ORDER BY totalSold DESC
    """)
    List<Object[]> findTopSellingProductIds(Pageable pageable);

}
