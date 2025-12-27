package com.example.soloLeaf.controller;

import com.example.soloLeaf.dto.FoodDTO;
import com.example.soloLeaf.entity.*;
import com.example.soloLeaf.payload.ResponseData;
import com.example.soloLeaf.payload.request.CheckoutSessionRequest;
import com.example.soloLeaf.repository.*;
import com.example.soloLeaf.service.PaymentService;
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
    private PaymentService paymentService;

    // Stripe API yêu cầu key phải được thiết lập tĩnh
    @PostConstruct
    public void init() {
        // Gán giá trị cho Stripe.apiKey sau khi inject từ Spring
        Stripe.apiKey = stripeSecretKey;
    }


    @PostMapping("/create-checkout-session")
    public ResponseEntity<?> createCheckoutSession(@RequestBody CheckoutSessionRequest req,
                                                   Authentication authentication) throws Exception {
        ResponseData response = paymentService.createCheckoutSessionTx(req, authentication, frontendBaseUrl);
        return ResponseEntity.ok(response);
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
