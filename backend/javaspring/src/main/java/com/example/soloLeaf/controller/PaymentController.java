package com.example.soloLeaf.controller;

import com.example.soloLeaf.dto.FoodDTO;
import com.stripe.Stripe;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/api/payment")
public class PaymentController {

    @Value("${stripe.secret-key}")
    private String stripeSecretKey;

    @Value("${frontend.base-url}")
    private String frontendBaseUrl;

    // Stripe API yêu cầu key phải được thiết lập tĩnh
    @PostConstruct
    public void init() {
        // Gán giá trị cho Stripe.apiKey sau khi inject từ Spring
        Stripe.apiKey = stripeSecretKey;
    }

    @PostMapping("/create-checkout-session")
    public java.util.Map<String, String> createCheckoutSession(@RequestBody List<FoodDTO> cartItems) {
        try {
            SessionCreateParams.Builder sessionBuilder = SessionCreateParams.builder()
                    .addPaymentMethodType(SessionCreateParams.PaymentMethodType.CARD)
                    .setMode(SessionCreateParams.Mode.PAYMENT)
                    .setSuccessUrl(frontendBaseUrl + "/payment/success?session_id={CHECKOUT_SESSION_ID}")
                    .setCancelUrl(frontendBaseUrl + "/checkout?canceled=1");

            for (FoodDTO item : cartItems) {
                long unitAmount = Math.max((long) item.getPrice() * 100L, 50L);

                SessionCreateParams.LineItem lineItem = SessionCreateParams.LineItem.builder()
                        .setPriceData(
                                SessionCreateParams.LineItem.PriceData.builder()
                                        .setCurrency("rub")
                                        .setUnitAmount(unitAmount)
                                        .setProductData(
                                                SessionCreateParams.LineItem.PriceData.ProductData.builder()
                                                        .setName(item.getTitle())
                                                        .build()
                                        )
                                        .build()
                        )
                        .setQuantity((long) item.getQty())
                        .build();

                sessionBuilder.addLineItem(lineItem);
            }

            Session session = Session.create(sessionBuilder.build());

            return java.util.Map.of(
                    "id", session.getId(),
                    "url", session.getUrl()
            );
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to create checkout session: " + e.getMessage());
        }
    }

}
