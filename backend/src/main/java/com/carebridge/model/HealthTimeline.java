package com.carebridge.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "health_timeline")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HealthTimeline {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "patient_id", nullable = false)
    private PatientProfile patient;

    @Column(nullable = false)
    private String eventTitle; // e.g. "Hospital Discharge", "First Walk", "Stitches Removed"

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EventType eventType; // SURGERY, DISCHARGE, CHECKUP, MEDICATION_CHANGE, MILESTONE

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private LocalDateTime eventDate;

    public enum EventType {
        SURGERY,
        DISCHARGE,
        CHECKUP,
        MEDICATION_CHANGE,
        MILESTONE
    }
}
