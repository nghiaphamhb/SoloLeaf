package com.example.soloLeaf.service.push;

import com.example.soloLeaf.service.imp.OrderPushNotifierImp;
import org.springframework.stereotype.Service;

import com.example.soloLeaf.entity.PushSubscription;
import com.example.soloLeaf.repository.PushSubscriptionRepository;
import org.springframework.beans.factory.annotation.Value;

import java.util.List;

/**
 * Order-specific push notification orchestrator.
 *
 * Responsibilities:
 * - Decide WHEN to notify the user about order status changes (business rules).
 * - Convert an Order status update into a user-friendly notification message.
 * - Build a "declarative" Web Push payload (web_push: 8030) for Safari/WebKit compatibility.
 * - Delegate the actual sending/encryption/VAPID work to PushSender.
 *
 * Notes:
 * - This is business logic (order domain), not infrastructure.
 * - PushSender is the lower-level transport layer; OrderPushNotifier owns the content and timing.
 */
@Service
public class OrderPushNotifier implements OrderPushNotifierImp {

    private final PushSubscriptionRepository repo;
    private final PushSender sender;

    @Value("${frontend.base-url}")
    private String frontendBaseUrl;

    public OrderPushNotifier(PushSubscriptionRepository repo, PushSender sender) {
        this.repo = repo;
        this.sender = sender;
    }

    @Override
    public void notifyOrderStatus(long userId, int orderId, String status) {
        List<PushSubscription> subs = repo.findAllByUserIdAndActiveTrue(userId);
        if (subs.isEmpty()) return;

        // TODO: frontendBaseUrl) + "/orders/" + orderId -> maybe open the order's card by id
        String navigate = normalizeBaseUrl(frontendBaseUrl) + "/orders";

        String body = buildBody(orderId, status);

        String payload = """
        {
          "web_push": 8030,
          "mutable": false,
          "notification": {
            "title": "SoloLeaf",
            "body": "%s",
            "navigate": "%s",
            "tag": "order-%d"
          }
        }
        """.formatted(escapeJson(body), escapeJson(navigate), orderId);

        for (PushSubscription sub : subs) {
            try {
                sender.sendJson(sub, payload);
            } catch (Exception ignored) {
                // optional: mark inactive on repeated failures
            }
        }
    }

    private String buildBody(int orderId, String status) {
        return switch (status) {
            case "PENDING" -> "Order #" + orderId + ": pending ✅";
            case "CONFIRMED" -> "Order #" + orderId + ": confirmed 👍";
            case "PREPARING" -> "Order #" + orderId + ": is preparing 🍳";
            case "DELIVERING" -> "Order #" + orderId + ": is delivering 🚚";
            case "DONE" -> "Order #" + orderId + ": done 🎉";
            default -> "Order #" + orderId + ": status " + status;
        };
    }

    private String normalizeBaseUrl(String base) {
        if (base == null) return "";
        return base.endsWith("/") ? base.substring(0, base.length() - 1) : base;
    }

    // Minimal JSON escaping for quotes/backslashes/newlines
    private String escapeJson(String s) {
        if (s == null) return "";
        return s.replace("\\", "\\\\")
                .replace("\"", "\\\"")
                .replace("\n", "\\n")
                .replace("\r", "\\r");
    }

}
