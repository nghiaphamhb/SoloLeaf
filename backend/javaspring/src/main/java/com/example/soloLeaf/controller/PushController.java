package com.example.soloLeaf.controller;

import com.example.soloLeaf.entity.PushSubscription;
import com.example.soloLeaf.entity.Users;
import com.example.soloLeaf.payload.request.PushSubscribeRequest;
import com.example.soloLeaf.repository.PushSubscriptionRepository;
import com.example.soloLeaf.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;

/**
 * Get push subscription from FE
 */
@RestController
@RequestMapping("/api/push")
public class PushController {
    @Autowired
    PushSubscriptionRepository repo;

    @Autowired
    UserRepository userRepository;

    @PostMapping("/subscribe")
    public ResponseEntity<?> subscribe(@RequestBody PushSubscribeRequest req,
                                       Authentication authentication) {
        Long userId = getCurrentUserId(authentication);

        if (req == null || req.endpoint == null || req.keys == null ||
                req.keys.p256dh == null || req.keys.auth == null || req.deviceId == null) {
            return ResponseEntity.badRequest().body("Invalid subscription payload");
        }

        PushSubscription sub = repo.findByEndpoint(req.endpoint).orElseGet(PushSubscription::new);

        sub.setUserId(userId);
        sub.setEndpoint(req.endpoint);
        sub.setP256dh(req.keys.p256dh);
        sub.setAuth(req.keys.auth);
        sub.setDeviceId(req.deviceId);
        sub.setUserAgent(req.userAgent);
        sub.setActive(true);
        sub.setLastSeenAt(Instant.now());

        if (sub.getCreatedAt() == null) sub.setCreatedAt(Instant.now());

        repo.save(sub);
        return ResponseEntity.ok().build();
    }

    private Long getCurrentUserId(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("Unauthorized");
        }

        String email = authentication.getName(); // username = email
        Users user = userRepository.findByEmail(email);
        if (user == null) throw new RuntimeException("User not found");

        return (long) user.getId();
    }
}
