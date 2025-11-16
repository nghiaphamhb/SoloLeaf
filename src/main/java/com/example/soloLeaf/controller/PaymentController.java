package com.example.soloLeaf.controller;

import com.example.soloLeaf.dto.FoodDTO;
import com.stripe.Stripe;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.Arrays;
import java.util.List;

@RestController
public class PaymentController {

    static {
        Stripe.apiKey = "sk_test_51ST1qkIwREZvDqNKoOUUsTbFHRpcPA4fadEx8Umqr4zCX2IUmsFYebWwVtXpPLCddLslBD2diCZnXxZIL637yXut00bij2nMbs";  // Thay bằng Secret Key của bạn
    }

    @PostMapping("/create-checkout-session")
    public String createCheckoutSession(@RequestBody List<FoodDTO> cartItems) {
        try {

//            System.out.println("Cart items received: " + cartItems.toString()); // for debug
            // Tạo Checkout session với các tham số
            SessionCreateParams.Builder sessionBuilder = SessionCreateParams.builder()
                    .addPaymentMethodType(SessionCreateParams.PaymentMethodType.CARD) //  phương thức thanh toán là "card"
                    .setMode(SessionCreateParams.Mode.PAYMENT)  // Chế độ thanh toán
                    .setSuccessUrl("http://localhost:8080/successPayment")  // URL khi thanh toán thành công
                    .setCancelUrl("http://localhost:8080/home");    // URL khi thanh toán bị hủy

            // Thêm các mặt hàng vào `lineItems`
            for (FoodDTO item : cartItems) {
                SessionCreateParams.LineItem lineItem = SessionCreateParams.LineItem.builder()
                        .setPriceData(
                                SessionCreateParams.LineItem.PriceData.builder()
                                        .setCurrency("rub")
                                        .setUnitAmount(Math.max((long) item.getPrice() * 100, 50L))  // Giá của mặt hàng
                                        .setProductData(
                                                SessionCreateParams.LineItem.PriceData.ProductData.builder()
                                                        .setName(item.getTitle())  // Tên sản phẩm
                                                        .build()
                                        )
                                        .build()
                        )
                        .setQuantity(((long) item.getQty()))   // Số lượng sản phẩm
                        .build();

                sessionBuilder.addLineItem(lineItem);  // Thêm mặt hàng vào giỏ hàng
            }

            // Tạo session thanh toán và trả về sessionId
            SessionCreateParams params = sessionBuilder.build();
            Session session = Session.create(params);

            return session.getId(); // Trả về sessionId cho frontend
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
}
