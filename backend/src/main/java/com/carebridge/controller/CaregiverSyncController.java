package com.carebridge.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@RestController
@RequestMapping("/api/caregiver")
@CrossOrigin(origins = "*")
public class CaregiverSyncController {

    // Fast In-Memory Cloud Telemetry Store keyed by LinkCode/Email
    private static final Map<String, Map<String, Object>> LIVE_TELEMETRY = new ConcurrentHashMap<>();

    @PostMapping("/sync")
    public ResponseEntity<?> syncPatientData(@RequestBody Map<String, Object> payload) {
        String linkCode = (String) payload.getOrDefault("linkCode", "");
        String email = (String) payload.getOrDefault("email", "");

        String key = !linkCode.isEmpty() ? linkCode.toUpperCase() : email.toLowerCase();
        if (key.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "linkCode or email required"));
        }

        Map<String, Object> existing = LIVE_TELEMETRY.getOrDefault(key, new HashMap<>());
        Map<String, Object> merged = new HashMap<>(existing);

        // Merge fields
        payload.forEach((k, v) -> {
            if (v != null) {
                if ("milestones".equals(k)) {
                    List<?> incomingM = (List<?>) v;
                    List<?> existingM = (List<?>) existing.get("milestones");
                    if (incomingM.size() >= (existingM != null ? existingM.size() : 0)) {
                        merged.put("milestones", incomingM);
                    }
                } else if ("reminders".equals(k)) {
                    List<?> incomingR = (List<?>) v;
                    List<?> existingR = (List<?>) existing.get("reminders");
                    if (incomingR.size() >= (existingR != null ? existingR.size() : 0)) {
                        merged.put("reminders", incomingR);
                    }
                } else {
                    merged.put(k, v);
                }
            }
        });

        if (!linkCode.isEmpty()) {
            LIVE_TELEMETRY.put(linkCode.toUpperCase(), merged);
        }
        if (!email.isEmpty()) {
            LIVE_TELEMETRY.put(email.toLowerCase(), merged);
        }

        return ResponseEntity.ok(Map.of("status", "SUCCESS", "syncedAt", System.currentTimeMillis()));
    }

    @GetMapping("/patient/{linkCode}/telemetry")
    public ResponseEntity<?> getPatientTelemetry(@PathVariable String linkCode) {
        String key = linkCode.toUpperCase();
        Map<String, Object> data = LIVE_TELEMETRY.get(key);
        
        if (data == null) {
            data = LIVE_TELEMETRY.get(linkCode.toLowerCase());
        }

        if (data != null) {
            return ResponseEntity.ok(data);
        }

        // Return empty structure gracefully if not yet synced
        return ResponseEntity.ok(Map.of(
            "name", "Patient (" + linkCode + ")",
            "linkCode", linkCode,
            "reminders", List.of(),
            "vitals", List.of(),
            "condition", "Recovery Monitoring Active"
        ));
    }
}
