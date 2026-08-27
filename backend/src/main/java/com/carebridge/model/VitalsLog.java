package com.carebridge.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "vitals_log")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VitalsLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "patient_id", nullable = false)
    private PatientProfile patient;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private VitalType vitalType; // BP_SYS, BP_DIA, BLOOD_SUGAR_FASTING, BLOOD_SUGAR_PP, SPO2, HEART_RATE

    @Column(nullable = false)
    private Double value;

    private String unit; // mmHg, mg/dL, %, bpm

    @Column(nullable = false)
    private Boolean isSpikeAlert = false; // Flagged if exceeding safe thresholds

    @Column(nullable = false, updatable = false)
    private LocalDateTime loggedAt = LocalDateTime.now();

    public enum VitalType {
        BP_SYS,
        BP_DIA,
        BLOOD_SUGAR_FASTING,
        BLOOD_SUGAR_PP,
        SPO2,
        HEART_RATE
    }
}
