package com.carebridge.controller;

import com.carebridge.model.PatientProfile;
import com.carebridge.model.Reminder;
import com.carebridge.repository.PatientProfileRepository;
import com.carebridge.repository.ReminderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/emergency")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class EmergencyPassController {

    private final PatientProfileRepository patientProfileRepository;
    private final ReminderRepository reminderRepository;

    @GetMapping("/{tokenOrCode}")
    public ResponseEntity<?> getEmergencyPass(@PathVariable String tokenOrCode) {
        Optional<PatientProfile> profileOpt = patientProfileRepository.findByEmergencyQrToken(tokenOrCode);
        if (profileOpt.isEmpty()) {
            profileOpt = patientProfileRepository.findByLinkCode(tokenOrCode);
        }

        if (profileOpt.isEmpty()) {
            // Return 404 or gracefully fallback
            return ResponseEntity.notFound().build();
        }

        PatientProfile profile = profileOpt.get();
        List<Reminder> reminders = reminderRepository.findByPatientId(profile.getUser().getId());

        Map<String, Object> response = new HashMap<>();
        response.put("name", profile.getUser().getName());
        response.put("bloodGroup", profile.getBloodGroup() != null ? profile.getBloodGroup() : "Not Specified");
        response.put("allergies", profile.getAllergies() != null ? profile.getAllergies() : "None Reported");
        response.put("condition", profile.getChronicConditions() != null ? profile.getChronicConditions() : "Post-Hospital Recovery");
        response.put("caregiverName", profile.getEmergencyContactName() != null ? profile.getEmergencyContactName() : "Primary Guardian");
        response.put("caregiverPhone", profile.getEmergencyContactPhone() != null ? profile.getEmergencyContactPhone() : "+91 98765 43210");
        response.put("reminders", reminders);

        return ResponseEntity.ok(response);
    }
}
