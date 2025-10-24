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

    @GetMapping("/main")
    public String mainPage() {
        return "home";
    }

    @GetMapping("/restaurant/{id}")
    public String restaurantPage(@PathVariable("id") Long id) {
        return "restaurant";
    }

    @GetMapping("/error")
    public String errorPage() {
        return "error";
    }
}
