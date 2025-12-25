package com.example.soloLeaf.controller;

import com.example.soloLeaf.dto.OrderDTO;
import com.example.soloLeaf.dto.OrderItemDTO;
import com.example.soloLeaf.entity.Order;
import com.example.soloLeaf.entity.Users;
import com.example.soloLeaf.payload.ResponseData;
import com.example.soloLeaf.payload.request.OrderRequest;
import com.example.soloLeaf.repository.OrderRepository;
import com.example.soloLeaf.repository.UserRepository;
import com.example.soloLeaf.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {
    @Autowired
    private OrderService orderService;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private UserRepository userRepository;

    @PostMapping()
    public ResponseEntity<?> createOrder(@RequestBody OrderRequest orderRequest) {
        ResponseData responseData = new ResponseData();
        responseData.setData(orderService.insertOrder(orderRequest));

        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }

    @GetMapping("/by-session/{sessionId}")
    public ResponseEntity<OrderDTO> getBySession(@PathVariable String sessionId) {
        return orderRepository.findByStripeSessionId(sessionId)
                .map(o -> ResponseEntity.ok(toDto(o)))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/me")
    public ResponseEntity<List<OrderDTO>> getMyOrders(Authentication authentication) {
        String email = authentication.getName(); // username = email

        Users u = userRepository.findByEmail(email);
        if (u == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        int userId = u.getId();

        List<Order> orders = orderRepository.findByUser_IdOrderByCreateDateDesc(userId);
        List<OrderDTO> dto = orders.stream().map(this::toDto).toList();

        return ResponseEntity.ok(dto);
    }


    private OrderDTO toDto(Order o) {
        return new OrderDTO(
                o.getId(),
                o.getCreateDate(),
                o.getStatus(),
                o.getTotalPrice(),
                o.getRestaurant().getId(),
                o.getRestaurant().getTitle(),
                o.getRestaurant().getImage(),
                o.getOrderItemList().stream().map(oi -> new OrderItemDTO(
                        oi.getFood().getId(),
                        oi.getFood().getTitle(),
                        oi.getFood().getImage(),
                        oi.getQty(),
                        oi.getPrice()
                )).toList()
        );
    }
}
