package com.example.soloLeaf.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;


@Controller
public class MainController {

    @GetMapping("/")
    public String indexPage() {
        return "index";
    }

    @GetMapping("/signIn")
    public String signInPage() {
        return "signIn";
    }

    @GetMapping("/signUp")
    public String signUpPage() {
        return "signUp";
    }

    @GetMapping("/home")
    public String homePage() {
        return "home";
    }

    @GetMapping("/restaurant/{id}")
    public String restaurantPage(@PathVariable("id") Long id) {
        return "restaurant";
    }

    @GetMapping("/search")
    public String searchPage() {
        return "search";
    }

    @GetMapping("/spin")
    public String spinPage() {
        return "spin";
    }

    @GetMapping("/favourites")
    public String favouritesPage() {
        return "favourites";
    }

    @GetMapping("/orders")
    public String ordersPage() {
        return "orders";
    }

    @GetMapping("/messages")
    public String messagesPage() {
        return "messages";
    }

    @GetMapping("/profile")
    public String profilePage() {
        return "profile";
    }

    @GetMapping("/payment")
    public String paymentPage() {
        return "payment";
    }

    @GetMapping("/successPayment")
    public String successPaymentPage() {
        return "successPayment";
    }

    @GetMapping("/error")
    public String errorPage() {
        return "error";
    }
}
