package com.example.soloLeaf.controller.debug;

import com.example.soloLeaf.service.debug.OrderDebugSimulatorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * This controller is used to experience the fact that the order status is constantly changing
 * Do not use this controller when deploying on production
 */
@RestController
@RequestMapping("/api/debug/orders")
public class OrderDebugController {

    @Autowired
    private OrderDebugSimulatorService sim;

    @PostMapping("/{id}/simulate/start")
    public ResponseEntity<Map<String, Object>> start(@PathVariable("id") int orderId,
                                                     @RequestParam(value = "periodMs", defaultValue = "10000") long periodMs) {
        return ResponseEntity.ok(sim.start(orderId, periodMs));
    }

    @PostMapping("/{id}/simulate/stop")
    public ResponseEntity<Map<String, Object>> stop(@PathVariable("id") int orderId) {
        return ResponseEntity.ok(sim.stop(orderId));
    }

    @GetMapping("/{id}/simulate/status")
    public ResponseEntity<Map<String, Object>> status(@PathVariable("id") int orderId) {
        return ResponseEntity.ok(sim.status(orderId));
    }
}
