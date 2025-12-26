package com.example.soloLeaf.controller;

import com.example.soloLeaf.dto.FoodDTO;
import com.example.soloLeaf.entity.Order;
import com.example.soloLeaf.entity.OrderItem;
import com.example.soloLeaf.entity.Users;
import com.example.soloLeaf.payload.request.CheckoutSessionRequest;
import com.example.soloLeaf.repository.FoodRepository;
import com.example.soloLeaf.repository.OrderRepository;
import com.example.soloLeaf.repository.RestaurantRepository;
import com.example.soloLeaf.repository.UserRepository;
import com.stripe.Stripe;
import com.stripe.exception.SignatureVerificationException;
import com.stripe.model.Event;
import com.stripe.model.checkout.Session;
import com.stripe.net.Webhook;
import com.stripe.param.checkout.SessionCreateParams;
import jakarta.annotation.PostConstruct;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.io.BufferedReader;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/payment")
public class PaymentController {

    @Value("${stripe.secret-key}")
    private String stripeSecretKey;

    @Value("${stripe.webhook-secret}")
    private String webhookSecret;

    @Value("${frontend.base-url}")
    private String frontendBaseUrl;

    @Autowired
    UserRepository usersRepository;

    @Autowired
    RestaurantRepository restaurantRepository;

    @Autowired
    FoodRepository foodRepository;

    @Autowired
    OrderRepository orderRepository;

    @Autowired
    private UserRepository userRepository;

    // Stripe API yêu cầu key phải được thiết lập tĩnh
    @PostConstruct
    public void init() {
        // Gán giá trị cho Stripe.apiKey sau khi inject từ Spring
        Stripe.apiKey = stripeSecretKey;
    }

    @PostMapping("/create-checkout-session")
    public java.util.Map<String, String> createCheckoutSession(
            @RequestBody CheckoutSessionRequest req,
            Authentication authentication
    ) {
        try {
            if (req.getItems() == null || req.getItems().isEmpty()) {
                throw new RuntimeException("Cart is empty");
            }

            if (authentication == null || !authentication.isAuthenticated()
                    || "anonymousUser".equals(authentication.getName())) {
                throw new RuntimeException("Unauthorized");
            }

            String email = authentication.getName(); // username = email
            Users user = userRepository.findByEmail(email);
            if (user == null) {
                throw new RuntimeException("User not found");
            }
            int userId = user.getId();

            var restaurant = restaurantRepository.findById(req.getResId())
                    .orElseThrow(() -> new RuntimeException("Restaurant not found: " + req.getResId()));

            // 1) Create Order in DB first (PENDING)
            Order order = new Order();
            order.setUser(user);
            order.setRestaurant(restaurant);
            order.setCreateDate(new java.util.Date());
            order.setStatus("PENDING");
            order.setCurrency("rub");

            long total = 0;

            for (FoodDTO it : req.getItems()) {
                // verify food exists (recommended)
                var food = foodRepository.findById(it.getId())
                        .orElseThrow(() -> new RuntimeException("Food not found: " + it.getId()));

                OrderItem oi = new OrderItem();
                oi.setCreateDate(new java.util.Date());
                oi.setFood(food);
                oi.setQty(it.getQty());
                oi.setPrice((long)it.getPrice()); // snapshot rubles

                // Keep both sides synced
                order.addItem(oi);

                total += (long) it.getPrice() * (long) it.getQty();
            }

            order.setTotalPrice(total);

            // Save order + items (cascade ALL handles items)
            order = orderRepository.save(order);

            // 2) Create Stripe Checkout Session (store orderId in metadata)
            SessionCreateParams.Builder sessionBuilder = SessionCreateParams.builder()
                    .addPaymentMethodType(SessionCreateParams.PaymentMethodType.CARD)
                    .setMode(SessionCreateParams.Mode.PAYMENT)
                    .setSuccessUrl(frontendBaseUrl + "/payment/processing?session_id={CHECKOUT_SESSION_ID}")
                    .setCancelUrl(frontendBaseUrl + "/checkout?canceled=1")
                    .putMetadata("orderId", String.valueOf(order.getId()))
                    .putMetadata("userId", String.valueOf(userId))
                    .putMetadata("resId", String.valueOf(req.getResId()));

            for (FoodDTO it : req.getItems()) {
                long unitAmount = Math.max((long) it.getPrice() * 100L, 50L); // kopeks

                SessionCreateParams.LineItem lineItem = SessionCreateParams.LineItem.builder()
                        .setPriceData(
                                SessionCreateParams.LineItem.PriceData.builder()
                                        .setCurrency("rub")
                                        .setUnitAmount(unitAmount)
                                        .setProductData(
                                                SessionCreateParams.LineItem.PriceData.ProductData.builder()
                                                        .setName(it.getTitle())
                                                        .build()
                                        )
                                        .build()
                        )
                        .setQuantity((long) it.getQty())
                        .build();

                sessionBuilder.addLineItem(lineItem);
            }

            Session session = Session.create(sessionBuilder.build());

            // 3) Update order with sessionId (still PENDING)
            order.setStripeSessionId(session.getId());
            orderRepository.save(order);

            return java.util.Map.of("id", session.getId(), "url", session.getUrl());
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to create checkout session: " + e.getMessage());
        }
    }

    // Stripe sends raw JSON + signature header
    @PostMapping("/webhook")
    public ResponseEntity<String> handleStripeWebhook(
            HttpServletRequest request,
            @RequestHeader("Stripe-Signature") String sigHeader
    ) throws Exception {

        // Read raw body (IMPORTANT: must be raw, not parsed)
        byte[] bytes = request.getInputStream().readAllBytes();
        String payload = new String(bytes, StandardCharsets.UTF_8);

        Event event;
        try {
            // Verify signature using whsec_...
            event = Webhook.constructEvent(payload, sigHeader, webhookSecret);
        } catch (SignatureVerificationException e) {
            return ResponseEntity.badRequest().body("Invalid signature");
        }

        // Handle events you care about
        switch (event.getType()) {
            case "checkout.session.completed" -> {
                Session session = (Session) event.getDataObjectDeserializer()
                        .getObject()
                        .orElse(null);

                if (session != null) {
                    String orderIdStr = session.getMetadata().get("orderId");
                    if (orderIdStr != null) {
                        int orderId = Integer.parseInt(orderIdStr);

                        Order order = orderRepository.findById(orderId)
                                .orElseThrow(() -> new RuntimeException("Order not found: " + orderId));

                        // Mark paid
                        order.setStatus("DELIVERING");
                        order.setStripeSessionId(session.getId());

                        // Stripe amount_total is in smallest currency unit (kopeks)
                        if (session.getAmountTotal() != null) {
                            order.setTotalPrice(session.getAmountTotal() / 100L);
                        }

                        orderRepository.save(order);
                    }
                }
            }

            default -> {
                System.out.println("[WEBHOOK] Unhandled event type: " + event.getType());
            }
        }

        // Stripe expects 2xx response
        return ResponseEntity.ok("ok");
    }
}
