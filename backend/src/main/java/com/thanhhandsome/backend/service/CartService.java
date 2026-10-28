package com.thanhhandsome.backend.service;

import com.thanhhandsome.backend.dto.request.CartItemRequest;
import com.thanhhandsome.backend.dto.request.UpdateCartItemRequest;
import com.thanhhandsome.backend.dto.response.CartResponse;
import com.thanhhandsome.backend.entity.Cart;
import com.thanhhandsome.backend.entity.CartItem;
import com.thanhhandsome.backend.entity.Product;
import com.thanhhandsome.backend.entity.User;
import com.thanhhandsome.backend.exception.AppException;
import com.thanhhandsome.backend.exception.ErrorCode;
import com.thanhhandsome.backend.mapper.CartMapper;
import com.thanhhandsome.backend.repository.CartItemRepository;
import com.thanhhandsome.backend.repository.CartRepository;
import com.thanhhandsome.backend.repository.ProductRepository;
import com.thanhhandsome.backend.repository.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)

public class CartService {
    UserRepository userRepository;
    CartRepository cartRepository;
    CartMapper cartMapper;
    ProductRepository productRepository;
    CartItemRepository cartItemRepository;

    public User getCurrentUser(){
        var context = SecurityContextHolder.getContext();
        String userId = context.getAuthentication().getName();
        return userRepository.findById(userId).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
    }

    public Cart getOrCreateCart(User user){
        return cartRepository.findByUserId(user.getId()).orElseGet(() -> cartRepository.save(Cart.builder()
                        .user(user)
                        .items(new ArrayList<>())
                        .totalPrice(BigDecimal.ZERO)
                        .discount(BigDecimal.ZERO)
                        .totalItem(0)
                        .build()));
    }

    private void recalculateCart(Cart cart){
        BigDecimal totalPrice = BigDecimal.ZERO;
        BigDecimal totalDiscounted = BigDecimal.ZERO;
        int totalItem = 0;

        for(CartItem cartItem : cart.getItems()){
            BigDecimal qty = BigDecimal.valueOf(cartItem.getQuantity());
            BigDecimal itemPrice = cartItem.getPrice() != null ? cartItem.getPrice() : BigDecimal.ZERO;
            BigDecimal itemDiscounted = cartItem.getDiscountedPrice() != null ? cartItem.getDiscountedPrice() : itemPrice;

            totalPrice = totalPrice.add(itemPrice.multiply(qty));
            totalDiscounted = totalDiscounted.add(itemDiscounted.multiply(qty));
            totalItem += cartItem.getQuantity();
        }

        cart.setTotalPrice(totalPrice);
        cart.setTotalDiscountedPrice(totalDiscounted);
        cart.setTotalItem(totalItem);
        cart.setDiscount(totalPrice.subtract(totalDiscounted));
    }

    @Transactional(readOnly = true)
    public CartResponse getCart(){
        User user = getCurrentUser();
        Cart cart = getOrCreateCart(user);
        return  cartMapper.toCartResponse(cart);
    }

    @Transactional
    public CartResponse addToCart(CartItemRequest request){
        User user = getCurrentUser();
        Cart cart = getOrCreateCart(user);

        Product product = productRepository.findById(request.getProductId()).orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));

        String size = request.getSize() != null ? request.getSize() : "Default";
        String color = request.getColor() != null ? request.getColor() : "Default";
        int quantityToAdd = request.getQuantity() != null ? request.getQuantity() : 1;
        BigDecimal price = product.getPrice();
        BigDecimal discountedPrice = product.getDiscountedPrice();
        if (discountedPrice == null || discountedPrice.compareTo(price) >= 0) {
            discountedPrice = price;
        }
        // Kiểm tra xem item đã có trong giỏ chưa
        Optional<CartItem> existingItemOpt = cart.getItems().stream()
                .filter(item -> item.getProduct().getId().equals(product.getId())
                        && size.equalsIgnoreCase(item.getSize())
                        && color.equalsIgnoreCase(item.getColor()))
                .findFirst();
        if (existingItemOpt.isPresent()) {
            CartItem existingItem = existingItemOpt.get();
            existingItem.setQuantity(existingItem.getQuantity() + quantityToAdd);
            existingItem.setPrice(price);
            existingItem.setDiscountedPrice(discountedPrice);
        } else {
            CartItem newItem = CartItem.builder()
                    .cart(cart)
                    .product(product)
                    .size(size)
                    .color(color)
                    .quantity(quantityToAdd)
                    .price(price)
                    .discountedPrice(discountedPrice)
                    .build();
            cart.addItem(newItem);
        }
        recalculateCart(cart);
        cartRepository.save(cart);
        return cartMapper.toCartResponse(cart);
    }

    // 3. Cập nhật số lượng
    @Transactional
    public CartResponse updateCartItem(String itemId, UpdateCartItemRequest request) {
        User user = getCurrentUser();
        Cart cart = getOrCreateCart(user);
        CartItem item = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Item không tồn tại trong giỏ hàng"));
        if (!item.getCart().getId().equals(cart.getId())) {
            throw new RuntimeException("Bạn không có quyền chỉnh sửa item này");
        }
        item.setQuantity(request.getQuantity());
        recalculateCart(cart);
        cartRepository.save(cart);
        return cartMapper.toCartResponse(cart);
    }
    // 4. Xóa 1 item
    @Transactional
    public CartResponse removeFromCart(String itemId) {
        User user = getCurrentUser();
        Cart cart = getOrCreateCart(user);
        CartItem item = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Item không tồn tại trong giỏ hàng"));
        if (!item.getCart().getId().equals(cart.getId())) {
            throw new RuntimeException("Bạn không có quyền xóa item này");
        }
        cart.removeItem(item);
        cartItemRepository.delete(item);
        recalculateCart(cart);
        cartRepository.save(cart);
        return cartMapper.toCartResponse(cart);
    }
    // 5. Xóa toàn bộ giỏ hàng
    @Transactional
    public void clearCart() {
        User user = getCurrentUser();
        Cart cart = getOrCreateCart(user);
        cart.getItems().clear();
        cart.setTotalPrice(BigDecimal.ZERO);
        cart.setTotalDiscountedPrice(BigDecimal.ZERO);
        cart.setDiscount(BigDecimal.ZERO);
        cart.setTotalItem(0);
        cartRepository.save(cart);
    }

    // 6. Gộp giỏ hàng Guest vào User khi đăng nhập
    @Transactional
    public CartResponse migrateCart(List<CartItemRequest> guestItems) {
        if (guestItems != null && !guestItems.isEmpty()) {
            for (CartItemRequest itemReq : guestItems) {
                addToCart(itemReq);
            }
        }
        return getCart();
    }

}
