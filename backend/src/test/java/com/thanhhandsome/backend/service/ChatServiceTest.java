package com.thanhhandsome.backend.service;

import com.thanhhandsome.backend.entity.ChatConversation;
import com.thanhhandsome.backend.entity.Store;
import com.thanhhandsome.backend.entity.User;
import com.thanhhandsome.backend.enums.RoleType;
import com.thanhhandsome.backend.enums.StoreStatus;
import com.thanhhandsome.backend.repository.ChatConversationRepository;
import com.thanhhandsome.backend.repository.ChatMessageRepository;
import com.thanhhandsome.backend.repository.StoreRepository;
import com.thanhhandsome.backend.repository.UserRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.List;
import java.util.Optional;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ChatServiceTest {
    @Mock UserRepository userRepository;
    @Mock StoreRepository storeRepository;
    @Mock ChatConversationRepository chatConversationRepository;
    @Mock ChatMessageRepository chatMessageRepository;
    @InjectMocks ChatService chatService;

    @AfterEach
    void clearSecurityContext() { SecurityContextHolder.clearContext(); }

    @Test
    void getMessagesRejectsNonParticipant() {
        User customer = User.builder().email("buyer@example.test").build();
        customer.setId("buyer-1");
        User storeOwner = User.builder().email("seller@example.test").build();
        storeOwner.setId("seller-1");
        User stranger = User.builder().email("stranger@example.test").build();
        stranger.setId("stranger-1");
        Store store = Store.builder().owner(storeOwner).name("Store").build();
        store.setId("store-1");
        ChatConversation conversation = ChatConversation.builder().customer(customer).store(store).build();
        conversation.setId("conversation-1");
        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken("stranger-1", "", List.of()));
        when(chatConversationRepository.findById("conversation-1")).thenReturn(Optional.of(conversation));

        assertThrows(RuntimeException.class, () -> chatService.getMessages("conversation-1", 0, 20));
        verifyNoInteractions(chatMessageRepository);
    }

    @Test
    void buyerCanOpenAndReuseConversationWithActiveStore() {
        User customer = User.builder().email("buyer@example.test").firstName("Buyer").roles(Set.of(RoleType.CUSTOMER)).build();
        customer.setId("buyer-1");
        User owner = User.builder().email("seller@example.test").firstName("Seller").build();
        owner.setId("seller-1");
        Store store = Store.builder().owner(owner).name("Active shop").status(StoreStatus.ACTIVE).build();
        store.setId("store-1");
        ChatConversation conversation = ChatConversation.builder().customer(customer).store(store).build();
        conversation.setId("conversation-1");
        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken("buyer-1", "", List.of()));
        when(userRepository.findById("buyer-1")).thenReturn(Optional.of(customer));
        when(storeRepository.findById("store-1")).thenReturn(Optional.of(store));
        when(chatConversationRepository.findByCustomerIdAndStoreId("buyer-1", "store-1"))
                .thenReturn(Optional.of(conversation));
        when(chatMessageRepository.findFirstByConversationIdOrderByCreatedAtDesc("conversation-1"))
                .thenReturn(Optional.empty());
        when(chatMessageRepository.countByConversationIdAndSenderIdNotAndReadAtIsNull("conversation-1", "buyer-1"))
                .thenReturn(0L);

        var response = chatService.openConversation("store-1");

        assertEquals("conversation-1", response.id());
        assertEquals("store-1", response.storeId());
        verify(chatConversationRepository, never()).save(any());
    }

    @Test
    void sendMessageTrimsContentAndRoutesToOtherParticipant() {
        User customer = User.builder().email("buyer@example.test").firstName("Buyer").roles(Set.of(RoleType.CUSTOMER)).build();
        customer.setId("buyer-1");
        User owner = User.builder().email("seller@example.test").firstName("Seller").build();
        owner.setId("seller-1");
        Store store = Store.builder().owner(owner).name("Shop").status(StoreStatus.ACTIVE).build();
        store.setId("store-1");
        ChatConversation conversation = ChatConversation.builder().customer(customer).store(store).build();
        conversation.setId("conversation-1");
        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken("buyer-1", "", List.of()));
        when(chatConversationRepository.findById("conversation-1")).thenReturn(Optional.of(conversation));
        when(userRepository.findById("buyer-1")).thenReturn(Optional.of(customer));
        when(chatMessageRepository.save(any())).thenAnswer(invocation -> invocation.getArgument(0));

        var delivery = chatService.sendMessage("buyer-1", new com.thanhhandsome.backend.dto.request.SendChatMessageRequest(
                "conversation-1", "  Hello shop  ", null, null, null));

        assertEquals("buyer-1", delivery.senderId());
        assertEquals("seller-1", delivery.receiverId());
        assertEquals("Hello shop", delivery.message().content());
        verify(chatConversationRepository).save(conversation);
    }

    @Test
    void sendMessageRejectsEmptyTextWithoutAttachment() {
        assertThrows(IllegalArgumentException.class, () -> chatService.sendMessage("buyer-1",
                new com.thanhhandsome.backend.dto.request.SendChatMessageRequest(
                        "conversation-1", "  ", null, null, null)));
        verifyNoInteractions(chatConversationRepository, userRepository, chatMessageRepository);
    }
}
