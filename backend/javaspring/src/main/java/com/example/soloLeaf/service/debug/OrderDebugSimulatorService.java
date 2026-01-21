package com.example.soloLeaf.service.debug;

import com.example.soloLeaf.entity.Order;
import com.example.soloLeaf.repository.OrderRepository;
import com.example.soloLeaf.service.push.OrderPushNotifier;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.concurrent.*;

/**
 * Debug-only service to simulate order status progression for demos and testing.
 *
 * Responsibilities:
 * - Start/stop a status simulation for a given order.
 * - Periodically advance the order status through a predefined sequence
 *   (e.g., CREATED -> CONFIRMED -> PREPARING -> DELIVERING -> COMPLETED).
 * - Trigger OrderPushNotifier on each status change so the user receives Web Push updates.
 *
 * Notes:
 * - This service is intended for development/demo purposes only.
 * - It should be disabled or protected in production (e.g., dev profile, admin-only endpoint).
 */
@Service
public class OrderDebugSimulatorService {

    private final ScheduledExecutorService scheduler =
            Executors.newScheduledThreadPool(2);

    private final ConcurrentHashMap<Integer, ScheduledFuture<?>> jobs = new ConcurrentHashMap<>();

    // Status sequence for simulation
    private static final List<String> FLOW = List.of(
            "PENDING",      // default
            "CONFIRMED",
            "PREPARING",
            "DELIVERING",
            "DONE"
    );

    @Autowired
    private OrderRepository orderRepository;

    @Autowired(required = false)
    private OrderPushNotifier orderPushNotifier;;

    public Map<String, Object> start(int orderId, long periodMs) {
        if (jobs.containsKey(orderId)) {
            return Map.of("started", false, "reason", "already_running");
        }

        Runnable task = () -> tick(orderId);

        ScheduledFuture<?> future = scheduler.scheduleAtFixedRate(
                task, 0, periodMs, TimeUnit.MILLISECONDS
        );

        jobs.put(orderId, future);
        return Map.of("started", true, "orderId", orderId, "periodMs", periodMs);
    }

    public Map<String, Object> stop(int orderId) {
        ScheduledFuture<?> f = jobs.remove(orderId);
        if (f == null) return Map.of("stopped", false, "reason", "not_running");
        f.cancel(false);
        return Map.of("stopped", true, "orderId", orderId);
    }

    public Map<String, Object> status(int orderId) {
        return Map.of("running", jobs.containsKey(orderId), "orderId", orderId);
    }

    private void tick(int orderId) {
        try {
            Order o = orderRepository.findById(orderId).orElse(null);
            if (o == null) {
                stop(orderId);
                return;
            }

            String current = o.getStatus();
            String next = nextStatus(current);

            if (next == null) {
                // already DONE -> stop
                stop(orderId);
                return;
            }

            o.setStatus(next);
            orderRepository.save(o);

            // Optional: send push on every status change
            if (orderPushNotifier != null) {
                long userId = o.getUser().getId();
                orderPushNotifier.notifyOrderStatus(userId, o.getId(), next);

            }

            // stop after DONE
            if ("DONE".equals(next)) {
                stop(orderId);
            }
        } catch (Exception ignored) {
            // In debug simulator: swallow exceptions to keep the scheduler alive
        }
    }

    private String nextStatus(String current) {
        if (current == null) return FLOW.get(0);

        int idx = FLOW.indexOf(current);
        if (idx < 0) {
            // unknown status -> reset to PENDING
            return FLOW.get(0);
        }
        if (idx == FLOW.size() - 1) {
            // already at DONE
            return null;
        }
        return FLOW.get(idx + 1);
    }
}
