package com.example.soloLeaf.service;

import com.example.soloLeaf.entity.*;
import com.example.soloLeaf.payload.ResponseData;
import com.example.soloLeaf.payload.request.CheckoutSessionRequest;
import com.example.soloLeaf.repository.FoodRepository;
import com.example.soloLeaf.repository.OrderRepository;
import com.example.soloLeaf.repository.PromoRepository;
import com.example.soloLeaf.repository.UserRepository;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class PaymentService {

    @Autowired
    private UserRepository userRepository;
    @Autowired private FoodRepository foodRepository;
    @Autowired private OrderRepository orderRepository;
    @Autowired private PromoRepository promoRepository;

    @Transactional
    public ResponseData createCheckoutSessionTx(CheckoutSessionRequest req, Authentication authentication,
                                                String frontendBaseUrl) throws Exception {
        try {
            // 0) Validate request + auth
            if (req.getItems() == null || req.getItems().isEmpty()) {
                throw new RuntimeException("Cart is empty");
            }

            if (authentication == null || !authentication.isAuthenticated()
                    || "anonymousUser".equals(authentication.getName())) {
                throw new RuntimeException("Unauthorized");
            }

            String email = authentication.getName();
            Users user = userRepository.findByEmail(email);
            if (user == null) {
                throw new RuntimeException("User not found");
            }

            // 1) Create Order
            Order order = new Order();
            order.setUser(user);
            order.setCreateDate(new java.util.Date());
            order.setStatus(Math.random() < 0.5 ? "DELIVERING" : "DONE");
            order.setCurrency("rub");

            long totalBefore = 0;

            // resId -> subtotal (rubles)
            java.util.Map<Integer, Long> subtotalByRestaurant = new java.util.HashMap<>();
            java.util.Map<Integer, String> restaurantNameById = new java.util.HashMap<>();

            // Optional: keep a readable name list for Stripe line items (if you want)
            // But final Stripe session will be created as ONE line item = totalAfter.

            // 2) Build OrderItems by DB lookup (do NOT trust FE price/title)
            for (CheckoutSessionRequest.Item it : req.getItems()) {
                if (it.getQty() <= 0) {
                    throw new RuntimeException("Invalid qty for item: " + it.getId());
                }

                Food food = foodRepository.findById(it.getId())
                        .orElseThrow(() -> new RuntimeException("Food not found: " + it.getId()));

                long unitPriceRub = rublesFromFoodPrice(food.getPrice());
                long lineTotalRub = unitPriceRub * (long) it.getQty();

                // Find restaurant via Food -> Category -> MenuRestaurant -> Restaurant
                List<Object[]> rows = foodRepository.findRestaurantInfoByFoodId(food.getId());

                if (rows.isEmpty()) {
                    throw new RuntimeException("Food category not linked to any restaurant: foodId=" + food.getId());
                }
                if (rows.size() > 1) {
                    throw new RuntimeException("Category linked to multiple restaurants (ambiguous): foodId=" + food.getId());
                }

                Object[] r = rows.get(0);
                int resId = ((Number) r[0]).intValue();
                String resTitle = (String) r[1];

                restaurantNameById.putIfAbsent(resId, resTitle);
                subtotalByRestaurant.merge(resId, lineTotalRub, Long::sum);

                OrderItem oi = new OrderItem();
                oi.setCreateDate(new java.util.Date());
                oi.setFood(food);
                oi.setQty(it.getQty());
                oi.setPrice(unitPriceRub); // snapshot rubles per unit

                // Keep both sides synced + composite key handled by @MapsId
                order.addItem(oi);

                totalBefore += lineTotalRub;
            }

            // 3) Save order + items (cascade ALL)
            order.setTotalPrice(totalBefore);
            order = orderRepository.save(order);

            // 4) Apply promo (optional) and consume immediately
            String promoCode = req.getPromoCode() == null ? null : req.getPromoCode().trim();

            long discountAmount = 0;
            java.util.Map<String, Object> discountBreakdown = null;

            if (promoCode != null && !promoCode.isEmpty()) {

                Promo promo = promoRepository.findByCodeForUpdate(promoCode)
                        .orElseThrow(() -> new RuntimeException("Invalid promo code"));

                java.util.Date now = new java.util.Date();

                // Validate not expired
                if (promo.getEndDate() != null && now.after(promo.getEndDate())) {
                    throw new RuntimeException("Promo code expired");
                }

                // Validate not used
                if (promo.getUsedAt() != null || promo.getOrder() != null) {
                    throw new RuntimeException("Promo code already used");
                }

                int promoResId = promo.getRestaurant().getId();
                int percent = promo.getPercent();

                Long restaurantSubtotal = subtotalByRestaurant.get(promoResId);
                if (restaurantSubtotal == null || restaurantSubtotal <= 0) {
                    discountAmount = 0;
                } else {
                    // discount = subtotal * percent / 100 (rubles)
                    discountAmount = (restaurantSubtotal * (long) percent) / 100L;

                    // Consume promo now: set used_at + used_order_id
                    promo.setUsedAt(now);
                    promo.setOrder(order);
                    promoRepository.save(promo);

                    discountBreakdown = new java.util.HashMap<>();
                    discountBreakdown.put("code", promoCode);
                    discountBreakdown.put("percent", percent);
                    discountBreakdown.put("resId", promoResId);
                    discountBreakdown.put("restaurantName", restaurantNameById.get(promoResId));
                    discountBreakdown.put("restaurantSubtotal", restaurantSubtotal);
                    discountBreakdown.put("discountAmount", discountAmount);
                }

            }

            // 5) totalAfter
            long totalAfter = totalBefore - discountAmount;
            if (totalAfter < 0) totalAfter = 0;

            // Update order total (still PENDING)
            order.setTotalPrice(totalAfter);

            // 6) Create Stripe Checkout Session using totalAfter (kopeks)
            long amountInKopeks = Math.max(totalAfter * 100L, 50L);

            SessionCreateParams params = SessionCreateParams.builder()
                    .addPaymentMethodType(SessionCreateParams.PaymentMethodType.CARD)
                    .setMode(SessionCreateParams.Mode.PAYMENT)
                    .setSuccessUrl(frontendBaseUrl + "/payment/processing?session_id={CHECKOUT_SESSION_ID}")
                    .setCancelUrl(frontendBaseUrl + "/checkout?canceled=1")
                    .putMetadata("orderId", String.valueOf(order.getId()))
                    .putMetadata("userId", String.valueOf(user.getId()))
                    .addLineItem(
                            SessionCreateParams.LineItem.builder()
                                    .setQuantity(1L)
                                    .setPriceData(
                                            SessionCreateParams.LineItem.PriceData.builder()
                                                    .setCurrency("rub")
                                                    .setUnitAmount(amountInKopeks)
                                                    .setProductData(
                                                            SessionCreateParams.LineItem.PriceData.ProductData.builder()
                                                                    .setName("SoloLeaf order #" + order.getId())
                                                                    .build()
                                                    )
                                                    .build()
                                    )
                                    .build()
                    )
                    .build();

            Session session = Session.create(params);

            // 7) Save sessionId into order and persist final totalAfter
            order.setStripeSessionId(session.getId());
            orderRepository.save(order);

            // 8) Response (exact structure you want)
            java.util.Map<String, Object> data = new java.util.HashMap<>();
            data.put("orderId", order.getId());
            data.put("sessionId", session.getId());
            data.put("url", session.getUrl());
            data.put("currency", "rub");
            data.put("totalBefore", totalBefore);
            data.put("discount", discountBreakdown);
            data.put("totalAfter", totalAfter);

            ResponseData responseData = new ResponseData();
            responseData.setStatus(0);
            responseData.setData(data);

            return responseData;

        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to create checkout session: " + e.getMessage());
        }
    }

    // Helper: convert Food.price(double) to rubles(long)
    private long rublesFromFoodPrice(double price) {
        // Food.price is double, order stores integer rubles
        return Math.round(price);
    }
}

