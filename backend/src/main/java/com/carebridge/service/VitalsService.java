package com.carebridge.service;

import com.carebridge.model.VitalsLog;
import com.carebridge.model.PatientProfile;
import com.carebridge.repository.VitalsLogRepository;
import com.carebridge.repository.PatientProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class VitalsService {

    @Autowired
    private VitalsLogRepository vitalsLogRepository;

    @Autowired
    private PatientProfileRepository patientProfileRepository;

    public VitalsLog logVital(Long patientId, VitalsLog.VitalType vitalType, Double value, String unit) {
        PatientProfile profile = patientProfileRepository.findById(patientId)
            .orElseThrow(() -> new RuntimeException("Patient profile not found for id: " + patientId));

        boolean isSpike = checkSpikeCondition(vitalType, value);

        VitalsLog log = VitalsLog.builder()
            .patient(profile)
            .vitalType(vitalType)
            .value(value)
            .unit(unit)
            .isSpikeAlert(isSpike)
            .loggedAt(LocalDateTime.now())
            .build();

        return vitalsLogRepository.save(log);
    }

    public List<VitalsLog> getPatientVitals(Long patientId) {
        return vitalsLogRepository.findByPatientIdOrderByLoggedAtDesc(patientId);
    }

    private boolean checkSpikeCondition(VitalsLog.VitalType vitalType, Double value) {
        if (vitalType == VitalsLog.VitalType.BP_SYS && value > 140.0) return true;
        if (vitalType == VitalsLog.VitalType.BP_DIA && value > 90.0) return true;
        if (vitalType == VitalsLog.VitalType.BLOOD_SUGAR_FASTING && value > 140.0) return true;
        if (vitalType == VitalsLog.VitalType.BLOOD_SUGAR_PP && value > 180.0) return true;
        if (vitalType == VitalsLog.VitalType.SPO2 && value < 92.0) return true;
        return false;
    }
}
