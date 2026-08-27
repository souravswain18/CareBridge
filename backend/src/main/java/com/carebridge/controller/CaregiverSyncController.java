package com.carebridge.controller;

import com.carebridge.model.*;
import com.carebridge.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping(/api/caregiver)
@RequiredArgsConstructor
@CrossOrigin(origins = *)
public class CaregiverSyncController {

    private final PatientProfileRepository patientProfileRepository;
    private final ReminderRepository reminderRepository;
    private final VitalsLogRepository vitalsLogRepository;

    @GetMapping(/patient/{linkCode}/telemetry)
    public ResponseEntity<?> getPatientTelemetry(@PathVariable String linkCode) {
        Optional<PatientProfile> profileOpt = patientProfileRepository.findByLinkCode(linkCode);
        if (profileOpt.isEmpty()) {
            profileOpt = patientProfileRepository.findByEmergencyQrToken(linkCode);
        }

        if (profileOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        PatientProfile profile = profileOpt.get();
        Long patientUserId = profile.getUser().getId();

        List<Reminder> reminders = reminderRepository.findByPatientId(patientUserId);
        List<VitalsLog> vitals = vitalsLogRepository.findByPatientIdOrderByTimestampAsc(patientUserId);

        Map<String, Object> result = new HashMap<>();
        result.put(patientId, patientUserId);
        result.put(name, profile.getUser().getName());
        result.put(email, profile.getUser().getEmail());
        result.put(bloodGroup, profile.getBloodGroup());
        result.put(allergies, profile.getAllergies());
        result.put(condition, profile.getChronicConditions());
        result.put(caregiverPhone, profile.getEmergencyContactPhone());
        result.put(reminders, reminders);
        result.put(vitals, vitals);

        return ResponseEntity.ok(result);
    }
}
