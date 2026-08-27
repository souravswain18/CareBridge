package com.carebridge.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping(/api/health)
@CrossOrigin(origins = *)
public class HealthController {

    @GetMapping
    public ResponseEntity<Map<String, Object>> getHealthStatus() {
        Map<String, Object> health = new HashMap<>();
        health.put(status, UP);
        health.put(service, Nivaan Health & Recovery Backend);
        health.put(version, 1.0.0);
        health.put(timestamp, Instant.now().toString());
        health.put(environment, Production / Render Cloud);
        health.put(message, Nivaan Backend is healthy, operational, and ready.);
        
        return ResponseEntity.ok(health);
    }
}
