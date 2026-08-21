package com.carebridge.repository;

import com.carebridge.model.VitalsLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface VitalsLogRepository extends JpaRepository<VitalsLog, Long> {
    List<VitalsLog> findByPatientIdOrderByLoggedAtDesc(Long patientId);
    List<VitalsLog> findByPatientIdAndVitalTypeOrderByLoggedAtAsc(Long patientId, VitalsLog.VitalType vitalType);
}
